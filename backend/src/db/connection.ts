import { Pool, type PoolConfig } from 'pg';
import 'dotenv/config';

// Em produção (Supabase) a conexão vem pronta em DATABASE_URL e exige SSL.
// No Docker local continuam valendo as variáveis DATABASE_HOST, DATABASE_PORT etc.
function poolConfig(): PoolConfig {
    const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

    if (process.env.DATABASE_URL) {
        return { connectionString: process.env.DATABASE_URL, ssl };
    }

    return {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl,
    };
}

export const pool = new Pool(poolConfig());

pool.on('error', (err) => {
    console.error('[database] Erro em conexão ociosa do PostgreSQL:', err);
});
