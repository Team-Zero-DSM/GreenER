import type {
    PainelDistributionData,
    PainelKpiData,
    PainelSeriesData,
    PainelStatusData,
    PainelTableData,
} from '@/types/painel';

// Dados simulados dos widgets do painel, indexados pelo id do widget. Serão
// trocados pelas rotas do backend na integração (#149).
export const PAINEL_KPI_MOCK: Record<string, PainelKpiData> = {
    'co2e-total': {
        label: 'Emissão total',
        value: 3.42,
        unit: 'kg CO₂e',
        previousValue: 3.73,
        lowerIsBetter: true,
        fractionDigits: 2,
    },
    'energia-total': {
        label: 'Energia consumida',
        value: 14.3,
        unit: 'kWh',
        previousValue: 13.87,
        lowerIsBetter: true,
    },
    disponibilidade: {
        label: 'Média dos serviços',
        value: 98.7,
        unit: '%',
        previousValue: 98.3,
        lowerIsBetter: false,
    },
    'intensidade-carbono': {
        label: 'Média ponderada',
        value: 239,
        unit: 'g CO₂e/kWh',
        previousValue: 251,
        lowerIsBetter: true,
        fractionDigits: 0,
    },
};

// Curva diária simulada: uma onda suave em torno de uma base, diferente por região.
function emissaoSimulada(hora: number, base: number, amplitude: number, fase: number): number {
    const valor = base + amplitude * Math.sin((hora / 24) * 2 * Math.PI + fase);
    return Math.round(valor * 10) / 10;
}

export const PAINEL_SERIES_MOCK: Record<string, PainelSeriesData> = {
    'co2e-por-regiao': {
        unit: 'g CO₂e',
        series: [
            { key: 'us-east', label: 'us-east' },
            { key: 'eu-west', label: 'eu-west' },
            { key: 'br-sudeste', label: 'br-sudeste' },
        ],
        points: Array.from({ length: 24 }, (_, hora) => ({
            label: `${String(hora).padStart(2, '0')}h`,
            values: {
                'us-east': emissaoSimulada(hora, 160, 45, 0.3),
                'eu-west': emissaoSimulada(hora, 120, 35, 1.4),
                'br-sudeste': emissaoSimulada(hora, 70, 20, 2.2),
            },
        })),
    },
};

export const PAINEL_DISTRIBUTION_MOCK: Record<string, PainelDistributionData> = {
    'energia-por-regiao': {
        unit: 'kWh',
        items: [
            { label: 'us-east', value: 4.8 },
            { label: 'eu-west', value: 3.9 },
            { label: 'jp-east', value: 2.1 },
            { label: 'br-sudeste', value: 1.6 },
            { label: 'ca-central', value: 1.2 },
        ],
    },
};

export const PAINEL_TABLE_MOCK: Record<string, PainelTableData> = {
    'top-emissores': {
        columns: [
            { key: 'posicao', label: '#' },
            { key: 'servico', label: 'Serviço' },
            { key: 'regiao', label: 'Região' },
            { key: 'co2e', label: 'CO₂e', align: 'right' },
        ],
        rows: [
            {
                id: 'nebula-worker',
                cells: {
                    posicao: '1',
                    servico: 'Nebula Worker',
                    regiao: 'us-east',
                    co2e: '544,3 g',
                },
            },
            {
                id: 'orion-guard',
                cells: { posicao: '2', servico: 'Orion Guard', regiao: 'us-east', co2e: '453,6 g' },
            },
            {
                id: 'atlas-recomenda',
                cells: {
                    posicao: '3',
                    servico: 'Atlas Recomenda',
                    regiao: 'eu-west',
                    co2e: '442,5 g',
                },
            },
            {
                id: 'lumen-eventos',
                cells: {
                    posicao: '4',
                    servico: 'Lumen Eventos',
                    regiao: 'jp-east',
                    co2e: '418,5 g',
                },
            },
            {
                id: 'aurora-api',
                cells: { posicao: '5', servico: 'Aurora API', regiao: 'br-sudeste', co2e: '102 g' },
            },
        ],
    },
    'falhas-coleta': {
        columns: [
            { key: 'servico', label: 'Serviço' },
            { key: 'motivo', label: 'Motivo' },
            { key: 'quando', label: 'Quando', align: 'right' },
        ],
        rows: [
            {
                id: 'lumen-eventos',
                cells: { servico: 'Lumen Eventos', motivo: 'Tempo esgotado', quando: 'há 2 min' },
            },
            {
                id: 'vega-relatorios',
                cells: { servico: 'Vega Relatórios', motivo: 'Sem métricas', quando: 'há 6 min' },
            },
            {
                id: 'brisa-notifica',
                cells: { servico: 'Brisa Notifica', motivo: 'HTTP 503', quando: 'há 14 min' },
            },
            {
                id: 'nexo-estoque',
                cells: { servico: 'Nexo Estoque', motivo: 'Sem métricas', quando: 'há 21 min' },
            },
        ],
    },
};

export const PAINEL_STATUS_MOCK: Record<string, PainelStatusData> = {
    'status-servicos': { available: 17, unavailable: 1, metricsMissing: 2 },
};
