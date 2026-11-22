import { ChartCard } from '@/components/charts/ChartCard';
import { buttonClass } from '@/components/reports/reportStyles';
import { HISTORY_RANGES, RANGE_LABEL } from '@/lib/reports/historyRanges';
import { statusInfo } from '@/lib/serviceStatus';
import type { ChartType, RegionSection, ReportChartOptions, ReportFilters } from '@/types/report';
import type { HistoryRange } from '@/types/service';
import { REPORT_STATUSES } from '@/utils/reportStatusMeta';

interface Props {
    filters: ReportFilters;
    catalog: RegionSection[];
    excludedServiceIds: string[];
    chart: ReportChartOptions;
    onChange: (next: ReportFilters) => void;
    onExcludedChange: (next: string[]) => void;
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
    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50';
const togglePressed = 'border-cyan-400/60 bg-cyan-400/15 text-foreground';
const toggleIdle = 'border-white/15 text-muted-foreground hover:border-cyan-400/50 hover:bg-cyan-400/10';

export function ReportFiltersPanel({
    filters,
    catalog,
    excludedServiceIds,
    chart,
    onChange,
    onExcludedChange,
    onChartChange,
    onClear,
}: Props) {
    const excluded = new Set(excludedServiceIds);
    const allIds = catalog.flatMap((s) => s.services.map((x) => x.id));
    const selectedCount = allIds.filter((id) => !excluded.has(id)).length;

    const setMany = (ids: string[], select: boolean) =>
        onExcludedChange(
            select ? excludedServiceIds.filter((id) => !ids.includes(id)) : [...new Set([...excludedServiceIds, ...ids])],
        );

    const activeCount =
        filters.statuses.length +
        (filters.from ? 1 : 0) +
        (filters.to ? 1 : 0) +
        (selectedCount < allIds.length ? 1 : 0);
    const subtitle =
        activeCount === 0
            ? 'Sem nenhum filtro, o relatório inclui tudo'
            : `${activeCount} ${activeCount === 1 ? 'filtro ativo' : 'filtros ativos'}`;
    const rangeHint = filters.from
        ? 'Usando o período do filtro “Última atualização”.'
        : filters.to
          ? 'Termina na data “Até” do filtro.'
          : null;

    return (
        <aside aria-label="Filtros do relatório" className="min-w-0 self-start lg:sticky lg:top-4 print:hidden">
            <ChartCard title="Filtros" subtitle={subtitle}>
                <div className="grid gap-6">
                    <fieldset>
                        <legend className={legendClass}>
                            Serviços ({selectedCount} de {allIds.length})
                        </legend>
                        {allIds.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Os serviços aparecem aqui quando o relatório carregar.
                            </p>
                        ) : (
                            <div className="grid gap-2">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className={`${toggleBase} ${toggleIdle}`}
                                        disabled={selectedCount === allIds.length}
                                        onClick={() => onExcludedChange([])}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        type="button"
                                        className={`${toggleBase} ${toggleIdle}`}
                                        disabled={selectedCount === 0}
                                        onClick={() => onExcludedChange(allIds)}
                                    >
                                        Nenhum
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto rounded-lg border border-white/10 p-3">
                                    {catalog.map((section) => {
                                        const ids = section.services.map((s) => s.id);
                                        const selectedHere = ids.filter((id) => !excluded.has(id)).length;
                                        const all = selectedHere === ids.length;
                                        const some = selectedHere > 0 && !all;
                                        return (
                                            <div key={section.region.code} className="mb-3 last:mb-0">
                                                <label className="mb-1 flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                    <input
                                                        type="checkbox"
                                                        className="size-4 accent-cyan-400"
                                                        checked={all}
                                                        ref={(el) => {
                                                            if (el) el.indeterminate = some;
                                                        }}
                                                        onChange={() => setMany(ids, !all)}
                                                    />
                                                    {section.region.name}
                                                </label>
                                                <ul className="grid gap-1.5 pl-6">
                                                    {section.services.map((service) => (
                                                        <li key={service.id}>
                                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                                                                <input
                                                                    type="checkbox"
                                                                    className="size-4 accent-cyan-400"
                                                                    checked={!excluded.has(service.id)}
                                                                    onChange={() =>
                                                                        onExcludedChange(toggle(excludedServiceIds, service.id))
                                                                    }
                                                                />
                                                                {service.name}
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </fieldset>

                    <fieldset>
                        <legend className={legendClass}>Status</legend>
                        <ul className="grid gap-2">
                            {REPORT_STATUSES.map((status) => (
                                <li key={status}>
                                    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                                        <input
                                            type="checkbox"
                                            className="size-4 accent-cyan-400"
                                            checked={filters.statuses.includes(status)}
                                            onChange={() => onChange({ ...filters, statuses: toggle(filters.statuses, status) })}
                                        />
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo[status].className}`}
                                        >
                                            <span aria-hidden="true">{statusInfo[status].icon}</span>
                                            {statusInfo[status].label}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
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
                                        className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
                                        disabled={Boolean(filters.from)}
                                        value={chart.range}
                                        onChange={(e) => onChartChange({ ...chart, range: e.target.value as HistoryRange })}
                                    >
                                        {HISTORY_RANGES.map((range) => (
                                            <option key={range} value={range}>
                                                {RANGE_LABEL[range]}
                                            </option>
                                        ))}
                                    </select>
                                    {rangeHint && <span className="text-xs">{rangeHint}</span>}
                                </label>
                            </div>
                        )}
                    </fieldset>
                </div>
            </ChartCard>
        </aside>
    );
}