import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { dashboardsRouter } from '../../../../src/modules/dashboards/dashboards.routes.js';
import { errorHandler } from '../../../../src/shared/middleware/errorHandler.js';

describe('Autenticação das rotas do painel (/dashboards/me)', () => {
    let server: Server;
    let baseUrl: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'segredo-de-teste';
        // Monta só as rotas do painel, com o mesmo tratamento de erros da API.
        const app = express();
        app.use(express.json());
        app.use('/api/v1/dashboards', dashboardsRouter);
        app.use(errorHandler);
        server = app.listen(0);
        await new Promise((resolve) => server.once('listening', resolve));
        baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1/dashboards/me`;
    });
    afterAll(async () => {
        await new Promise((resolve) => server.close(resolve));
    });

    const body = JSON.stringify({ template: 'em-branco', widgets: [] });

    it.each([
        { method: 'GET', authorization: undefined },
        { method: 'PUT', authorization: undefined },
        { method: 'GET', authorization: 'Bearer token-invalido' },
        { method: 'PUT', authorization: 'Bearer token-invalido' },
        { method: 'GET', authorization: 'Basic dXN1YXJpbzpzZW5oYQ==' },
    ])(
        'deve recusar $method sem um JWT válido ($authorization)',
        async ({ method, authorization }) => {
            const response = await fetch(baseUrl, {
                method,
                headers: {
                    'content-type': 'application/json',
                    ...(authorization ? { authorization } : {}),
                },
                body: method === 'PUT' ? body : undefined,
            });

            expect(response.status).toBe(401);
            await expect(response.json()).resolves.toEqual({
                error: { message: 'Entre na sua conta para continuar.' },
            });
        },
    );

    it('deve recusar um JWT assinado com outro segredo', async () => {
        const token = jwt.sign({ version: 0 }, 'outro-segredo', { subject: '1' });

        const response = await fetch(baseUrl, { headers: { authorization: `Bearer ${token}` } });

        expect(response.status).toBe(401);
    });
});
