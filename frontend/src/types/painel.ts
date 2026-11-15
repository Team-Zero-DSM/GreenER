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

// Tabela ou lista simples (ex.: top serviços, últimas falhas). Cada linha traz o
// texto de cada coluna, pela chave da coluna.
export interface PainelTableData {
    columns: readonly { key: string; label: string; align?: 'left' | 'right' }[];
    rows: readonly { id: string; cells: Record<string, string> }[];
}

// Quantos serviços estão em cada situação na última rodada de coleta.
export interface PainelStatusData {
    available: number;
    unavailable: number;
    metricsMissing: number;
}

// Conteúdo pronto de um widget, já no formato do tipo dele.
export type PainelWidgetContent =
    | { type: 'kpi'; data: PainelKpiData }
    | { type: 'serie-temporal'; data: PainelSeriesData }
    | { type: 'distribuicao'; data: PainelDistributionData }
    | { type: 'tabela'; data: PainelTableData }
    | { type: 'status'; data: PainelStatusData };

// O que a integração com o backend entrega para um widget: a situação da busca
// e, quando ela deu certo, o conteúdo.
export interface PainelWidgetSource {
    status: PainelWidgetStatus;
    // Período a que os dados se referem, mostrado abaixo do título.
    subtitle?: string;
    errorMessage?: string;
    content?: PainelWidgetContent;
}

// Fontes de dados do painel, pelo id do widget.
export type PainelWidgetSources = Record<string, PainelWidgetSource>;

// Configuração do painel de um usuário: o template escolhido e os widgets com
// suas posições. É o que as rotas /dashboards/me leem e gravam.
export interface PainelConfig {
    template: PainelTemplateId;
    widgets: readonly PainelWidget[];
}
