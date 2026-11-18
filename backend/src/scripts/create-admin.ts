import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import bcrypt from 'bcrypt';
import { pool } from '../db/connection.js';
import { AccountsRepository } from '../modules/accounts/accounts.repository.js';
import { registerSchema } from '../modules/accounts/accounts.schema.js';

const terminal = createInterface({ input: stdin, output: stdout });

try {
    const result = registerSchema.safeParse({
        name: await terminal.question('Nome: '),
        email: await terminal.question('E-mail: '),
        password: await terminal.question('Senha (mínimo 8 caracteres): '),
    });
    if (!result.success) {
        throw new Error(
            'Informe um nome, um e-mail válido e uma senha de 8 caracteres a 72 bytes.',
        );
    }

    const { name, email, password } = result.data;
    const hash = await bcrypt.hash(password, 12);
    await new AccountsRepository(pool).createFirstAdmin(name, email, hash);
    stdout.write('Administrador configurado com sucesso.\n');
} catch (error) {
    console.error(error instanceof Error ? error.message : 'Falha ao configurar administrador.');
    process.exitCode = 1;
} finally {
    terminal.close();
    await pool.end();
}
