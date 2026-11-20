import type { Pool } from 'pg';
import { AppError } from '../../shared/errors/AppError.js';
import { accountColumns } from '../accounts/accounts.repository.js';
import type { MemberAccess, MembersQuery } from './project.schema.js';
import type { ProjectMember } from './types/project.types.js';

const memberColumns = `${accountColumns}, acesso_ativo AS active`;

export class ProjectRepository {
    constructor(private readonly pool: Pool) {}

    async getInterval(): Promise<number | undefined> {
        const { rows } = await this.pool.query<{ intervalSeconds: number }>(
            'SELECT intervalo_coleta_segundos AS "intervalSeconds" FROM configuracao_sistema WHERE id',
        );
        return rows[0]?.intervalSeconds;
    }

    async updateInterval(intervalSeconds: number, actor: string) {
        await this.pool.query(
            `INSERT INTO configuracao_sistema (id, intervalo_coleta_segundos, atualizado_por, atualizado_em)
             VALUES (true, $1, $2, now()) ON CONFLICT (id) DO UPDATE SET
             intervalo_coleta_segundos = EXCLUDED.intervalo_coleta_segundos,
             atualizado_por = EXCLUDED.atualizado_por, atualizado_em = now()`,
            [intervalSeconds, actor],
        );
    }

    async listMembers({ search, active }: MembersQuery) {
        const { rows } = await this.pool.query<ProjectMember>(
            `SELECT ${memberColumns} FROM usuario
             WHERE (strpos(lower(email), lower($1)) > 0 OR strpos(lower(nome), lower($1)) > 0)
               AND ($2::boolean IS NULL OR acesso_ativo = $2)
             ORDER BY acesso_ativo DESC, lower(nome), id LIMIT 100`,
            [search, active ?? null],
        );
        return rows;
    }

    async updateMember(id: string, actor: string, { role, active }: MemberAccess) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            // Serializa alterações administrativas e a criação do primeiro administrador.
            await client.query('LOCK TABLE usuario IN SHARE ROW EXCLUSIVE MODE');
            const { rows } = await client.query<ProjectMember>(
                `SELECT ${memberColumns} FROM usuario
                 WHERE id = ANY($1::bigint[]) ORDER BY id FOR UPDATE`,
                [[actor, id]],
            );
            if (!rows.some((user) => user.id === actor && user.role === 'admin' && user.active)) {
                throw new AppError('Acesso administrativo indisponível.', 403);
            }
            const member = rows.find((user) => user.id === id);
            if (!member) throw new AppError('Usuário não encontrado.', 404);
            if (member.role === 'admin' && member.active && (role !== 'admin' || !active)) {
                const remaining = await client.query(
                    "SELECT 1 FROM usuario WHERE papel = 'admin' AND acesso_ativo AND id <> $1 LIMIT 1",
                    [id],
                );
                if (!remaining.rowCount) {
                    throw new AppError('Mantenha pelo menos um administrador ativo.', 409);
                }
            }
            const updated = await client.query<ProjectMember>(
                `UPDATE usuario SET papel = $2, acesso_ativo = $3,
                 versao_sessao = versao_sessao + CASE
                     WHEN papel <> $2 OR acesso_ativo <> $3 THEN 1 ELSE 0 END
                 WHERE id = $1 RETURNING ${memberColumns}`,
                [id, role, active],
            );
            if (!active) {
                await client.query('DELETE FROM redefinicao_senha WHERE usuario_id = $1', [id]);
            }
            await client.query('COMMIT');
            return updated.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
