import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DashboardsRepository } from '../../../../src/modules/dashboards/dashboards.repository.js';
import { DashboardsService } from '../../../../src/modules/dashboards/dashboards.service.js';
import { createTestDatabase, testDatabaseUrl, type TestDatabase } from '../../helpers/database.js';

describe.skipIf(!testDatabaseUrl)('Painel do usuário com PostgreSQL', () => {
    let database: TestDatabase;
    let userId: string;

    beforeAll(async () => {
        database = await createTestDatabase();
        const result = await database.pool.query<{ id: string }>(
            `INSERT INTO usuario (email, senha_hash, nome) VALUES ('ana@greener.dev', 'x', 'Ana') RETURNING id`,
        );
        userId = result.rows[0].id;
    }, 15000);
    afterAll(async () => {
        await database?.close();
    });

    it('deve devolver dashboard null quando o usuário ainda não salvou um painel', async () => {
        const service = new DashboardsService(new DashboardsRepository(database.pool));

        await expect(service.getMine(userId)).resolves.toEqual({ dashboard: null });
    });

    it('deve devolver o painel gravado na tabela painel_usuario', async () => {
        const widgets = [{ id: 'co2e-total', type: 'kpi', title: 'CO₂e', x: 0, y: 0, w: 3, h: 2 }];
        await database.pool.query(
            `INSERT INTO painel_usuario (usuario_id, template, widgets) VALUES ($1, 'visao-geral', $2)`,
            [userId, JSON.stringify(widgets)],
        );
        const service = new DashboardsService(new DashboardsRepository(database.pool));

        await expect(service.getMine(userId)).resolves.toEqual({
            dashboard: { template: 'visao-geral', widgets },
        });
    });

    it('deve criar o painel no primeiro PUT e substituí-lo nos seguintes', async () => {
        const service = new DashboardsService(new DashboardsRepository(database.pool));
        const created = await database.pool.query<{ id: string }>(
            `INSERT INTO usuario (email, senha_hash, nome) VALUES ('bia@greener.dev', 'x', 'Bia') RETURNING id`,
        );
        const otherId = created.rows[0].id;
        const first = {
            template: 'executivo',
            widgets: [
                { id: 'co2e-total', type: 'kpi' as const, title: 'CO₂e', x: 0, y: 0, w: 6, h: 3 },
            ],
        };
        const second = {
            template: 'em-branco',
            widgets: [
                {
                    id: 'status-servicos',
                    type: 'status' as const,
                    title: 'Status',
                    x: 0,
                    y: 0,
                    w: 4,
                    h: 3,
                },
            ],
            tablet: { 'status-servicos': { x: 0, y: 0, w: 6, h: 3 } },
            mobileOrder: ['status-servicos'],
        };

        await expect(service.saveMine(otherId, first)).resolves.toEqual({ dashboard: first });
        await expect(service.saveMine(otherId, second)).resolves.toEqual({ dashboard: second });

        // Continua uma linha só por usuário, com a última configuração enviada.
        const rows = await database.pool.query(
            'SELECT template FROM painel_usuario WHERE usuario_id = $1',
            [otherId],
        );
        expect(rows.rows).toEqual([{ template: 'em-branco' }]);
        await expect(service.getMine(otherId)).resolves.toEqual({ dashboard: second });
    });
});
