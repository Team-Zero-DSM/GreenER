import { Pool } from 'pg';
import { SessionAccount } from './types/accounts.types.js';

export const accountColumns = 'id, nome AS name, email, papel AS role';

export class AccountsRepository {
    constructor(private readonly pool: Pool) {}

    async create(name: string, email: string, hash: string) {
        const { rows } = await this.pool.query<SessionAccount>(
            `INSERT INTO usuario (nome, email, senha_hash, papel) VALUES ($1, $2, $3, 'visualizador')
         RETURNING ${accountColumns}, versao_sessao AS "sessionVersion"`,
            [name, email, hash],
        );
        return rows[0];
    }

    async findActiveById(id: string) {
        const { rows } = await this.pool.query<SessionAccount>(
            `SELECT ${accountColumns}, versao_sessao AS "sessionVersion" FROM usuario WHERE id = $1 AND acesso_ativo`,
            [id],
        );
        return rows[0] ?? null;
    }
}
