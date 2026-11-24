import { z } from 'zod';
import { isCommonPassword } from './common-passwords.js';

export const emailSchema = z.email().trim().toLowerCase().max(254);
export const nameSchema = z.string().trim().min(1).max(100);
export const passwordSchema = z
    .string()
    .min(8)
    .refine((value) => Buffer.byteLength(value) <= 72, {
        message: 'A senha deve ter entre 8 caracteres e 72 bytes.',
    });
// Senha nova (cadastro, redefinição e troca) também não pode ser uma senha comum.
// O login continua usando passwordSchema para não travar contas antigas.
export const newPasswordSchema = passwordSchema.refine((value) => !isCommonPassword(value), {
    message: 'Essa senha é muito comum. Escolha uma senha mais difícil de adivinhar.',
});
export const credentialsSchema = z.object({ email: emailSchema, password: passwordSchema });
export const registerSchema = credentialsSchema.extend({
    name: nameSchema,
    password: newPasswordSchema,
});
export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/),
    password: newPasswordSchema,
});
export const profileSchema = z.strictObject({
    name: nameSchema,
    email: emailSchema,
});
export const changePasswordSchema = z.strictObject({
    currentPassword: passwordSchema,
    newPassword: newPasswordSchema,
});
export type AccountCredentials = z.infer<typeof credentialsSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
