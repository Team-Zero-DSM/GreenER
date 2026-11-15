import type { PainelConfig, PainelWidget } from '@/types/painel';

// Colunas da grade por tamanho de tela. As classes do PainelGrid precisam
// acompanhar estes valores (lg:grid-cols-12, md:grid-cols-6 e uma coluna no celular).
export const PAINEL_GRID_COLUMNS = 12;
export const PAINEL_TABLET_COLUMNS = 6;

// Widgets do template "Visão geral", que é também o painel de quem nunca salvou um.
export const PAINEL_DEFAULT_WIDGETS: readonly PainelWidget[] = [
    { id: 'co2e-total', type: 'kpi', title: 'CO₂e no período', x: 0, y: 0, w: 3, h: 2 },
    { id: 'energia-total', type: 'kpi', title: 'Energia no período', x: 3, y: 0, w: 3, h: 2 },
    { id: 'disponibilidade', type: 'kpi', title: 'Disponibilidade', x: 6, y: 0, w: 3, h: 2 },
    {
        id: 'intensidade-carbono',
        type: 'kpi',
        title: 'Intensidade de carbono',
        x: 9,
        y: 0,
        w: 3,
        h: 2,
    },
    {
        id: 'co2e-por-regiao',
        type: 'serie-temporal',
        chart: 'area',
        title: 'Emissão de CO₂e por região',
        x: 0,
        y: 2,
        w: 8,
        h: 4,
    },
    { id: 'status-servicos', type: 'status', title: 'Status dos serviços', x: 8, y: 2, w: 4, h: 4 },
    { id: 'top-emissores', type: 'tabela', title: 'Top 5 emissores', x: 0, y: 6, w: 4, h: 4 },
    { id: 'falhas-coleta', type: 'tabela', title: 'Falhas de coleta', x: 4, y: 6, w: 4, h: 4 },
    {
        id: 'energia-por-regiao',
        type: 'distribuicao',
        chart: 'rosca',
        title: 'Energia por região',
        x: 8,
        y: 6,
        w: 4,
        h: 4,
    },
];

// Configuração de quem ainda não salvou um painel.
export const PAINEL_DEFAULT_CONFIG: PainelConfig = {
    template: 'visao-geral',
    widgets: PAINEL_DEFAULT_WIDGETS,
};

// Descrição de cada widget no catálogo do modo de edição, pelo id do widget.
const PAINEL_WIDGET_DESCRIPTIONS: Record<string, string> = {
    'co2e-total': 'Total de CO₂e emitido no período e variação contra o período anterior.',
    'energia-total': 'Total de energia consumida no período e variação.',
    disponibilidade: 'Disponibilidade média dos serviços monitorados.',
    'intensidade-carbono': 'Gramas de CO₂e emitidos por kWh consumido.',
    'co2e-por-regiao': 'Evolução da emissão de CO₂e ao longo do período, por região.',
    'status-servicos': 'Quantos serviços estão ativos, indisponíveis ou sem métricas.',
    'top-emissores': 'Os cinco serviços que mais emitiram CO₂e no período.',
    'falhas-coleta': 'Últimas tentativas de coleta que falharam.',
    'energia-por-regiao': 'Como o consumo de energia se divide entre as regiões.',
};

// Widgets que o usuário pode adicionar ao painel. Por enquanto são os mesmos do
// layout padrão, que são os que têm dados no backend.
export const PAINEL_WIDGET_CATALOG: readonly { widget: PainelWidget; description: string }[] =
    PAINEL_DEFAULT_WIDGETS.map((widget) => ({
        widget,
        description: PAINEL_WIDGET_DESCRIPTIONS[widget.id] ?? '',
    }));

// Cores das séries dos gráficos, na ordem em que as séries aparecem.
export const PAINEL_CHART_COLORS = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#f472b6'] as const;
