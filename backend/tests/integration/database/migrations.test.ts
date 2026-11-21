import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDatabase, testDatabaseUrl, type TestDatabase } from '../helpers/database.js';

describe.skipIf(!testDatabaseUrl)('Migração de contas e painéis', () => {
    let database: TestDatabase;

    beforeAll(async () => {
        database = await createTestDatabase();
    }, 15000);

    afterAll(async () => {
        await database?.close();
    });

    it('adiciona as estruturas da Sprint 3 sem apagar usuários ou coletas', async () => {
        // Retira somente as estruturas novas deste banco descartável para simular a versão anterior.
        await database.pool.query(`
            DROP TABLE painel_usuario, dashboard, redefinicao_senha;
            ALTER TABLE usuario DROP COLUMN nome, DROP COLUMN acesso_ativo, DROP COLUMN versao_sessao;
            INSERT INTO usuario (email, senha_hash, papel)
            VALUES ('ana@example.com', 'hash-antigo', 'visualizador');
        `);
        const userBefore = await database.pool.query('SELECT id, email, senha_hash FROM usuario');
        const collectionsBefore = await database.pool.query('SELECT * FROM coleta ORDER BY id');
        const accountsMigration = await readFile(
            new URL('../../../../database/migrations/002_contas_e_dashboards.sql', import.meta.url),
            'utf8',
        );
        const panelMigration = await readFile(
            new URL('../../../../database/migrations/003_painel_usuario.sql', import.meta.url),
            'utf8',
        );

        await database.pool.query(accountsMigration);
        await database.pool.query(panelMigration);

        const userAfter = await database.pool.query(
            'SELECT id, email, senha_hash, nome, acesso_ativo, versao_sessao FROM usuario',
        );
        const collectionsAfter = await database.pool.query('SELECT * FROM coleta ORDER BY id');
        expect(userAfter.rows[0]).toEqual({
            ...userBefore.rows[0],
            nome: 'ana',
            acesso_ativo: true,
            versao_sessao: 0,
        });
        expect(collectionsAfter.rows).toEqual(collectionsBefore.rows);
        expect((await database.pool.query('SELECT * FROM redefinicao_senha')).rows).toEqual([]);
        expect((await database.pool.query('SELECT * FROM dashboard')).rows).toEqual([]);
        expect((await database.pool.query('SELECT * FROM painel_usuario')).rows).toEqual([]);

        // Executar as migrações novamente também deve preservar os dados.
        await database.pool.query(accountsMigration);
        await database.pool.query(panelMigration);
        expect((await database.pool.query('SELECT * FROM coleta ORDER BY id')).rows).toEqual(
            collectionsBefore.rows,
        );
    });
});
