import type { ReportChartOptions, ReportFilters, ReportPdfRequest } from '@/types/report';

const ALL_METRICS: ReportPdfRequest['metrics'] = ['energy', 'carbon', 'cpu', 'memory', 'power'];

// Traduz as escolhas da tela de relatórios para o formato do PDF gerado no backend.
export function buildPdfRequest(
    serviceIds: string[],
    chart: ReportChartOptions,
    filters: ReportFilters,
): ReportPdfRequest {
    const visualization = !chart.enabled ? 'table' : chart.type === 'bar' ? 'bars' : 'line';
    const request: ReportPdfRequest = {
        title: 'Relatório dos serviços monitorados',
        serviceIds,
        range: chart.range,
        metrics: ALL_METRICS,
        visualization,
    };

    // Com data final escolhida, o período do PDF termina no fim desse dia.
    if (filters.to) {
        const end = new Date(`${filters.to}T23:59:59`);
        if (end.getTime() < Date.now()) request.end = end.toISOString();
    }

    return request;
}
