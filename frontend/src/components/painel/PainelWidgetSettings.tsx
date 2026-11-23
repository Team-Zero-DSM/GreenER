
import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { DropdownSelect } from '@/components/shared/DropdownSelect';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import type {
    PainelChartType,
    PainelSourceGetter,
    PainelWidget,
    PainelWidgetType,
} from '@/types/painel';

import { PAINEL_WIDGET_TYPE_LABELS } from './painelLayoutPadrao';
import { PAINEL_PALETTES } from './painelPaletas';
import { PainelWidgetView } from './PainelWidgetView';
import { getMetricsForType, getWidgetMetricId, PAINEL_METRICS } from './painelMetricas';

interface PainelWidgetSettingsProps {
    widget: PainelWidget;
    regionCodes: readonly string[];
    getSource: PainelSourceGetter;
    onApply: (widget: PainelWidget) => void;
    onClose: () => void;
}

const CHART_OPTIONS: Partial<
    Record<PainelWidgetType, readonly { value: PainelChartType; label: string }[]>
> = {
    'serie-temporal': [
        { value: 'linha', label: 'Linha' },
        { value: 'area', label: 'Área' },
        { value: 'barras', label: 'Barras' },
    ],
    distribuicao: [
        { value: 'rosca', label: 'Rosca' },
        { value: 'pizza', label: 'Pizza' },
        { value: 'barras-horizontais', label: 'Barras horizontais' },
    ],
};

const FIELD_LABEL = 'block text-sm font-medium text-foreground';

