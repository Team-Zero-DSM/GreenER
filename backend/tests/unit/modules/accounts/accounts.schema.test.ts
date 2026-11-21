import { describe, it, expect } from 'vitest';
import {
    changePasswordSchema,
    credentialsSchema,
    registerSchema,
    resetPasswordSchema,
} from '../../../../src/modules/accounts/accounts.schema.js';

const token = 'a'.repeat(64);

describe('Validação de senhas (contas)', () => {
    it('deve recusar senha comum no cadastro', () => {
        const result = registerSchema.safeParse({
            name: 'Ana',
            email: 'ana@example.com',
            password: '12345678',
        });
        expect(result.success).toBe(false);
    });

    it('deve recusar senha comum ignorando maiúsculas', () => {
        const result = registerSchema.safeParse({
            name: 'Ana',
            email: 'ana@example.com',
            password: 'Password123',
        });
        expect(result.success).toBe(false);
    });

    it('deve aceitar senha que não é comum no cadastro', () => {
        const result = registerSchema.safeParse({
            name: 'Ana',
            email: 'ana@example.com',
            password: 'girassol-azul-42',
        });
        expect(result.success).toBe(true);
    });

    it('deve recusar senha comum na redefinição e na troca', () => {
        expect(resetPasswordSchema.safeParse({ token, password: 'qwerty123' }).success).toBe(false);
        expect(
            changePasswordSchema.safeParse({
                currentPassword: 'girassol-azul-42',
                newPassword: 'senha123',
            }).success,
        ).toBe(false);
    });

    it('deve continuar aceitando senha comum no login de contas antigas', () => {
        const result = credentialsSchema.safeParse({
            email: 'ana@example.com',
            password: '12345678',
        });
        expect(result.success).toBe(true);
    });
});
