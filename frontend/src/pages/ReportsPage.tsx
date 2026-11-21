import { useEffect, useMemo, useState } from 'react';
import { reportsApi } from '@/api/reports/reportIndex';
import { ReportFiltersPanel } from '@/components/reports/ReportFilterPanel';
import { ReportSheet } from '@/components/reports/ReportSheet';
import { buttonClass, buttonPrimaryClass } from '@/components/reports/reportStyles';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageShell } from '@/components/shared/PageShell';
import { useReport } from '@/hooks/useReport';
import { useReportHistory } from '@/hooks/useReportHistory';
import { exportReportCsv } from '@/lib/reports/exportCsv';
import type { ReportChartOptions, ReportFilters, ReportRegion } from '@/types/report';

const EMPTY_FILTERS: ReportFilters = { regionCodes: [], statuses: [], from: '', to: '' };
const DEFAULT_CHART: ReportChartOptions = { enabled: true, type: 'line', range: '24h' };

type PdfState = 'idle' | 'working' | 'error';

export function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
    const [chart, setChart] = useState<ReportChartOptions>(DEFAULT_CHART);
    const [regions, setRegions] = useState<ReportRegion[]>([]);
    const [regionsError, setRegionsError] = useState(false);
    const [pdfState, setPdfState] = useState<PdfState>('idle');
    const { data, status, error, reload } = useReport(filters);

    const idsKey = data
        ? data.sections
              .flatMap((s) => s.services.map((x) => x.id))
              .sort()
              .join('\n')
        : '';
    const serviceIds = useMemo(() => (idsKey ? idsKey.split('\n') : []), [idsKey]);
    const history = useReportHistory(serviceIds, chart.range, chart.enabled);

    useEffect(() => {
        const ctrl = new AbortController();
        reportsApi
            .getRegions(ctrl.signal)
            .then(setRegions)
            .catch(() => {
                if (!ctrl.signal.aborted) setRegionsError(true);
            });
        return () => ctrl.abort();
    }, []);

    const canExport = status === 'ready' && data !== null && data.total > 0;

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
                description="Filtre os serviços por região, status e período, confira a prévia e exporte"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className={buttonClass}
                            onClick={() => data && exportReportCsv(data)}
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

            <p role="status" className="min-h-5 text-sm text-destructive print:hidden">
                {pdfState === 'error' ? 'Não foi possível gerar o PDF. Tente de novo.' : ''}
            </p>

            <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
                <ReportFiltersPanel
                    filters={filters}
                    regions={regions}
                    regionsError={regionsError}
                    chart={chart}
                    onChange={setFilters}
                    onChartChange={setChart}
                    onClear={() => setFilters(EMPTY_FILTERS)}
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
                    ) : !data ? (
                        <p className="text-muted-foreground">Gerando prévia...</p>
                    ) : data.total === 0 && status === 'ready' ? (
                        <div className="grid justify-items-start gap-3">
                            <p className="text-muted-foreground">Nenhum serviço encontrado com esses filtros.</p>
                            <button type="button" className={buttonClass} onClick={() => setFilters(EMPTY_FILTERS)}>
                                Limpar filtros
                            </button>
                        </div>
                    ) : (
                        <ReportSheet
                            data={data}
                            regions={regions}
                            loading={status === 'loading'}
                            chart={chart}
                            history={{
                                status: history.status,
                                data: history.data,
                                error: history.error,
                                onRetry: history.reload,
                            }}
                        />
                    )}
                </section>
            </div>
        </PageShell>
    );
}

export default ReportsPage;