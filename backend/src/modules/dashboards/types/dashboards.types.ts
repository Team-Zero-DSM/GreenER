// Formato do painel de monitoramento salvo por usuário. Segue o PainelConfig do
// frontend (frontend/src/types/painel.ts).
export type DashboardWidgetType = 'kpi' | 'serie-temporal' | 'distribuicao' | 'tabela' | 'status';

export interface DashboardWidgetPosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface DashboardWidget extends DashboardWidgetPosition {
    id: string;
    type: DashboardWidgetType;
    title: string;
    chart?: string;
    metric?: string;
    palette?: string;
    region?: string;
    alert?: { direction: 'acima' | 'abaixo'; threshold: number };
}

export interface DashboardConfig {
    template: string;
    // Widgets com a posição no desktop (grade de 12 colunas).
    widgets: DashboardWidget[];
    // Posição de cada widget no tablet (grade de 6 colunas), pelo id do widget.
    tablet?: Record<string, DashboardWidgetPosition>;
    // Ordem dos widgets no celular, de cima para baixo.
    mobileOrder?: string[];
}

export interface DashboardRow {
    template: string;
    widgets: DashboardWidget[];
    posicoes_tablet: Record<string, DashboardWidgetPosition> | null;
    ordem_mobile: string[] | null;
}
