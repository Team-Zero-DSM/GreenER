import { Pool } from 'pg';
import type { Credentials, SessionAccount } from './types/accounts.types.js';

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

    async findActiveByEmail(email: string) {
        const { rows } = await this.pool.query<Credentials>(
            `SELECT ${accountColumns}, senha_hash AS "passwordHash", versao_sessao AS "sessionVersion"
         FROM usuario WHERE lower(email) = $1 AND acesso_ativo ORDER BY id LIMIT 1`,
            [email],
        );
        return rows[0] ?? null;
    }

    async issueReset(email: string, tokenHash: string) {
        const { rows } = await this.pool.query<{ email: string }>(
            `WITH candidate AS (
            SELECT id, email FROM usuario WHERE lower(email) = $1 AND acesso_ativo ORDER BY id LIMIT 1 FOR UPDATE
         ), issued AS (
            INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em)
            SELECT $2, id, now() + interval '30 minutes' FROM candidate
            RETURNING usuario_id
         )
         SELECT email FROM candidate JOIN issued ON issued.usuario_id = candidate.id`,
            [email, tokenHash],
        );
        return rows[0]?.email;
    }
}
