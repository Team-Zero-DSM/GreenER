import { z } from 'zod';

export const emailSchema = z.email().trim().toLowerCase().max(254);
export const nameSchema = z.string().trim().min(1).max(100);
export const passwordSchema = z
    .string()
    .min(8)
    .refine((value) => Buffer.byteLength(value) <= 72, {
        message: 'A senha deve ter entre 8 caracteres e 72 bytes.',
    });
export const credentialsSchema = z.object({ email: emailSchema, password: passwordSchema });
export const registerSchema = credentialsSchema.extend({ name: nameSchema });
export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/),
    password: passwordSchema,
});
export const profileSchema = z.strictObject({
    name: nameSchema,
    email: emailSchema,
});
export const changePasswordSchema = z.strictObject({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
});
export type AccountCredentials = z.infer<typeof credentialsSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
