import { useMemo, useState } from 'react';
import { reportsApi } from '@/api/reports/reportIndex';
import { ReportErrorBoundary } from '@/components/reports/ReportErrorBoundary';
import { ReportFiltersPanel } from '@/components/reports/ReportFilterPanel';
import { ReportSheet } from '@/components/reports/ReportSheet';
import { buttonClass, buttonPrimaryClass } from '@/components/reports/reportStyles';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import { useReport } from '@/hooks/useReport';
import { useReportHistory } from '@/hooks/useReportHistory';
import { exportReportCsv } from '@/lib/reports/exportCsv';
import { selectServices } from '@/lib/reports/selectServices';
import type { ReportChartOptions, ReportFilters } from '@/types/report';

const EMPTY_FILTERS: ReportFilters = { statuses: [], from: '', to: '' };
const DEFAULT_CHART: ReportChartOptions = { enabled: true, type: 'line', range: '24h' };

type PdfState = 'idle' | 'working' | 'error';

export function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
    const [chart, setChart] = useState<ReportChartOptions>(DEFAULT_CHART);
    const [excludedServiceIds, setExcludedServiceIds] = useState<string[]>([]);
    const [pdfState, setPdfState] = useState<PdfState>('idle');

    const { data: catalog, status, error, reload } = useReport(filters);

    const report = useMemo(
        () => (catalog ? selectServices(catalog, new Set(excludedServiceIds)) : null),
        [catalog, excludedServiceIds],
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
        setExcludedServiceIds([]);
    }

    async function handlePdf() {
        setPdfState('working');

        try {
            await reportsApi.downloadPdf(filters);
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
                            className={buttonClass}
                            onClick={() => report && exportReportCsv(report)}
                            disabled={!canExport}
                        >
                            Baixar CSV
                        </button>

                        <button
                            type="button"
                            className={buttonPrimaryClass}
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
                        excludedServiceIds={excludedServiceIds}
                        chart={chart}
                        onChange={setFilters}
                        onExcludedChange={setExcludedServiceIds}
                        onChartChange={setChart}
                        onClear={clearAll}
                    />

                    <section aria-label="Prévia do relatório" className="min-w-0">
                        {status === 'error' ? (
                            <div role="alert" className="grid justify-items-start gap-3">
                                <p className="text-sm text-destructive">
                                    Não foi possível gerar a prévia{error ? `: ${error}` : '.'}
                                </p>

                                <button type="button" className={buttonClass} onClick={reload}>
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

                                <button type="button" className={buttonClass} onClick={clearAll}>
                                    Limpar filtros
                                </button>
                            </div>
                        ) : report.total === 0 ? (
                            <div className="grid justify-items-start gap-3">
                                <p className="text-muted-foreground">Nenhum serviço selecionado.</p>

                                <button
                                    type="button"
                                    className={buttonClass}
                                    onClick={() => setExcludedServiceIds([])}
                                >
                                    Selecionar todos
                                </button>
                            </div>
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
