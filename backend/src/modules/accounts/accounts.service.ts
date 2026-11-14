import { AccountsRepository } from './accounts.repository.js';
import { RegisterInput } from './accounts.schema.js';
import { authSecret, createSession } from './accounts.session.js';
import bcrypt from 'bcrypt';

export class AccountsService {
    constructor(private readonly repository: AccountsRepository) {}

    async register({ name, email, password }: RegisterInput) {
        authSecret();
        const hash = await bcrypt.hash(password, 12);
        return createSession(await this.repository.create(name, email, hash));
    }
}
