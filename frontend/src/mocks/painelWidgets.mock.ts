import type { PainelKpiData } from '@/types/painel';

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
