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
}
