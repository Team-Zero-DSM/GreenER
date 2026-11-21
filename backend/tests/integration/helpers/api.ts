import type { AddressInfo } from 'node:net';
import type { TestDatabase } from './database.js';

export async function startTestApi(database: TestDatabase) {
    // A API usa o mesmo banco descartável criado para este arquivo de teste.
    process.env.DATABASE_URL = database.connectionString;
    process.env.DATABASE_SSL = 'false';
    process.env.JWT_SECRET = 'segredo-dos-testes';
    process.env.NODE_ENV = 'test';

    // As rotas exigem estas URLs ao iniciar, mas os testes não fazem coletas externas.
    process.env.METRICS_API_URL = 'http://127.0.0.1:1';
    process.env.CARBON_API_URL = 'http://127.0.0.1:1';

    const { app } = await import('../../../src/app.js');
    const { pool } = await import('../../../src/db/connection.js');
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address() as AddressInfo;

    return {
        url: `http://127.0.0.1:${address.port}/api/v1`,
        async close() {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => (error ? reject(error) : resolve()));
            });
            await pool.end();
        },
    };
}

export type TestApi = Awaited<ReturnType<typeof startTestApi>>;
