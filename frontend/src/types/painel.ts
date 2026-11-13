export type PainelTemplateId = 'visao-geral' | 'sustentabilidade' | 'operacional' | 'executivo';

export type PainelWidgetType = 'kpi' | 'serie-temporal' | 'distribuicao' | 'tabela' | 'status';

// Situação do conteúdo de um widget. O contêiner (PainelWidgetFrame) mostra o
// aviso de cada situação e só renderiza o conteúdo quando ela é 'ready'.
export type PainelWidgetStatus = 'loading' | 'error' | 'empty' | 'ready';

export interface PainelWidgetAction {
    label: string;
    onSelect?: () => void;
    disabled?: boolean;
}

// Cada widget ocupa um retângulo da grade de 12 colunas: x e y são a coluna e a
// linha onde ele começa (a partir de 0), w e h são quantas colunas e linhas ocupa.
export interface PainelWidget {
    id: string;
    type: PainelWidgetType;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

// Indicador numérico. A variação é calculada contra previousValue (o mesmo
// intervalo imediatamente anterior); lowerIsBetter diz se cair é bom (emissão)
// ou ruim (disponibilidade), para colorir a variação.
export interface PainelKpiData {
    label: string;
    value: number;
    unit: string;
    previousValue: number | null;
    lowerIsBetter: boolean;
    fractionDigits?: number;
}
