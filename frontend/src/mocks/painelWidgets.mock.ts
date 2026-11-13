import type { PainelKpiData, PainelSeriesData } from '@/types/painel';

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
