import { z } from 'zod';

const positionSchema = z
    .object({
        x: z.number().int(),
        y: z.number().int(),
        w: z.number().int(),
        h: z.number().int(),
    })
    .strict();

const widgetSchema = positionSchema
    .extend({
        id: z.string().min(1),
        type: z.enum(['kpi', 'serie-temporal', 'distribuicao', 'tabela', 'status']),
        title: z.string().trim().min(1),
        chart: z.string().optional(),
        metric: z.string().optional(),
        palette: z.string().optional(),
        region: z.string().optional(),
        alert: z
            .object({ direction: z.enum(['acima', 'abaixo']), threshold: z.number() })
            .strict()
            .optional(),
    })
    .strict();

export const dashboardConfigSchema = z
    .object({
        template: z.string().min(1),
        widgets: z.array(widgetSchema),
        tablet: z.record(z.string(), positionSchema).optional(),
        mobileOrder: z.array(z.string()).optional(),
    })
    .strict();

export type DashboardConfigInput = z.output<typeof dashboardConfigSchema>;