// Painel lateral de configuração de um widget.
export function PainelWidgetSettings({
    widget,
    regionCodes,
    getSource,
    onApply,
    onClose,
}: PainelWidgetSettingsProps) {
    const [form, setForm] = useState<PainelWidget>(widget);

    const title = form.title.trim();

    const chartOptions = CHART_OPTIONS[widget.type];
    const metrics = getMetricsForType(widget.type);
    const metricId = getWidgetMetricId(form);
    const selectedMetric = PAINEL_METRICS.find((metric) => metric.id === metricId);

    function changeMetric(nextId: string) {
        const previous = PAINEL_METRICS.find((metric) => metric.id === metricId);
        const next = PAINEL_METRICS.find((metric) => metric.id === nextId);

        setForm({
            ...form,
            metric: nextId,
            title: next && form.title === previous?.label ? next.label : form.title,
        });
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (title) {
            onApply({ ...form, title });
        }
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="painel-configuracao-titulo"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
                className="flex h-full w-full max-w-md flex-col border-l border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl"
            >
                {/* Cabeçalho */}
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/70 bg-card/25 p-5">
                    <div className="min-w-0 space-y-2">
                        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                            {PAINEL_WIDGET_TYPE_LABELS[widget.type]}
                        </span>

                        <div className="space-y-1">
                            <h2
                                id="painel-configuracao-titulo"
                                className="text-lg font-semibold"
                            >
                                Configurar widget
                            </h2>

                            <p className="truncate text-sm text-muted-foreground">
                                {widget.title}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Fechar configurações"
                        onClick={onClose}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <X aria-hidden="true" className="size-4" />
                    </button>
                </header>

                {/* Conteúdo */}
                <div className="flex-1 space-y-6 overflow-y-auto p-5">
                    {/* Pré-visualização */}
                    <section aria-label="Pré-visualização" className="space-y-2">
                        <p className={FIELD_LABEL}>Pré-visualização</p>

                        <div className={widget.type === 'kpi' ? 'h-40' : 'h-64'}>
                            <PainelWidgetView
                                widget={{ ...form, title: title || 'Sem título' }}
                                source={getSource(form)}
                            />
                        </div>
                    </section>

                    {/* Título */}
                    <section className="space-y-2">
                        <FloatingLabelInput
                            label="Título"
                            type="text"
                            value={form.title}
                            maxLength={60}
                            onChange={(value) => setForm({ ...form, title: value })}
                        />

                        {!title && (
                            <span className="block text-xs text-destructive">
                                Informe um título para o widget.
                            </span>
                        )}
                    </section>

                    {/* Métrica */}
                    {metrics.length > 1 ? (
                        <label className={FIELD_LABEL}>
                            Métrica

                            <DropdownSelect
                                value={metricId}
                                onChange={changeMetric}
                                className="mt-2"
                                options={metrics.map((metric) => ({
                                    value: metric.id,
                                    label: metric.label,
                                }))}
                            />
                        </label>
                    ) : (
                        <div className="space-y-2">
                            <p className={FIELD_LABEL}>Métrica</p>

                            <div className="flex min-h-12 items-center rounded-xl border border-border/60 bg-card/40 px-3 text-sm text-muted-foreground">
                                {selectedMetric?.label ?? metrics[0]?.label ?? 'Não definida'}
                            </div>
                        </div>
                    )}

                    {/* Tipo de gráfico */}
                    {chartOptions && (
                        <section className="space-y-2">
                            <p className={FIELD_LABEL}>Tipo de gráfico</p>

                            <SegmentedControl
                                label="Tipo de gráfico"
                                value={form.chart ?? chartOptions[0].value}
                                options={chartOptions}
                                onChange={(chart) => setForm({ ...form, chart })}
                            />
                        </section>
                    )}

                    {/* Cores do gráfico */}
                    <fieldset className="space-y-3">
                        <legend className={FIELD_LABEL}>Cores do gráfico</legend>

                        <div className="grid grid-cols-2 gap-2">
                            {PAINEL_PALETTES.map((palette) => {
                                const selected =
                                    (form.palette ?? PAINEL_PALETTES[0].id) === palette.id;

                                return (
                                    <label
                                        key={palette.id}
                                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                                            selected
                                                ? 'border-primary/50 bg-primary/10 text-foreground ring-1 ring-primary/15'
                                                : 'border-border/70 bg-card/35 text-muted-foreground hover:border-primary/30 hover:bg-accent/40 hover:text-foreground'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="painel-paleta"
                                            value={palette.id}
                                            checked={selected}
                                            onChange={() =>
                                                setForm({ ...form, palette: palette.id })
                                            }
                                            className="sr-only"
                                        />

                                        <span>{palette.label}</span>

                                        <span aria-hidden="true" className="flex gap-1">
                                            {palette.colors.map((color) => (
                                                <span
                                                    key={color}
                                                    className="size-2.5 rounded-full ring-1 ring-foreground/10"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Região */}
                    <label className={FIELD_LABEL}>
                        Filtrar por região

                        <DropdownSelect
                            value={form.region ?? ''}
                            onChange={(value) =>
                                setForm({ ...form, region: value || undefined })
                            }
                            className="mt-2"
                            options={[
                                { value: '', label: 'Todas as regiões' },
                                ...regionCodes.map((code) => ({
                                    value: code,
                                    label: code,
                                })),
                            ]}
                        />
                    </label>

                    {/* Configuração de alerta */}
                    {widget.type === 'kpi' && (
                        <fieldset className="space-y-4 rounded-xl border border-border/60 bg-card/30 p-4">
                            <legend className="px-1 text-sm font-semibold text-foreground">
                                Limite de alerta
                            </legend>

                            <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    checked={form.alert !== undefined}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            alert: event.target.checked
                                                ? { direction: 'acima', threshold: 0 }
                                                : undefined,
                                        })
                                    }
                                    className="mt-0.5 size-4 shrink-0 accent-primary"
                                />

                                <span>
                                    Destacar o indicador quando o valor passar do limite
                                </span>
                            </label>

                            {form.alert && (
                                <div className="grid grid-cols-2 items-end gap-3">
                                    <div className="min-w-0">
                                        <label
                                            htmlFor="widget-alert-direction"
                                            className="mb-2 block text-xs font-medium text-muted-foreground"
                                        >
                                            Condição
                                        </label>

                                        <DropdownSelect
                                            ariaLabel="Condição do alerta"
                                            value={form.alert.direction}
                                            onChange={(value) =>
                                                setForm({
                                                    ...form,
                                                    alert: {
                                                        direction: value as 'acima' | 'abaixo',
                                                        threshold: form.alert?.threshold ?? 0,
                                                    },
                                                })
                                            }
                                            options={[
                                                { value: 'acima', label: 'Acima de' },
                                                { value: 'abaixo', label: 'Abaixo de' },
                                            ]}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <label
                                            htmlFor="widget-alert-threshold"
                                            className="mb-2 block text-xs font-medium text-muted-foreground"
                                        >
                                            Limite
                                        </label>

                                        <input
                                            id="widget-alert-threshold"
                                            type="number"
                                            inputMode="decimal"
                                            step="any"
                                            value={String(form.alert.threshold)}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    alert: {
                                                        direction: form.alert?.direction ?? 'acima',
                                                        threshold: Number(event.target.value) || 0,
                                                    },
                                                })
                                            }
                                            className="flex min-h-12 w-full rounded-xl border border-border/60 bg-card/55 px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/30 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/15"
                                        />
                                    </div>
                                </div>
                            )}
                        </fieldset>
                    )}
                </div>

                {/* Ações */}
                <footer className="flex shrink-0 justify-end gap-2 border-t border-border/70 bg-card/25 p-4 sm:p-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background/60 px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={!title}
                        className="inline-flex min-h-11 items-center rounded-xl border border-primary/30 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Aplicar
                    </button>
                </footer>
            </form>
        </div>
    );
}
