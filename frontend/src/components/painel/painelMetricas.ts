import type { PainelWidget, PainelWidgetType } from '@/types/painel';

// Métrica: um conjunto de dados do backend que um widget pode exibir. Cada tipo
// de widget só aceita as métricas que têm o formato dele.
export interface PainelMetric {
    id: string;
    type: PainelWidgetType;
    label: string;
}

export const PAINEL_METRICS: readonly PainelMetric[] = [
    { id: 'co2e-total', type: 'kpi', label: 'CO₂e no período' },
    { id: 'energia-total', type: 'kpi', label: 'Energia no período' },
    { id: 'disponibilidade', type: 'kpi', label: 'Disponibilidade' },
    { id: 'intensidade-carbono', type: 'kpi', label: 'Intensidade de carbono' },
    { id: 'co2e-por-regiao', type: 'serie-temporal', label: 'Emissão de CO₂e por região' },
    { id: 'energia-no-tempo', type: 'serie-temporal', label: 'Consumo de energia por região' },
    { id: 'energia-por-regiao', type: 'distribuicao', label: 'Energia por região' },
    { id: 'co2e-distribuicao', type: 'distribuicao', label: 'CO₂e por região' },
    { id: 'top-emissores', type: 'tabela', label: 'Top 5 emissores' },
    { id: 'falhas-coleta', type: 'tabela', label: 'Falhas de coleta' },
    { id: 'servicos-sem-metricas', type: 'tabela', label: 'Serviços sem métricas' },
    { id: 'ultimas-tentativas', type: 'tabela', label: 'Últimas tentativas de coleta' },
    { id: 'status-servicos', type: 'status', label: 'Status dos serviços' },
];

// Métrica que o widget exibe. Sem escolha do usuário, é a métrica com o mesmo id
// do widget, que é como os widgets do catálogo nascem.
export function getWidgetMetricId(widget: PainelWidget): string {
    return widget.metric ?? widget.id;
}

export function getMetricsForType(type: PainelWidgetType): PainelMetric[] {
    return PAINEL_METRICS.filter((metric) => metric.type === type);
}
