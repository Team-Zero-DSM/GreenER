import { Pool, type PoolClient } from 'pg';
import type { Credentials, SessionAccount } from './types/accounts.types.js';
import { AppError } from '../../shared/errors/AppError.js';

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

    async consumeReset(tokenHash: string, hash: string) {
        await this.transaction(async (client) => {
            const { rows } = await client.query<{ id: string }>(
                `SELECT u.id FROM usuario u JOIN redefinicao_senha r ON r.usuario_id = u.id
             WHERE r.token_hash = $1 AND r.usado_em IS NULL AND r.expira_em > now() AND u.acesso_ativo
             FOR UPDATE OF u`,
                [tokenHash],
            );
            const account = rows[0];
            const invalid = () =>
                new AppError('O link expirou ou já foi usado. Solicite outro.', 400);
            if (!account) throw invalid();
            const consumed = await client.query(
                `UPDATE redefinicao_senha SET usado_em = now()
             WHERE token_hash = $1 AND usado_em IS NULL AND expira_em > now()`,
                [tokenHash],
            );
            if (!consumed.rowCount) throw invalid();
            await this.savePassword(client, account.id, hash);
        });
    }

    async updateProfile(id: string, name: string, email: string) {
        return this.transaction(async (client) => {
            const { rows: current } = await client.query<{ email: string }>(
                'SELECT email FROM usuario WHERE id = $1 AND acesso_ativo FOR UPDATE',
                [id],
            );
            if (!current[0]) throw new AppError('Conta indisponível.', 401);
            const changedEmail = email !== current[0].email;
            const { rows } = await client.query<SessionAccount>(
                `UPDATE usuario SET nome = $2, email = $3, versao_sessao = versao_sessao + $4
             WHERE id = $1 RETURNING ${accountColumns}, versao_sessao AS "sessionVersion"`,
                [id, name, email, changedEmail ? 1 : 0],
            );
            if (changedEmail) {
                await client.query('DELETE FROM redefinicao_senha WHERE usuario_id = $1', [id]);
            }
            return rows[0];
        });
    }

    async changePassword(id: string, generateHash: (currentHash: string) => Promise<string>) {
        return this.transaction(async (client) => {
            const { rows: current } = await client.query<{ hash: string }>(
                'SELECT senha_hash AS hash FROM usuario WHERE id = $1 AND acesso_ativo FOR UPDATE',
                [id],
            );
            if (!current[0]) throw new AppError('Conta indisponível.', 401);
            const hash = await generateHash(current[0].hash);
            return this.savePassword(client, id, hash);
        });
    }

    private async savePassword(client: PoolClient, id: string, hash: string) {
        const { rows } = await client.query<SessionAccount>(
            `UPDATE usuario SET senha_hash = $2, versao_sessao = versao_sessao + 1
             WHERE id = $1 RETURNING ${accountColumns}, versao_sessao AS "sessionVersion"`,
            [id, hash],
        );
        await client.query('DELETE FROM redefinicao_senha WHERE usuario_id = $1', [id]);
        return rows[0];
    }

    private async transaction<T>(operation: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await operation(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
