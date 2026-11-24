import { AnimatedContent } from '@/components/shared/AnimatedContent';
import { ChartCard } from '@/components/charts/ChartCard';
import { DropdownSelect } from '@/components/shared/DropdownSelect';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { SECONDARY_ACTION_BUTTON_CLASS_NAME } from '@/components/shared/actionButtonStyles';
import { HISTORY_RANGES, RANGE_LABEL } from '@/lib/reports/historyRanges';
import { ServiceStatusBadge } from '@/components/services/ServiceStatusBadge';
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

function getLocalDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Linhas' },
    { value: 'bar', label: 'Barras' },
];

const legendClass = 'mb-3 flex items-center gap-2 text-sm font-semibold text-foreground';
const fieldClass =
    'min-h-12 w-full rounded-xl border border-border/60 bg-card/55 px-3 py-2 text-sm text-foreground [color-scheme:dark] outline-none transition-colors hover:border-primary/30 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10';
const toggleBase =
    'min-h-10 rounded-xl border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50';
const toggleIdle =
    'border-border/60 bg-card/55 text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground';

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
    const today = getLocalDateString();

    const excluded = new Set(excludedServiceIds);
    const allIds = catalog.flatMap((s) => s.services.map((x) => x.id));
    const selectedCount = allIds.filter((id) => !excluded.has(id)).length;

    const setMany = (ids: string[], select: boolean) =>
        onExcludedChange(
            select
                ? excludedServiceIds.filter((id) => !ids.includes(id))
                : [...new Set([...excludedServiceIds, ...ids])],
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

    const fromMax = filters.to && filters.to < today ? filters.to : today;

    return (
        <aside
            aria-label="Filtros do relatório"
            className="min-w-0 self-start lg:sticky lg:top-4 print:hidden"
        >
            <ChartCard title="Filtros" subtitle={subtitle}>
                <div className="grid gap-5">
                    <fieldset className="rounded-xl border border-border/60 bg-card/30 p-3.5">
                        <legend className={legendClass}>
                            Serviços
                            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {selectedCount} de {allIds.length}
                            </span>
                        </legend>

                        {allIds.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Os serviços aparecem aqui quando o relatório carregar.
                            </p>
                        ) : (
                            <div className="grid gap-3">
                                <div className="grid grid-cols-2 gap-2">
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

                                <div className="max-h-72 overflow-y-auto rounded-xl border border-border/60 bg-background/20 p-2.5 scrollbar-thin">
                                    {catalog.map((section) => {
                                        const ids = section.services.map((s) => s.id);
                                        const selectedHere = ids.filter(
                                            (id) => !excluded.has(id),
                                        ).length;
                                        const all = selectedHere === ids.length;
                                        const some = selectedHere > 0 && !all;

                                        return (
                                            <div
                                                key={section.region.code}
                                                className="mb-2 rounded-lg border border-transparent p-2 last:mb-0 hover:border-border/50 hover:bg-card/35"
                                            >
                                                <label className="mb-1.5 flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                    <input
                                                        type="checkbox"
                                                        className="size-4 accent-primary"
                                                        checked={all}
                                                        ref={(el) => {
                                                            if (el) el.indeterminate = some;
                                                        }}
                                                        onChange={() => setMany(ids, !all)}
                                                    />
                                                    {section.region.name}
                                                </label>

                                                <ul className="grid gap-1 pl-6">
                                                    {section.services.map((service) => (
                                                        <li key={service.id}>
                                                            <label className="flex cursor-pointer items-center gap-2 rounded-md py-1 text-sm text-foreground transition-colors hover:text-primary">
                                                                <input
                                                                    type="checkbox"
                                                                    className="size-4 shrink-0 accent-primary"
                                                                    checked={
                                                                        !excluded.has(service.id)
                                                                    }
                                                                    onChange={() =>
                                                                        onExcludedChange(
                                                                            toggle(
                                                                                excludedServiceIds,
                                                                                service.id,
                                                                            ),
                                                                        )
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

                    <fieldset className="rounded-xl border border-border/60 bg-card/30 p-3.5">
                        <legend className={legendClass}>Status</legend>

                        <ul className="grid gap-2">
                            {REPORT_STATUSES.map((status) => (
                                <li key={status}>
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary/[0.05]">
                                        <input
                                            type="checkbox"
                                            className="size-4 accent-primary"
                                            checked={filters.statuses.includes(status)}
                                            onChange={() =>
                                                onChange({
                                                    ...filters,
                                                    statuses: toggle(filters.statuses, status),
                                                })
                                            }
                                        />

                                        <ServiceStatusBadge status={status} size="compact" />
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <fieldset className="rounded-xl border border-border/60 bg-card/30 p-3.5">
                        <legend className={legendClass}>Última atualização</legend>

                        <div className="grid gap-3">
                            <label className="grid gap-1 text-sm text-muted-foreground">
                                De
                                <input
                                    type="date"
                                    className={fieldClass}
                                    value={filters.from}
                                    max={fromMax}
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
                                    max={today}
                                    onChange={(e) => onChange({ ...filters, to: e.target.value })}
                                />
                            </label>
                        </div>
                    </fieldset>

                    <button
                        type="button"
                        className={`${SECONDARY_ACTION_BUTTON_CLASS_NAME} min-h-11 w-full px-4 py-2 text-sm`}
                        onClick={onClear}
                        disabled={activeCount === 0}
                    >
                        Limpar filtros
                    </button>

                    <fieldset className="rounded-xl border border-border/60 bg-card/30 p-3.5">
                        <legend className={legendClass}>Gráfico de histórico</legend>

                        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-foreground">
                            <input
                                type="checkbox"
                                className="size-4 accent-primary"
                                checked={chart.enabled}
                                onChange={(e) =>
                                    onChartChange({
                                        ...chart,
                                        enabled: e.target.checked,
                                    })
                                }
                            />
                            Incluir no relatório
                        </label>

                        <AnimatedContent
                            animationKey={chart.enabled ? 'chart-enabled' : 'chart-disabled'}
                            className="mt-3 print:!h-auto print:!overflow-visible"
                        >
                            {chart.enabled && (
                                <div className="grid gap-3">
                                    <SegmentedControl
                                        label="Tipo de gráfico"
                                        value={chart.type}
                                        options={CHART_TYPES}
                                        className="!flex !w-full !justify-stretch"
                                        buttonClassName="!flex-1"
                                        onChange={(type) => onChartChange({ ...chart, type })}
                                    />

                                    <label className="grid gap-1 text-sm text-muted-foreground">
                                        Período
                                        <DropdownSelect
                                            value={chart.range}
                                            options={HISTORY_RANGES.map((range) => ({
                                                value: range,
                                                label: RANGE_LABEL[range],
                                            }))}
                                            disabled={Boolean(filters.from)}
                                            ariaLabel="Período do gráfico de histórico"
                                            onChange={(range) =>
                                                onChartChange({
                                                    ...chart,
                                                    range: range as HistoryRange,
                                                })
                                            }
                                        />
                                        {rangeHint && <span className="text-xs">{rangeHint}</span>}
                                    </label>
                                </div>
                            )}
                        </AnimatedContent>
                    </fieldset>
                </div>
            </ChartCard>
        </aside>
    );
}
