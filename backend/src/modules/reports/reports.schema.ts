import { z } from 'zod';
import { snapshotRangeSchema } from '../analytics/metrics-snapshot.schema.js';

export const metricLabels = ['energy', 'carbon', 'cpu', 'memory', 'power'] as const;

export const reportFiltersSchema = z.strictObject({
    title: z.string().trim().max(100).optional(),
    serviceIds: z
        .array(z.string().trim().min(1).max(200))
        .min(1)
        .max(20)
        .refine((ids) => new Set(ids).size === ids.length, 'Não repita os serviços selecionados.'),
    range: snapshotRangeSchema,
    metrics: z
        .array(z.enum(metricLabels))
        .min(1)
        .max(metricLabels.length)
        .refine(
            (keys) => new Set(keys).size === keys.length,
            'Não repita as métricas selecionadas.',
        ),
    visualization: z.enum(['line', 'bars', 'table']),
    end: z.iso.datetime({ offset: true }).optional(),
});

export type ReportFilters = z.infer<typeof reportFiltersSchema>;
