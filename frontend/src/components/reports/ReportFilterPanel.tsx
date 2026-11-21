import { ChartCard } from '@/components/charts/ChartCard';
import { buttonClass } from '@/components/reports/reportStyles';
import { HISTORY_RANGES, RANGE_LABEL } from '@/lib/reports/historyRanges';
import { statusInfo } from '@/lib/serviceStatus';
import type { ChartType, ReportChartOptions, ReportFilters, ReportRegion } from '@/types/report';
import type { HistoryRange, ServiceStatus } from '@/types/service';
import { STATUS_ORDER } from '@/utils/reportStatusMeta';

interface Props {
    filters: ReportFilters;
    regions: ReportRegion[];
    regionsError: boolean;
    chart: ReportChartOptions;
    onChange: (next: ReportFilters) => void;
    onChartChange: (next: ReportChartOptions) => void;
    onClear: () => void;
}

function toggle<T>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Linhas' },
    { value: 'bar', label: 'Barras' },
];

const legendClass = 'mb-2 text-sm font-semibold text-foreground';
const fieldClass =
    'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';
const toggleBase =
    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';
const togglePressed = 'border-cyan-400/60 bg-cyan-400/15 text-foreground';
const toggleIdle = 'border-white/15 text-muted-foreground hover:border-cyan-400/50 hover:bg-cyan-400/10';

export function ReportFiltersPanel({ filters, regions, regionsError, chart, onChange, onChartChange, onClear }: Props) {
    const activeCount =
        filters.regionCodes.length + filters.statuses.length + (filters.from ? 1 : 0) + (filters.to ? 1 : 0);
    const subtitle =
        activeCount === 0
            ? 'Sem nenhum filtro marcado, o relatório inclui tudo'
            : `${activeCount} ${activeCount === 1 ? 'filtro ativo' : 'filtros ativos'}`;

    return (
        <aside aria-label="Filtros do relatório" className="min-w-0 self-start lg:sticky lg:top-4 print:hidden">
            <ChartCard title="Filtros" subtitle={subtitle}>
                <div className="grid gap-6">
                    <fieldset>
                        <legend className={legendClass}>Regiões</legend>
                        {regionsError && (
                            <p role="alert" className="mb-2 text-sm text-destructive">
                                Não foi possível carregar as regiões.
                            </p>
                        )}
                        <ul className="grid gap-2">
                            {regions.map((region) => (
                                <li key={region.code}>
                                    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                                        <input
                                            type="checkbox"
                                            className="size-4 accent-cyan-400"
                                            checked={filters.regionCodes.includes(region.code)}
                                            onChange={() =>
                                                onChange({ ...filters, regionCodes: toggle(filters.regionCodes, region.code) })
                                            }
                                        />
                                        {region.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <fieldset>
                        <legend className={legendClass}>Status</legend>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_ORDER.map((status: ServiceStatus) => {
                                const pressed = filters.statuses.includes(status);
                                return (
                                    <button
                                        key={status}
                                        type="button"
                                        aria-pressed={pressed}
                                        onClick={() => onChange({ ...filters, statuses: toggle(filters.statuses, status) })}
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                                            pressed
                                                ? `border-transparent ${statusInfo[status].className}`
                                                : 'border-white/15 text-muted-foreground hover:border-cyan-400/50 hover:bg-cyan-400/10'
                                        }`}
                                    >
                                        <span aria-hidden="true">{statusInfo[status].icon}</span>
                                        {statusInfo[status].label}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className={legendClass}>Última atualização</legend>
                        <div className="grid gap-3">
                            <label className="grid gap-1 text-sm text-muted-foreground">
                                De
                                <input
                                    type="date"
                                    className={fieldClass}
                                    value={filters.from}
                                    max={filters.to || undefined}
                                    onChange={(e) => onChange({ ...filters, from: e.target.value })}
                                />
                            </label>
                            <label className="grid gap-1 text-sm text-muted-foreground">
                                Até
                                <input
                                    type="date"
                                    className={fieldClass}
                                    value={filters.to}
                                    min={filters.from || undefined}
                                    onChange={(e) => onChange({ ...filters, to: e.target.value })}
                                />
                            </label>
                        </div>
                    </fieldset>

                    <button type="button" className={buttonClass} onClick={onClear} disabled={activeCount === 0}>
                        Limpar filtros
                    </button>

                    <fieldset className="border-t border-white/10 pt-5">
                        <legend className={legendClass}>Gráfico de histórico</legend>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                            <input
                                type="checkbox"
                                className="size-4 accent-cyan-400"
                                checked={chart.enabled}
                                onChange={(e) => onChartChange({ ...chart, enabled: e.target.checked })}
                            />
                            Incluir no relatório
                        </label>
                        {chart.enabled && (
                            <div className="mt-3 grid gap-3">
                                <div role="group" aria-label="Tipo de gráfico" className="flex gap-2">
                                    {CHART_TYPES.map(({ value, label }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-pressed={chart.type === value}
                                            onClick={() => onChartChange({ ...chart, type: value })}
                                            className={`${toggleBase} ${chart.type === value ? togglePressed : toggleIdle}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <label className="grid gap-1 text-sm text-muted-foreground">
                                    Período
                                    <select
                                        className={fieldClass}
                                        value={chart.range}
                                        onChange={(e) => onChartChange({ ...chart, range: e.target.value as HistoryRange })}
                                    >
                                        {HISTORY_RANGES.map((range) => (
                                            <option key={range} value={range}>
                                                {RANGE_LABEL[range]}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        )}
                    </fieldset>
                </div>
            </ChartCard>
        </aside>
    );
}