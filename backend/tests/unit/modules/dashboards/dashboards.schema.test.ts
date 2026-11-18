import { describe, expect, it } from 'vitest';
import { dashboardConfigSchema } from '../../../../src/modules/dashboards/dashboards.schema.js';

const kpi = { id: 'co2e-total', type: 'kpi', title: 'CO₂e no período', x: 0, y: 0, w: 3, h: 2 };
const series = {
    id: 'co2e-por-regiao',
    type: 'serie-temporal',
    title: 'Emissão por região',
    chart: 'area',
    x: 0,
    y: 2,
    w: 12,
    h: 4,
};

function issuePaths(input: unknown) {
    const result = dashboardConfigSchema.safeParse(input);
    expect(result.success).toBe(false);
    return result.error?.issues.map((issue) => issue.path.join('.'));
}

describe('Validação da configuração do painel (dashboards)', () => {
    it('deve aceitar um painel completo com arranjos de tablet e celular', () => {
        const result = dashboardConfigSchema.safeParse({
            template: 'visao-geral',
            widgets: [
                {
                    ...kpi,
                    palette: 'oceano',
                    region: 'br-sp',
                    alert: { direction: 'acima', threshold: 500 },
                },
                { ...series, metric: 'energia-no-tempo' },
            ],
            tablet: {
                'co2e-total': { x: 0, y: 0, w: 3, h: 2 },
                'co2e-por-regiao': { x: 0, y: 2, w: 6, h: 4 },
            },
            mobileOrder: ['co2e-por-regiao', 'co2e-total'],
        });

        expect(result.success).toBe(true);
    });

    it('deve aceitar o painel em branco, sem widgets', () => {
        expect(
            dashboardConfigSchema.safeParse({ template: 'em-branco', widgets: [] }).success,
        ).toBe(true);
    });

    it('deve rejeitar template e tipo de widget desconhecidos', () => {
        expect(
            issuePaths({ template: 'meu-template', widgets: [{ ...kpi, type: 'mapa' }] }),
        ).toEqual(expect.arrayContaining(['template', 'widgets.0.type']));
    });

    it('deve rejeitar métrica desconhecida ou que não combina com o tipo do widget', () => {
        expect(
            issuePaths({
                template: 'em-branco',
                widgets: [
                    { ...kpi, metric: 'temperatura' },
                    { ...series, metric: 'co2e-total' },
                ],
            }),
        ).toEqual(['widgets.0.metric', 'widgets.1.metric']);
    });

    it('deve rejeitar gráfico e alerta que o tipo do widget não aceita', () => {
        expect(
            issuePaths({
                template: 'em-branco',
                widgets: [
                    { ...kpi, chart: 'pizza' },
                    { ...series, chart: 'rosca', alert: { direction: 'acima', threshold: 1 } },
                ],
            }),
        ).toEqual(['widgets.0.chart', 'widgets.1.chart', 'widgets.1.alert']);
    });

    it('deve rejeitar paleta de cores desconhecida', () => {
        expect(
            issuePaths({ template: 'em-branco', widgets: [{ ...kpi, palette: 'neon' }] }),
        ).toEqual(['widgets.0.palette']);
    });

    it.each([
        { position: { x: 10, w: 3 }, motivo: 'passa da grade de 12 colunas' },
        { position: { x: -1 }, motivo: 'começa antes da primeira coluna' },
        { position: { w: 1 }, motivo: 'fica menor que o mínimo do tipo' },
        { position: { h: 2.5 }, motivo: 'tem tamanho fracionado' },
    ])('deve rejeitar o widget que $motivo', ({ position }) => {
        expect(issuePaths({ template: 'em-branco', widgets: [{ ...kpi, ...position }] })).toEqual([
            expect.stringMatching(/^widgets\.0/),
        ]);
    });

    it('deve rejeitar widgets repetidos', () => {
        expect(issuePaths({ template: 'em-branco', widgets: [kpi, { ...kpi, y: 2 }] })).toEqual([
            'widgets.1.id',
        ]);
    });

    it('deve rejeitar posições do tablet fora das 6 colunas ou de widgets que não estão no painel', () => {
        expect(
            issuePaths({
                template: 'em-branco',
                widgets: [kpi],
                tablet: {
                    'co2e-total': { x: 4, y: 0, w: 3, h: 2 },
                    'energia-total': { x: 0, y: 0, w: 3, h: 2 },
                },
            }),
        ).toEqual(['tablet.co2e-total', 'tablet.energia-total']);
    });

    it('deve rejeitar a ordem do celular com widget repetido ou fora do painel', () => {
        expect(
            issuePaths({
                template: 'em-branco',
                widgets: [kpi],
                mobileOrder: ['co2e-total', 'co2e-total', 'status-servicos'],
            }),
        ).toEqual(['mobileOrder.1', 'mobileOrder.2']);
    });

    it('deve rejeitar campos que o painel não conhece', () => {
        expect(
            issuePaths({ template: 'em-branco', widgets: [{ ...kpi, cor: 'vermelho' }], extra: 1 }),
        ).toEqual(expect.arrayContaining(['', 'widgets.0']));
    });
});
