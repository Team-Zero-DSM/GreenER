import type { PainelTemplateId, PainelWidget } from '@/types/painel';

import { PAINEL_DEFAULT_WIDGETS } from './painelLayoutPadrao';

// Template de painel: um arranjo pronto de widgets que o usuário aplica como
// ponto de partida e depois personaliza.
export interface PainelTemplate {
    id: PainelTemplateId;
    label: string;
    description: string;
    widgets: readonly PainelWidget[];
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
];

export const PAINEL_TEMPLATE_OPTIONS: readonly { value: PainelTemplateId; label: string }[] =
    PAINEL_TEMPLATES.map((template) => ({ value: template.id, label: template.label }));

// Template pelo id. Um id desconhecido (ex.: configuração antiga) cai no primeiro.
export function getPainelTemplate(id: PainelTemplateId): PainelTemplate {
    return PAINEL_TEMPLATES.find((template) => template.id === id) ?? PAINEL_TEMPLATES[0];
}
