import { useMemo, useState } from 'react';

import { reportsApi } from '@/api/reports/reportIndex';
import { ReportErrorBoundary } from '@/components/reports/ReportErrorBoundary';
import { ReportFiltersPanel } from '@/components/reports/ReportFilterPanel';
import { ReportSheet } from '@/components/reports/ReportSheet';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import { SECONDARY_ACTION_BUTTON_CLASS_NAME } from '@/components/shared/actionButtonStyles';
import { useReport } from '@/hooks/useReport';
import { useReportHistory } from '@/hooks/useReportHistory';
import { buildPdfRequest } from '@/lib/reports/buildPdfRequest';
import { exportReportCsv } from '@/lib/reports/exportCsv';
import { selectServices } from '@/lib/reports/selectServices';
import type { ReportChartOptions, ReportFilters } from '@/types/report';

const EMPTY_FILTERS: ReportFilters = { statuses: [], from: '', to: '' };
const DEFAULT_CHART: ReportChartOptions = { enabled: true, type: 'line', range: '24h' };

type PdfState = 'idle' | 'working' | 'error';

export function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
    const [chart, setChart] = useState<ReportChartOptions>(DEFAULT_CHART);

    // null representa o estado inicial: nenhum serviço selecionado.
    const [excludedServiceIds, setExcludedServiceIds] = useState<string[] | null>(null);

    const [pdfState, setPdfState] = useState<PdfState>('idle');

    const { data: catalog, status, error, reload } = useReport(filters);

    const allServiceIds = useMemo(
        () =>
            catalog?.sections.flatMap((section) => section.services.map((service) => service.id)) ??
            [],
        [catalog],
    );

    // Quando null, todos os serviços ficam excluídos.
    const effectiveExcludedServiceIds = excludedServiceIds ?? allServiceIds;

    const report = useMemo(
        () => (catalog ? selectServices(catalog, new Set(effectiveExcludedServiceIds)) : null),
        [catalog, effectiveExcludedServiceIds],
    );

    const idsKey = report
        ? report.sections
              .flatMap((s) => s.services.map((x) => x.id))
              .sort()
              .join('\n')
        : '';

    const serviceIds = useMemo(() => (idsKey ? idsKey.split('\n') : []), [idsKey]);

    const history = useReportHistory(
        serviceIds,
        chart.range,
        filters.from,
        filters.to,
        chart.enabled,
    );

    const canExport = status === 'ready' && report !== null && report.total > 0;

    function clearAll() {
        setFilters(EMPTY_FILTERS);
        setExcludedServiceIds(null);
    }

    async function handlePdf() {
        setPdfState('working');

        try {
            await reportsApi.downloadPdf(buildPdfRequest(serviceIds, chart, filters));
            setPdfState('idle');
        } catch {
            setPdfState('error');
        }
    }

    return (
        <PageShell>
            <PageHeader
                title="Relatórios"
                description="Escolha os serviços, filtre por status e período, confira a prévia e exporte"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className={`${SECONDARY_ACTION_BUTTON_CLASS_NAME} min-h-10 shrink-0 px-4 py-2 text-sm`}
                            onClick={() => report && exportReportCsv(report)}
                            disabled={!canExport}
                        >
                            Baixar CSV
                        </button>

                        <button
                            type="button"
                            className={`${SECONDARY_ACTION_BUTTON_CLASS_NAME} min-h-10 shrink-0 px-4 py-2 text-sm`}
                            onClick={handlePdf}
                            disabled={!canExport || pdfState === 'working'}
                        >
                            {pdfState === 'working' ? 'Gerando PDF...' : 'Exportar PDF'}
                        </button>
                    </div>
                }
            />

            <div className="mt-4">
                {pdfState === 'error' && (
                    <p role="alert" className="mb-3 text-sm text-destructive print:hidden">
                        Não foi possível gerar o PDF. Tente de novo.
                    </p>
                )}

                <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
                    <ReportFiltersPanel
                        filters={filters}
                        catalog={catalog?.sections ?? []}
                        excludedServiceIds={effectiveExcludedServiceIds}
                        chart={chart}
                        onChange={setFilters}
                        onExcludedChange={(next) => setExcludedServiceIds(next)}
                        onChartChange={setChart}
                        onClear={clearAll}
                    />

                    <section aria-label="Prévia do relatório" className="min-w-0">
                        {status === 'error' ? (
                            <div role="alert" className="grid justify-items-start gap-3">
                                <p className="text-sm text-destructive">
                                    Não foi possível gerar a prévia{error ? `: ${error}` : '.'}
                                </p>

                                <button
                                    type="button"
                                    className={SECONDARY_ACTION_BUTTON_CLASS_NAME}
                                    onClick={reload}
                                >
                                    Tentar de novo
                                </button>
                            </div>
                        ) : !catalog || !report ? (
                            <p className="text-muted-foreground">Gerando prévia...</p>
                        ) : catalog.total === 0 && status === 'ready' ? (
                            <div className="grid justify-items-start gap-3">
                                <p className="text-muted-foreground">
                                    Nenhum serviço encontrado com esses filtros.
                                </p>

                                <button
                                    type="button"
                                    className={SECONDARY_ACTION_BUTTON_CLASS_NAME}
                                    onClick={clearAll}
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        ) : report.total === 0 ? (
                            <p className="text-muted-foreground">Nenhum serviço selecionado.</p>
                        ) : (
                            <ReportErrorBoundary resetKey={report}>
                                <ReportSheet
                                    data={report}
                                    totalCount={catalog.total}
                                    loading={status === 'loading'}
                                    chart={chart}
                                    history={{
                                        status: history.status,
                                        data: history.data,
                                        error: history.error,
                                        onRetry: history.reload,
                                    }}
                                />
                            </ReportErrorBoundary>
                        )}
                    </section>
                </div>
            </div>
        </PageShell>
    );
}

export default ReportsPage;
