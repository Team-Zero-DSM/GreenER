import type { PainelTemplateId, PainelWidget } from '@/types/painel';

// Colunas da grade por tamanho de tela. As classes do PainelGrid precisam
// acompanhar estes valores (lg:grid-cols-12, md:grid-cols-6 e uma coluna no celular).
export const PAINEL_GRID_COLUMNS = 12;
export const PAINEL_TABLET_COLUMNS = 6;

export const PAINEL_TEMPLATE_OPTIONS: readonly { value: PainelTemplateId; label: string }[] = [
    { value: 'visao-geral', label: 'Visão geral' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'operacional', label: 'Operacional' },
    { value: 'executivo', label: 'Executivo' },
];

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
        title: 'Energia por região',
        x: 8,
        y: 6,
        w: 4,
        h: 4,
    },
];
