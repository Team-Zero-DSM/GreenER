import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AccountsRepository } from '../../../../src/modules/accounts/accounts.repository.js';
import { createSession } from '../../../../src/modules/accounts/accounts.session.js';
import { startTestApi, type TestApi } from '../../helpers/api.js';
import { createTestDatabase, testDatabaseUrl, type TestDatabase } from '../../helpers/database.js';

const filters = {
    title: 'Consumo dos serviços',
    serviceIds: ['service-a', 'service-b'],
    range: '1h',
    metrics: ['energy', 'carbon'],
    visualization: 'table',
    end: '2026-11-06T12:00:00Z',
};

describe.skipIf(!testDatabaseUrl)('Painel e relatórios', () => {
    let database: TestDatabase;
    let api: TestApi;
    let token: string;
    let userId: string;

    beforeAll(async () => {
        database = await createTestDatabase();
        api = await startTestApi(database);
        const account = await new AccountsRepository(database.pool).create(
            'Ana',
            'ana@example.com',
            'hash',
        );
        token = createSession(account).token;
        userId = account.id;
    }, 15000);

    afterAll(async () => {
        await api?.close();
        await database?.close();
    });

    function post(path: string, body: unknown) {
        return fetch(`${api.url}${path}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });
    }

    it('salva e consulta a configuração do painel', async () => {
        const config = { template: 'em-branco', widgets: [] };
        const saved = await fetch(`${api.url}/dashboards/me`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
            body: JSON.stringify(config),
        });
        const response = await fetch(`${api.url}/dashboards/me`, {
            headers: { authorization: `Bearer ${token}` },
        });
        const databasePanel = await database.pool.query(
            'SELECT template, widgets FROM painel_usuario WHERE usuario_id = $1',
            [userId],
        );

        expect(saved.status).toBe(200);
        expect((await response.json()).dashboard).toEqual(config);
        expect(databasePanel.rows[0]).toEqual(config);
    });

    it('confere as métricas usadas pelo painel com os valores do banco', async () => {
        const response = await fetch(
            `${api.url}/services/service-a/collections?range=1h&to=2026-11-06T12:00:00Z`,
        );
        const data = await response.json();
        const totals = await database.pool.query(`
            SELECT count(*)::int AS samples, sum(energia_estimada_kwh)::float8 AS energy,
                sum(co2e_estimado_g)::float8 AS carbon FROM coleta
            WHERE servico_id = (SELECT id FROM servico WHERE external_id = 'service-a')
                AND coletado_em > '2026-11-06 11:00:00+00' AND coletado_em <= '2026-11-06 12:00:00+00'
        `);

        expect(response.status).toBe(200);
        expect(data.summary.sampleCount).toBe(totals.rows[0].samples);
        expect(data.summary.energyKwh).toBe(totals.rows[0].energy);
        expect(data.summary.co2eGrams).toBe(totals.rows[0].carbon);
    });

    it('gera a prévia com os dados dos serviços selecionados', async () => {
        const response = await post('/reports/preview', filters);
        const report = await response.json();

        expect(response.status).toBe(200);
        expect(report.title).toBe('Consumo dos serviços');
        expect(report.services).toHaveLength(2);
        expect(report.services[0].energy).toBe(2);
        expect(report.services[1].energy).toBe(4);
        expect(report.points).toHaveLength(2);
    });

    it('retorna métricas nulas quando não há amostras no período', async () => {
        const response = await post('/reports/preview', {
            ...filters,
            end: '2026-11-07T12:00:00Z',
        });
        const report = await response.json();

        expect(response.status).toBe(200);
        expect(report.services[0].samples).toBe(0);
        expect(report.services[0].energy).toBeNull();
        expect(report.points).toEqual([]);
    });

    it('recusa serviços que não existem', async () => {
        const response = await post('/reports/preview', {
            ...filters,
            serviceIds: ['inexistente'],
        });

        expect(response.status).toBe(400);
    });

    it('recusa relatório sem métricas selecionadas', async () => {
        const response = await post('/reports/preview', { ...filters, metrics: [] });

        expect(response.status).toBe(400);
    });

    it('gera um PDF com cabeçalhos para download', async () => {
        const response = await post('/reports/pdf', filters);
        const pdf = Buffer.from(await response.arrayBuffer());

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/pdf');
        expect(response.headers.get('content-disposition')).toContain('GreenER-relatorio.pdf');
        expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
        expect(pdf.subarray(-20).toString()).toContain('%%EOF');
    });

    it('recusa exportação em PDF sem autenticação', async () => {
        const response = await fetch(`${api.url}/reports/pdf`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(filters),
        });

        expect(response.status).toBe(401);
    });
});
