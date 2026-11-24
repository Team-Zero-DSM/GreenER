import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AccountsRepository } from '../../../../src/modules/accounts/accounts.repository.js';
import { createSession } from '../../../../src/modules/accounts/accounts.session.js';
import { ProjectRepository } from '../../../../src/modules/project/project.repository.js';
import { startTestApi, type TestApi } from '../../helpers/api.js';
import { createTestDatabase, testDatabaseUrl, type TestDatabase } from '../../helpers/database.js';

const coefficients = {
    cpuMaxWatts: 100,
    ramWattsPerGb: 0.375,
    diskWattsPerGb: 0.01,
    networkWattsPerGb: 0.02,
};

describe.skipIf(!testDatabaseUrl)('Configuração do projeto', () => {
    let database: TestDatabase;
    let api: TestApi;
    let accounts: AccountsRepository;
    let project: ProjectRepository;
    let adminId: string;
    let viewerId: string;
    let adminToken: string;
    let viewerToken: string;

    beforeAll(async () => {
        database = await createTestDatabase();
        api = await startTestApi(database);
        accounts = new AccountsRepository(database.pool);
        project = new ProjectRepository(database.pool);
    }, 15000);

    beforeEach(async () => {
        await database.pool.query('DELETE FROM configuracao_sistema');
        await database.pool.query('DELETE FROM usuario');
        const admin = await accounts.createFirstAdmin('Admin', 'admin@example.com', 'hash');
        const viewer = await accounts.create('Ana', 'ana@example.com', 'hash');
        adminId = admin.id;
        viewerId = viewer.id;
        adminToken = createSession(admin).token;
        viewerToken = createSession(viewer).token;
        await project.activateCoefficients(coefficients);
    });

    afterAll(async () => {
        await api?.close();
        await database?.close();
    });

    function request(path: string, method = 'GET', body?: unknown) {
        return fetch(`${api.url}/project${path}`, {
            method,
            headers: { 'content-type': 'application/json', authorization: `Bearer ${adminToken}` },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    }

    it('permite que o administrador liste os usuários', async () => {
        const response = await request('/members');
        const users = await response.json();

        expect(response.status).toBe(200);
        expect(users).toHaveLength(2);
        expect(users[0].name).toBe('Admin');
        expect(users[1].email).toBe('ana@example.com');
    });

    it('busca usuários pelo e-mail', async () => {
        const response = await request('/members?search=ana%40example.com');
        const users = await response.json();

        expect(response.status).toBe(200);
        expect(users).toHaveLength(1);
        expect(users[0].id).toBe(viewerId);
    });

    it('recusa acesso administrativo de um visualizador', async () => {
        const response = await fetch(`${api.url}/project/members`, {
            headers: { authorization: `Bearer ${viewerToken}` },
        });

        expect(response.status).toBe(403);
    });

    it('recusa acesso administrativo sem autenticação', async () => {
        const response = await fetch(`${api.url}/project/members`);

        expect(response.status).toBe(401);
    });

    it('altera o papel de um visualizador para administrador', async () => {
        const response = await request(`/members/${viewerId}`, 'PATCH', {
            role: 'admin',
            active: true,
        });
        const user = await response.json();

        expect(response.status).toBe(200);
        expect(user.role).toBe('admin');
    });

    it('protege o último administrador ativo', async () => {
        const response = await request(`/members/${adminId}`, 'PATCH', {
            role: 'visualizador',
            active: true,
        });

        expect(response.status).toBe(409);
        expect((await accounts.findActiveById(adminId))?.role).toBe('admin');
    });

    it('desativa o usuário e remove sessões e tokens de recuperação', async () => {
        await database.pool.query(
            `INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em) VALUES ('token-teste', $1, now() + interval '30 minutes')`,
            [viewerId],
        );
        const response = await request(`/members/${viewerId}`, 'PATCH', {
            role: 'visualizador',
            active: false,
        });
        const profile = await fetch(`${api.url}/profile`, {
            headers: { authorization: `Bearer ${viewerToken}` },
        });
        const tokens = await database.pool.query(
            'SELECT * FROM redefinicao_senha WHERE usuario_id = $1',
            [viewerId],
        );

        expect(response.status).toBe(200);
        expect(profile.status).toBe(401);
        expect(tokens.rows).toEqual([]);
    });

    it('retorna erro para um usuário inexistente', async () => {
        const response = await request('/members/999999', 'PATCH', {
            role: 'visualizador',
            active: false,
        });

        expect(response.status).toBe(404);
    });

    it('salva o intervalo com o usuário responsável', async () => {
        const saved = await request('/collection', 'PATCH', { intervalSeconds: 120 });
        const response = await request('/collection');
        const settings = await response.json();
        const result = await database.pool.query(
            'SELECT atualizado_por, atualizado_em FROM configuracao_sistema',
        );

        expect(saved.status).toBe(200);
        expect(settings.intervalSeconds).toBe(120);
        expect(result.rows[0].atualizado_por).toBe(adminId);
        expect(result.rows[0].atualizado_em).toBeInstanceOf(Date);
    });

    it('recusa intervalo abaixo de dez segundos', async () => {
        const response = await request('/collection', 'PATCH', { intervalSeconds: 9 });

        expect(response.status).toBe(400);
    });

    it('consulta os coeficientes ativos', async () => {
        const response = await request('/coefficients');
        const active = await response.json();

        expect(response.status).toBe(200);
        expect(active.cpuMaxWatts).toBe(100);
        expect(active.ramWattsPerGb).toBe(0.375);
    });

    it('simula novos coeficientes sem ativá-los', async () => {
        const response = await request('/coefficients/preview', 'POST', {
            cpuMaxWatts: 200,
            ramWattsPerGb: 1,
            diskWattsPerGb: 0.5,
            networkWattsPerGb: 2,
        });
        const preview = await response.json();

        expect(response.status).toBe(200);
        expect(preview.proposed.powerW).toBe(116);
        expect((await project.activeCoefficients())?.cpuMaxWatts).toBe(100);
    });

    it('ativa uma nova versão sem alterar as coletas antigas', async () => {
        const oldVersion = await project.activeCoefficients();
        const before = await database.pool.query('SELECT * FROM coleta ORDER BY id');
        const response = await request('/coefficients', 'POST', {
            ...coefficients,
            cpuMaxWatts: 200,
        });
        const created = await response.json();
        const active = await database.pool.query('SELECT id FROM parametro_estimativa WHERE ativo');
        const after = await database.pool.query('SELECT * FROM coleta ORDER BY id');

        expect(response.status).toBe(201);
        expect(created.id).not.toBe(oldVersion?.id);
        expect(active.rows).toEqual([{ id: created.id }]);
        expect(after.rows).toEqual(before.rows);
    });

    it('recusa coeficiente negativo', async () => {
        const response = await request('/coefficients', 'POST', {
            ...coefficients,
            cpuMaxWatts: -1,
        });

        expect(response.status).toBe(400);
    });
});
