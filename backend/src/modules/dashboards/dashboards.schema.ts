import { z } from 'zod';
import {
    DASHBOARD_CHARTS,
    DASHBOARD_COLUMNS,
    DASHBOARD_MAX_ROWS,
    DASHBOARD_MAX_WIDGET_HEIGHT,
    DASHBOARD_MAX_WIDGETS,
    DASHBOARD_METRICS,
    DASHBOARD_MIN_SIZE,
    DASHBOARD_PALETTES,
    DASHBOARD_TEMPLATES,
    DASHBOARD_WIDGET_TYPES,
} from './dashboards.catalog.js';
import type { DashboardWidgetPosition, DashboardWidgetType } from './types/dashboards.types.js';

const widgetIdSchema = z
    .string()
    .regex(
        /^[a-z0-9-]{1,64}$/,
        'O id do widget deve ter até 64 letras minúsculas, números ou hífens',
    );

const positionSchema = z
    .object({
        x: z.number().int().min(0),
        y: z.number().int().min(0).max(DASHBOARD_MAX_ROWS),
        w: z.number().int().min(1),
        h: z.number().int().min(1).max(DASHBOARD_MAX_WIDGET_HEIGHT),
    })
    .strict();

const widgetSchema = positionSchema
    .extend({
        id: widgetIdSchema,
        type: z.enum(DASHBOARD_WIDGET_TYPES),
        title: z.string().trim().min(1).max(60),
        chart: z.string().optional(),
        metric: z.string().optional(),
        palette: z.enum(DASHBOARD_PALETTES).optional(),
        region: z.string().trim().min(1).max(64).optional(),
        alert: z
            .object({ direction: z.enum(['acima', 'abaixo']), threshold: z.number() })
            .strict()
            .optional(),
    })
    .strict();

type Issue = { path: (string | number)[]; message: string };

// Confere se a posição cabe na grade e respeita o tamanho mínimo do tipo.
function checkPosition(
    position: DashboardWidgetPosition,
    type: DashboardWidgetType,
    columns: number,
    path: (string | number)[],
): Issue[] {
    const issues: Issue[] = [];
    const minimum = DASHBOARD_MIN_SIZE[type];

    if (position.x + position.w > columns) {
        issues.push({ path, message: `O widget passa da grade de ${columns} colunas` });
    }
    if (position.w < Math.min(minimum.w, columns) || position.h < minimum.h) {
        issues.push({
            path,
            message: `O widget do tipo ${type} precisa de pelo menos ${minimum.w}x${minimum.h}`,
        });
    }
    return issues;
}

export const dashboardConfigSchema = z
    .object({
        template: z.enum(DASHBOARD_TEMPLATES),
        widgets: z.array(widgetSchema).max(DASHBOARD_MAX_WIDGETS),
        tablet: z.record(widgetIdSchema, positionSchema).optional(),
        mobileOrder: z.array(widgetIdSchema).optional(),
    })
    .strict()
    .superRefine((config, context) => {
        const issues: Issue[] = [];
        const types = new Map<string, DashboardWidgetType>();

        config.widgets.forEach((widget, index) => {
            const path = ['widgets', index];

            if (types.has(widget.id)) {
                issues.push({ path: [...path, 'id'], message: `Widget "${widget.id}" repetido` });
            }
            types.set(widget.id, widget.type);

            // Sem métrica escolhida, o widget exibe a métrica com o mesmo id.
            const metric = widget.metric ?? widget.id;
            const metricType = DASHBOARD_METRICS[metric];
            if (!metricType) {
                issues.push({
                    path: [...path, 'metric'],
                    message: `Métrica "${metric}" desconhecida`,
                });
            } else if (metricType !== widget.type) {
                issues.push({
                    path: [...path, 'metric'],
                    message: `A métrica "${metric}" não pode ser exibida em um widget do tipo ${widget.type}`,
                });
            }

            const charts = DASHBOARD_CHARTS[widget.type];
            if (widget.chart !== undefined && !charts?.includes(widget.chart)) {
                issues.push({
                    path: [...path, 'chart'],
                    message: `Tipo de gráfico "${widget.chart}" não é aceito em um widget do tipo ${widget.type}`,
                });
            }

            if (widget.alert && widget.type !== 'kpi') {
                issues.push({
                    path: [...path, 'alert'],
                    message: 'Apenas widgets do tipo kpi aceitam limite de alerta',
                });
            }

            issues.push(...checkPosition(widget, widget.type, DASHBOARD_COLUMNS.desktop, path));
        });

        for (const [id, position] of Object.entries(config.tablet ?? {})) {
            const type = types.get(id);
            const path = ['tablet', id];

            if (!type) {
                issues.push({ path, message: `Widget "${id}" não está no painel` });
            } else {
                issues.push(...checkPosition(position, type, DASHBOARD_COLUMNS.tablet, path));
            }
        }

        const seen = new Set<string>();
        config.mobileOrder?.forEach((id, index) => {
            const path = ['mobileOrder', index];

            if (!types.has(id)) issues.push({ path, message: `Widget "${id}" não está no painel` });
            if (seen.has(id)) issues.push({ path, message: `Widget "${id}" repetido` });
            seen.add(id);
        });

        issues.forEach((issue) => context.addIssue({ code: 'custom', ...issue }));
    });

export type DashboardConfigInput = z.output<typeof dashboardConfigSchema>;
