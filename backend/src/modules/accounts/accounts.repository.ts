import { Pool } from 'pg';
import { SessionAccount } from './types/accounts.types.js';

export const accountColumns = 'id, nome AS name, email, papel AS role';

export class AccountRepository {
    constructor(private readonly pool: Pool) {}

    async findActiveById(id: string) {
        const { rows } = await this.pool.query<SessionAccount>(
            `SELECT ${accountColumns}, versao_sessao AS "sessionVersion" FROM usuario WHERE id = $1 AND acesso_ativo`,
            [id],
        );
        return rows[0] ?? null;
    }
}
