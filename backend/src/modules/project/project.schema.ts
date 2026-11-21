import { z } from 'zod';

const coefficientSchema = z.number().min(0).max(999999.9999).multipleOf(0.0001);

export const coefficientsSchema = z.strictObject({
    cpuMaxWatts: coefficientSchema,
    ramWattsPerGb: coefficientSchema,
    diskWattsPerGb: coefficientSchema,
    networkWattsPerGb: coefficientSchema,
});

export const collectionSettingsSchema = z.strictObject({
    intervalSeconds: z.number().int().min(10).max(3600),
});

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
export type CoefficientsInput = z.infer<typeof coefficientsSchema>;
