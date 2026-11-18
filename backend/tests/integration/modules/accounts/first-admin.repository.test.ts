import bcrypt from 'bcrypt';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AccountsRepository } from '../../../../src/modules/accounts/accounts.repository.js';
import { createTestDatabase, testDatabaseUrl, type TestDatabase } from '../../helpers/database.js';

describe.skipIf(!testDatabaseUrl)('Primeiro administrador com PostgreSQL', () => {
    let database: TestDatabase;
    let repository: AccountsRepository;
    let hash: string;

    beforeAll(async () => {
        database = await createTestDatabase();
        repository = new AccountsRepository(database.pool);
        hash = await bcrypt.hash('senha-de-teste', 12);
    }, 15000);

    beforeEach(async () => {
        await database.pool.query('DELETE FROM usuario');
    });

    afterAll(async () => {
        await database?.close();
    });

    it('cria uma conta administrativa com a senha em hash', async () => {
        const account = await repository.createFirstAdmin('Admin', 'admin@example.com', hash);
        const saved = await repository.findActiveByEmail('admin@example.com');

        expect(saved).toMatchObject({ id: account.id, role: 'admin', sessionVersion: 0 });
        expect(saved?.passwordHash).not.toBe('senha-de-teste');
        expect(await bcrypt.compare('senha-de-teste', saved!.passwordHash)).toBe(true);
    });

    it('promove pelo e-mail, reativa o acesso e invalida sessões e recuperações anteriores', async () => {
        const { rows } = await database.pool.query(`
            INSERT INTO usuario (nome, email, senha_hash, acesso_ativo, versao_sessao)
            VALUES ('Antigo', 'Admin@Example.com', 'hash-antigo', false, 4) RETURNING id
        `);
        const id = rows[0].id;
        await database.pool.query(
            `INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em)
             VALUES ('token-1', $1, now() + interval '30 minutes'),
                    ('token-2', $1, now() - interval '30 minutes')`,
            [id],
        );

        const account = await repository.createFirstAdmin('Novo', 'admin@example.com', hash);

        expect(account).toMatchObject({ id, name: 'Novo', role: 'admin', sessionVersion: 5 });
        expect(await repository.findActiveByEmail('admin@example.com')).toMatchObject({
            id,
            passwordHash: hash,
        });
        expect((await database.pool.query('SELECT id FROM usuario')).rows).toEqual([{ id }]);
        expect((await database.pool.query('SELECT * FROM redefinicao_senha')).rows).toEqual([]);
    });

    it('recusa criar ou alterar uma conta quando já existe administrador ativo', async () => {
        const account = await repository.createFirstAdmin('Admin', 'admin@example.com', hash);

        await expect(
            repository.createFirstAdmin('Outro', 'outro@example.com', hash),
        ).rejects.toThrow('Já existe um administrador ativo.');
        await expect(
            repository.createFirstAdmin('Alterado', 'admin@example.com', 'outro-hash'),
        ).rejects.toThrow('Já existe um administrador ativo.');

        expect(await repository.findActiveById(account.id)).toEqual(account);
        expect((await database.pool.query('SELECT senha_hash FROM usuario')).rows).toEqual([
            { senha_hash: hash },
        ]);
    });

    it('permite somente um administrador em execuções concorrentes', async () => {
        const results = await Promise.allSettled([
            repository.createFirstAdmin('Admin A', 'a@example.com', hash),
            repository.createFirstAdmin('Admin B', 'b@example.com', hash),
        ]);

        expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
        expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1);
        expect(
            (await database.pool.query("SELECT id FROM usuario WHERE papel = 'admin'")).rowCount,
        ).toBe(1);
    });

    it('desfaz a promoção se a remoção dos tokens falhar', async () => {
        const account = await repository.create('Usuário', 'user@example.com', 'hash-antigo');
        await database.pool.query(
            `INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em)
             VALUES ('token', $1, now() + interval '30 minutes')`,
            [account.id],
        );
        await database.pool.query(`
            CREATE FUNCTION falhar_exclusao() RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN RAISE EXCEPTION 'Falha simulada'; END $$;
            CREATE TRIGGER falhar_exclusao AFTER DELETE ON redefinicao_senha
            FOR EACH ROW EXECUTE FUNCTION falhar_exclusao();
        `);
        try {
            await expect(
                repository.createFirstAdmin('Admin', 'user@example.com', hash),
            ).rejects.toThrow('Falha simulada');

            expect(await repository.findActiveById(account.id)).toEqual(account);
            expect(await repository.findActiveByEmail('user@example.com')).toMatchObject({
                passwordHash: 'hash-antigo',
            });
            expect(
                (await database.pool.query('SELECT token_hash FROM redefinicao_senha')).rows,
            ).toEqual([{ token_hash: 'token' }]);
        } finally {
            await database.pool.query('DROP TRIGGER falhar_exclusao ON redefinicao_senha');
            await database.pool.query('DROP FUNCTION falhar_exclusao()');
        }
    });
});
