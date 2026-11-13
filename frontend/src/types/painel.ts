export type PainelTemplateId = 'visao-geral' | 'sustentabilidade' | 'operacional' | 'executivo';

export type PainelWidgetType = 'kpi' | 'serie-temporal' | 'distribuicao' | 'tabela' | 'status';

export type PainelSeriesChart = 'linha' | 'area' | 'barras';

export type PainelDistributionChart = 'pizza' | 'rosca' | 'barras-horizontais';

export type PainelChartType = PainelSeriesChart | PainelDistributionChart;

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
    // Tipo de gráfico, para os widgets que têm mais de uma forma de exibir.
    chart?: PainelChartType;
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

// Série temporal com uma ou mais séries (ex.: uma por região). Cada ponto traz o
// rótulo do eixo do tempo e o valor de cada série, pela chave da série.
export interface PainelSeriesData {
    unit: string;
    series: readonly { key: string; label: string }[];
    points: readonly { label: string; values: Record<string, number> }[];
}

// Distribuição de um total entre categorias (ex.: energia por região).
export interface PainelDistributionData {
    unit: string;
    items: readonly { label: string; value: number }[];
}
