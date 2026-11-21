import type { DashboardWidgetType } from './types/dashboards.types.js';

// Catálogo do painel conhecido pelo backend. Precisa acompanhar o frontend:
// templates (painelTemplates.ts), métricas (painelMetricas.ts), paletas
// (painelPaletas.ts) e tamanhos mínimos e colunas da grade (painelLayout.ts).

export const DASHBOARD_WIDGET_TYPES = [
    'kpi',
    'serie-temporal',
    'distribuicao',
    'tabela',
    'status',
] as const satisfies readonly DashboardWidgetType[];

export const DASHBOARD_TEMPLATES = [
    'visao-geral',
    'sustentabilidade',
    'operacional',
    'executivo',
    'em-branco',
] as const;

// Id de cada métrica e o tipo de widget que consegue exibi-la.
export const DASHBOARD_METRICS: Record<string, DashboardWidgetType> = {
    'co2e-total': 'kpi',
    'energia-total': 'kpi',
    disponibilidade: 'kpi',
    'intensidade-carbono': 'kpi',
    'co2e-por-regiao': 'serie-temporal',
    'energia-no-tempo': 'serie-temporal',
    'energia-por-regiao': 'distribuicao',
    'co2e-distribuicao': 'distribuicao',
    'top-emissores': 'tabela',
    'falhas-coleta': 'tabela',
    'servicos-sem-metricas': 'tabela',
    'ultimas-tentativas': 'tabela',
    'status-servicos': 'status',
};

// Tipos de gráfico aceitos por tipo de widget. Os que não aparecem aqui não
// têm opção de gráfico.
export const DASHBOARD_CHARTS: Partial<Record<DashboardWidgetType, readonly string[]>> = {
    'serie-temporal': ['linha', 'area', 'barras'],
    distribuicao: ['pizza', 'rosca', 'barras-horizontais'],
};

export const DASHBOARD_PALETTES = ['padrao', 'oceano', 'solar', 'floresta', 'contraste'] as const;

// Menor tamanho, em colunas e linhas, em que cada tipo de widget continua legível.
export const DASHBOARD_MIN_SIZE: Record<DashboardWidgetType, { w: number; h: number }> = {
    kpi: { w: 2, h: 2 },
    'serie-temporal': { w: 4, h: 3 },
    distribuicao: { w: 3, h: 3 },
    tabela: { w: 3, h: 3 },
    status: { w: 3, h: 3 },
};

// Colunas da grade no desktop e no tablet; no celular os widgets ficam em uma coluna.
export const DASHBOARD_COLUMNS = { desktop: 12, tablet: 6 } as const;

// Limites para o painel não crescer sem controle.
export const DASHBOARD_MAX_WIDGETS = 40;
export const DASHBOARD_MAX_ROWS = 200;
export const DASHBOARD_MAX_WIDGET_HEIGHT = 24;
