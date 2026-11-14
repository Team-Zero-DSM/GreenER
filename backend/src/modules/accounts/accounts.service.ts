import { randomBytes } from 'node:crypto';
import { AppError } from '../../shared/errors/AppError.js';
import { AccountsRepository } from './accounts.repository.js';
import { AccountCredentials, RegisterInput } from './accounts.schema.js';
import { authSecret, createSession } from './accounts.session.js';
import bcrypt from 'bcrypt';

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
}
