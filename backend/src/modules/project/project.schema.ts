import { z } from 'zod';

export const memberIdSchema = z.strictObject({
    id: z
        .string()
        .refine(
            (value) => /^[1-9][0-9]{0,18}$/.test(value) && BigInt(value) <= 9223372036854775807n,
            'Identificador inválido',
        ),
});

export const membersQuerySchema = z.strictObject({
    search: z.string().trim().max(100).default(''),
    active: z.enum(['true', 'false']).optional(),
});

export const memberAccessSchema = z.strictObject({
    role: z.enum(['admin', 'visualizador']),
    active: z.boolean(),
});

export type MembersQuery = z.infer<typeof membersQuerySchema>;
export type MemberAccess = z.infer<typeof memberAccessSchema>;
