import { Pool } from 'pg';
import type { DashboardConfig, DashboardRow } from './types/dashboards.types.js';

function toConfig(row: DashboardRow): DashboardConfig {
    return {
        template: row.template,
        widgets: row.widgets,
        ...(row.posicoes_tablet ? { tablet: row.posicoes_tablet } : {}),
        ...(row.ordem_mobile ? { mobileOrder: row.ordem_mobile } : {}),
    };
}

export class DashboardsRepository {
    constructor(private readonly pool: Pool) {}

    async findByUser(userId: string): Promise<DashboardConfig | null> {
        const result = await this.pool.query<DashboardRow>(
            `
            SELECT template, widgets, posicoes_tablet, ordem_mobile
            FROM painel_usuario
            WHERE usuario_id = $1
            `,
            [userId],
        );
        const row = result.rows[0];
        return row ? toConfig(row) : null;
    }

    // Cria ou substitui o painel do usuário (cada usuário tem um só).
    async upsert(userId: string, config: DashboardConfig): Promise<DashboardConfig> {
        const result = await this.pool.query<DashboardRow>(
            `
            INSERT INTO painel_usuario (usuario_id, template, widgets, posicoes_tablet, ordem_mobile)
            VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb)
            ON CONFLICT (usuario_id) DO UPDATE SET
                template = EXCLUDED.template,
                widgets = EXCLUDED.widgets,
                posicoes_tablet = EXCLUDED.posicoes_tablet,
                ordem_mobile = EXCLUDED.ordem_mobile,
                atualizado_em = now()
            RETURNING template, widgets, posicoes_tablet, ordem_mobile
            `,
            [
                userId,
                config.template,
                JSON.stringify(config.widgets),
                config.tablet ? JSON.stringify(config.tablet) : null,
                config.mobileOrder ? JSON.stringify(config.mobileOrder) : null,
            ],
        );
        return toConfig(result.rows[0]);
    }
}
