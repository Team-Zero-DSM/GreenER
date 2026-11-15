import { createHash, randomBytes } from 'node:crypto';
import { AppError } from '../../shared/errors/AppError.js';
import { AccountsRepository } from './accounts.repository.js';
import { AccountCredentials, RegisterInput, ResetPasswordInput } from './accounts.schema.js';
import { authSecret, createSession } from './accounts.session.js';
import bcrypt from 'bcrypt';
import { passwordResetMailer } from './reset-mail.js';

const digest = (token: string) => createHash('sha256').update(token).digest('hex');
const dummyHash = bcrypt.hashSync(randomBytes(32).toString('hex'), 12);

export class AccountsService {
    constructor(private readonly repository: AccountsRepository) {}

    async register({ name, email, password }: RegisterInput) {
        authSecret();
        const hash = await bcrypt.hash(password, 12);
        return createSession(await this.repository.create(name, email, hash));
    }

    async login({ email, password }: AccountCredentials) {
        const account = await this.repository.findActiveByEmail(email);
        const valid = await bcrypt.compare(password, account?.passwordHash ?? dummyHash);
        if (!account || !valid) throw new AppError('E-mail ou senha incorretos.', 401);
        return createSession(account);
    }

    async requestPasswordReset(email: string) {
        const send = passwordResetMailer();
        const token = randomBytes(32).toString('hex');
        const recipient = await this.repository.issueReset(email, digest(token));
        if (recipient)
            void send(recipient, token).catch(() =>
                console.error('[auth] Falha no envio da redefinição.'),
            );
    }

    async resetPassword({ token, password }: ResetPasswordInput) {
        const hash = await bcrypt.hash(password, 12);
        await this.repository.consumeReset(digest(token), hash);
    }
}
