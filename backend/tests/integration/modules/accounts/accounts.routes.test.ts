import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountsRepository } from '../../../../src/modules/accounts/accounts.repository.js';
import { createSession } from '../../../../src/modules/accounts/accounts.session.js';
import * as mail from '../../../../src/modules/accounts/reset-mail.js';
import { startTestApi, type TestApi } from '../../helpers/api.js';
import { createTestDatabase, testDatabaseUrl, type TestDatabase } from '../../helpers/database.js';

describe.skipIf(!testDatabaseUrl)('Cadastro, login e perfil', () => {
    let database: TestDatabase;
    let api: TestApi;
    let accounts: AccountsRepository;
    let userId: string;
    let token: string;
    let hash: string;
    let resetToken: string;

    beforeAll(async () => {
        database = await createTestDatabase();
        api = await startTestApi(database);
        accounts = new AccountsRepository(database.pool);
        hash = await bcrypt.hash('girassol-azul-42', 12);
    }, 15000);

    beforeEach(async () => {
        await database.pool.query('DELETE FROM usuario');
        const account = await accounts.create('Ana', 'ana@example.com', hash);
        userId = account.id;
        token = createSession(account).token;
        resetToken = '';

        // Guarda o token do e-mail sem enviar uma mensagem de verdade.
        vi.spyOn(mail, 'passwordResetMailer').mockReturnValue(async (_email, receivedToken) => {
            resetToken = receivedToken;
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    afterAll(async () => {
        await api?.close();
        await database?.close();
    });

    function post(path: string, body: unknown) {
        return fetch(`${api.url}${path}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
        });
    }

    function patch(path: string, body: unknown) {
        return fetch(`${api.url}${path}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });
    }

    it('cadastra um visualizador e guarda a senha em hash', async () => {
        const response = await post('/auth/register', {
            name: 'Pedro',
            email: 'pedro@example.com',
            password: 'caderno-verde-42',
        });
        const data = await response.json();
        const saved = await accounts.findActiveByEmail('pedro@example.com');

        expect(response.status).toBe(201);
        expect(data.user.role).toBe('visualizador');
        expect(saved?.passwordHash).not.toBe('caderno-verde-42');
        expect(await bcrypt.compare('caderno-verde-42', saved!.passwordHash)).toBe(true);
    });

    it('recusa cadastro com e-mail já utilizado', async () => {
        const response = await post('/auth/register', {
            name: 'Outra Ana',
            email: 'ana@example.com',
            password: 'caderno-verde-42',
        });

        expect(response.status).toBe(409);
    });

    it('faz login com e-mail e senha corretos', async () => {
        const response = await post('/auth/login', {
            email: 'ana@example.com',
            password: 'girassol-azul-42',
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.user.email).toBe('ana@example.com');
        expect(data.token).toEqual(expect.any(String));
    });

    it('recusa login com senha incorreta', async () => {
        const response = await post('/auth/login', {
            email: 'ana@example.com',
            password: 'senha-incorreta',
        });

        expect(response.status).toBe(401);
    });

    it('recusa login com e-mail inexistente', async () => {
        const response = await post('/auth/login', {
            email: 'ninguem@example.com',
            password: 'girassol-azul-42',
        });

        expect(response.status).toBe(401);
    });

    it('consulta o perfil sem mostrar a senha', async () => {
        const response = await fetch(`${api.url}/profile`, {
            headers: { authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            id: userId,
            name: 'Ana',
            email: 'ana@example.com',
            role: 'visualizador',
        });
    });

    it('recusa consulta ao perfil sem token', async () => {
        const response = await fetch(`${api.url}/profile`);

        expect(response.status).toBe(401);
    });

    it('recusa um token inválido', async () => {
        const response = await fetch(`${api.url}/profile`, {
            headers: { authorization: 'Bearer token-invalido' },
        });

        expect(response.status).toBe(401);
    });

    it('recusa um token expirado', async () => {
        const expiredToken = jwt.sign({ version: 0 }, 'segredo-dos-testes', {
            subject: userId,
            issuer: 'greener',
            audience: 'grenner-web',
            expiresIn: -1,
        });
        const response = await fetch(`${api.url}/profile`, {
            headers: { authorization: `Bearer ${expiredToken}` },
        });

        expect(response.status).toBe(401);
    });

    it('recusa uma sessão revogada no banco', async () => {
        await database.pool.query('UPDATE usuario SET versao_sessao = 1 WHERE id = $1', [userId]);
        const response = await fetch(`${api.url}/profile`, {
            headers: { authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(401);
    });

    it('altera nome e e-mail e invalida o token anterior', async () => {
        const response = await patch('/profile', {
            name: 'Ana Silva',
            email: 'ana.silva@example.com',
        });
        const data = await response.json();
        const oldSession = await fetch(`${api.url}/profile`, {
            headers: { authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(200);
        expect(data.user.name).toBe('Ana Silva');
        expect((await accounts.findActiveById(userId))?.email).toBe('ana.silva@example.com');
        expect(oldSession.status).toBe(401);
    });

    it('recusa troca de senha quando a senha atual está errada', async () => {
        const response = await patch('/profile/password', {
            currentPassword: 'senha-incorreta',
            newPassword: 'caderno-verde-42',
        });

        expect(response.status).toBe(400);
    });

    it('troca a senha e permite login com a nova senha', async () => {
        const changed = await patch('/profile/password', {
            currentPassword: 'girassol-azul-42',
            newPassword: 'caderno-verde-42',
        });
        const login = await post('/auth/login', {
            email: 'ana@example.com',
            password: 'caderno-verde-42',
        });
        const oldSession = await fetch(`${api.url}/profile`, {
            headers: { authorization: `Bearer ${token}` },
        });

        expect(changed.status).toBe(200);
        expect(login.status).toBe(200);
        expect(oldSession.status).toBe(401);
    });

    it('solicita recuperação de senha de uma conta existente', async () => {
        const response = await post('/auth/forgot-password', { email: 'ana@example.com' });

        expect(response.status).toBe(202);
        expect(resetToken).toHaveLength(64);
    });

    it('não revela se o e-mail de recuperação existe', async () => {
        const response = await post('/auth/forgot-password', { email: 'ninguem@example.com' });

        expect(response.status).toBe(202);
        expect(resetToken).toBe('');
    });

    it('redefine a senha e impede usar o mesmo token novamente', async () => {
        await post('/auth/forgot-password', { email: 'ana@example.com' });
        const body = { token: resetToken, password: 'caderno-verde-42' };
        const first = await post('/auth/reset-password', body);
        const second = await post('/auth/reset-password', body);
        const login = await post('/auth/login', {
            email: 'ana@example.com',
            password: 'caderno-verde-42',
        });

        expect(first.status).toBe(204);
        expect(second.status).toBe(400);
        expect(login.status).toBe(200);
    });

    it('recusa um token de recuperação expirado', async () => {
        await post('/auth/forgot-password', { email: 'ana@example.com' });
        await database.pool.query(
            "UPDATE redefinicao_senha SET expira_em = now() - interval '1 minute'",
        );
        const response = await post('/auth/reset-password', {
            token: resetToken,
            password: 'caderno-verde-42',
        });

        expect(response.status).toBe(400);
    });

    it('recusa um token de recuperação inexistente', async () => {
        const response = await post('/auth/reset-password', {
            token: 'a'.repeat(64),
            password: 'caderno-verde-42',
        });

        expect(response.status).toBe(400);
    });
});
