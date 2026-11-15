import type { PainelTemplateId, PainelWidget } from '@/types/painel';

import { PAINEL_DEFAULT_WIDGETS, PAINEL_WIDGET_LIBRARY } from './painelLayoutPadrao';

// Template de painel: um arranjo pronto de widgets que o usuário aplica como
// ponto de partida e depois personaliza.
export interface PainelTemplate {
    id: PainelTemplateId;
    label: string;
    description: string;
    widgets: readonly PainelWidget[];
}

// Pega um widget da biblioteca e o coloca na posição e no tamanho que o template pede.
function place(
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    overrides: Partial<PainelWidget> = {},
): PainelWidget {
    const widget = PAINEL_WIDGET_LIBRARY.find((item) => item.id === id);

    if (!widget) {
        throw new Error(`Widget "${id}" não existe na biblioteca do painel.`);
    }

    return { ...widget, ...overrides, x, y, w, h };
}

export const PAINEL_TEMPLATES: readonly PainelTemplate[] = [
    {
        id: 'visao-geral',
        label: 'Visão geral',
        description:
            'Indicadores principais, emissão ao longo do tempo, status dos serviços e ranking.',
        // Linha de KPIs no topo, emissão no tempo ao lado do status dos serviços e,
        // embaixo, o ranking de emissores com as falhas e a energia por região.
        widgets: PAINEL_DEFAULT_WIDGETS,
    },
    {
        id: 'sustentabilidade',
        label: 'Sustentabilidade',
        description:
            'CO₂e e energia por região, intensidade de carbono e os serviços que mais emitem.',
        // Três indicadores ambientais no topo, a divisão de CO₂e e de energia por
        // região ao lado dos maiores emissores e, embaixo, a emissão no tempo.
        widgets: [
            place('co2e-total', 0, 0, 4, 2),
            place('energia-total', 4, 0, 4, 2),
            place('intensidade-carbono', 8, 0, 4, 2),
            place('co2e-distribuicao', 0, 2, 4, 4),
            place('energia-por-regiao', 4, 2, 4, 4, { chart: 'barras-horizontais' }),
            place('top-emissores', 8, 2, 4, 4),
            place('co2e-por-regiao', 0, 6, 12, 4),
        ],
    },
    {
        id: 'operacional',
        label: 'Operacional',
        description:
            'Disponibilidade, falhas de coleta, serviços sem métricas e últimas tentativas.',
        // À esquerda, a disponibilidade e o status dos serviços; à direita, as
        // falhas de coleta em destaque e, abaixo, as duas listas de acompanhamento.
        widgets: [
            place('disponibilidade', 0, 0, 4, 2),
            place('status-servicos', 0, 2, 4, 5),
            place('falhas-coleta', 4, 0, 8, 3),
            place('servicos-sem-metricas', 4, 3, 4, 4),
            place('ultimas-tentativas', 8, 3, 4, 4),
        ],
    },
    {
        id: 'executivo',
        label: 'Executivo',
        description: 'Poucos indicadores, bem grandes, para apresentar em TV ou telão.',
        // Quatro indicadores ocupando metade da tela cada um e a emissão no tempo
        // na largura inteira. Os números crescem junto com o tamanho do widget.
        widgets: [
            place('co2e-total', 0, 0, 6, 3),
            place('energia-total', 6, 0, 6, 3),
            place('disponibilidade', 0, 3, 6, 3),
            place('intensidade-carbono', 6, 3, 6, 3),
            place('co2e-por-regiao', 0, 6, 12, 5),
        ],
    },
    {
        id: 'em-branco',
        label: 'Em branco',
        description: 'Painel vazio, para montar do zero com os widgets do catálogo.',
        widgets: [],
    },
];

export const PAINEL_TEMPLATE_OPTIONS: readonly { value: PainelTemplateId; label: string }[] =
    PAINEL_TEMPLATES.map((template) => ({ value: template.id, label: template.label }));

// Template pelo id. Um id desconhecido (ex.: configuração antiga) cai no primeiro.
export function getPainelTemplate(id: PainelTemplateId): PainelTemplate {
    return PAINEL_TEMPLATES.find((template) => template.id === id) ?? PAINEL_TEMPLATES[0];
}
