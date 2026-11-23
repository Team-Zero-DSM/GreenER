import { lazy, Suspense, useMemo, useState } from 'react';

import { ReportFiltersPanel } from '@/components/reports/ReportFilterPanel';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import { SECONDARY_ACTION_BUTTON_CLASS_NAME } from '@/components/shared/actionButtonStyles';
import { useReport } from '@/hooks/useReport';
import { useReportPdf } from '@/hooks/useReportPdf';
import { buildPdfRequest } from '@/lib/reports/buildPdfRequest';
import { exportReportCsv } from '@/lib/reports/exportCsv';
import { downloadBlob } from '@/lib/reports/download';
import { selectServices } from '@/lib/reports/selectServices';
import type { ReportChartOptions, ReportFilters } from '@/types/report';

const EMPTY_FILTERS: ReportFilters = { statuses: [], from: '', to: '' };
const DEFAULT_CHART: ReportChartOptions = { enabled: true, type: 'line', range: '24h' };
const ReportPdfPreview = lazy(() => import('@/components/reports/ReportPdfPreview'));

export function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
    const [chart, setChart] = useState<ReportChartOptions>(DEFAULT_CHART);

    // null representa o estado inicial: nenhum serviço selecionado.
    const [excludedServiceIds, setExcludedServiceIds] = useState<string[] | null>(null);

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

    const canExport = status === 'ready' && report !== null && report.total > 0;
    const pdfRequest = useMemo(
        () => (canExport ? buildPdfRequest(serviceIds, chart, filters) : null),
        [canExport, serviceIds, chart, filters],
    );
    const pdf = useReportPdf(pdfRequest);

    function clearAll() {
        setFilters(EMPTY_FILTERS);
        setExcludedServiceIds(null);
    }

    function handlePdf() {
        if (pdf.file) downloadBlob(pdf.file.blob, pdf.file.filename);
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
                            disabled={!canExport || pdf.status !== 'ready'}
                        >
                            {pdf.status === 'loading' ? 'Gerando PDF...' : 'Exportar PDF'}
                        </button>
                    </div>
                }
            />

            <div className="mt-4">
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
                        ) : status === 'loading' || !catalog || !report ? (
                            <p role="status" className="text-muted-foreground">
                                Gerando prévia...
                            </p>
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
                        ) : pdf.status === 'error' ? (
                            <div role="alert" className="grid justify-items-start gap-3">
                                <p className="text-sm text-destructive">
                                    Não foi possível gerar a prévia do PDF: {pdf.error}
                                </p>
                                <button
                                    type="button"
                                    className={SECONDARY_ACTION_BUTTON_CLASS_NAME}
                                    onClick={pdf.reload}
                                >
                                    Tentar de novo
                                </button>
                            </div>
                        ) : pdf.file ? (
                            <Suspense
                                fallback={
                                    <p role="status" className="text-muted-foreground">
                                        Preparando prévia...
                                    </p>
                                }
                            >
                                <ReportPdfPreview blob={pdf.file.blob} onRetry={pdf.reload} />
                            </Suspense>
                        ) : (
                            <p role="status" className="text-muted-foreground">
                                Gerando prévia do PDF...
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </PageShell>
    );
}

export default ReportsPage;
