import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

import { SegmentedControl } from '@/components/shared/SegmentedControl';
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
    // Regiões disponíveis para o filtro do widget.
    regionCodes: readonly string[];
    // Entrega os dados para a pré-visualização, conforme a métrica e o filtro do formulário.
    getSource: PainelSourceGetter;
    // Recebe o widget com as alterações quando o usuário aplica.
    onApply: (widget: PainelWidget) => void;
    onClose: () => void;
}

// Tipos de gráfico que cada tipo de widget sabe desenhar. O primeiro é o padrão.
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

const FIELD_LABEL = 'block text-sm font-medium';
const FIELD_INPUT =
    'mt-1.5 min-h-11 w-full rounded-lg border border-border bg-background/60 px-3 text-sm outline-none focus:border-emerald-400/60';

// Painel lateral de configuração de um widget, aberto pelo menu do próprio widget.
export function PainelWidgetSettings({
    widget,
    regionCodes,
    getSource,
    onApply,
    onClose,
}: PainelWidgetSettingsProps) {
    // Cópia do widget que o formulário altera. O painel só muda ao aplicar.
    const [form, setForm] = useState<PainelWidget>(widget);

    const title = form.title.trim();

    const chartOptions = CHART_OPTIONS[widget.type];
    const metrics = getMetricsForType(widget.type);
    const metricId = getWidgetMetricId(form);

    function changeMetric(nextId: string) {
        const previous = PAINEL_METRICS.find((metric) => metric.id === metricId);
        const next = PAINEL_METRICS.find((metric) => metric.id === nextId);

        setForm({
            ...form,
            metric: nextId,
            // Se o título ainda é o nome da métrica anterior, acompanha a troca.
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="painel-configuracao-titulo"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
                className="flex h-full w-full max-w-md flex-col border-l border-border bg-popover shadow-2xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-border p-4">
                    <div className="min-w-0 space-y-1">
                        <p className="text-xs font-medium tracking-wide text-primary uppercase">
                            {PAINEL_WIDGET_TYPE_LABELS[widget.type]}
                        </p>
                        <h2 id="painel-configuracao-titulo" className="text-lg font-semibold">
                            Configurar widget
                        </h2>
                        <p className="truncate text-sm text-muted-foreground">{widget.title}</p>
                    </div>

                    <button
                        type="button"
                        aria-label="Fechar configurações"
                        onClick={onClose}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                        <X aria-hidden="true" className="size-4" />
                    </button>
                </header>

                <div className="flex-1 space-y-5 overflow-y-auto p-4">
                    <section aria-label="Pré-visualização" className="space-y-1.5">
                        <p className={FIELD_LABEL}>Pré-visualização</p>
                        {/* Mostra o widget com as opções do formulário, antes de aplicar. */}
                        <div className={widget.type === 'kpi' ? 'h-40' : 'h-72'}>
                            <PainelWidgetView
                                widget={{ ...form, title: title || 'Sem título' }}
                                source={getSource(form)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            O painel só muda quando você clicar em Aplicar.
                        </p>
                    </section>

                    <label className={FIELD_LABEL}>
                        Título
                        <input
                            type="text"
                            value={form.title}
                            maxLength={60}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            className={FIELD_INPUT}
                        />
                        {!title && (
                            <span className="mt-1.5 block text-xs font-normal text-destructive">
                                Informe um título para o widget.
                            </span>
                        )}
                    </label>

                    <label className={FIELD_LABEL}>
                        Métrica
                        <select
                            value={metricId}
                            disabled={metrics.length < 2}
                            onChange={(event) => changeMetric(event.target.value)}
                            className={`${FIELD_INPUT} disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                            {metrics.map((metric) => (
                                <option key={metric.id} value={metric.id} className="bg-popover">
                                    {metric.label}
                                </option>
                            ))}
                        </select>
                        <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
                            {metrics.length < 2
                                ? 'Este tipo de widget tem uma única métrica.'
                                : 'O que o widget mostra. As opções dependem do tipo do widget.'}
                        </span>
                    </label>

                    {chartOptions && (
                        <div className="space-y-1.5">
                            <p className={FIELD_LABEL}>Tipo de gráfico</p>
                            <SegmentedControl
                                label="Tipo de gráfico"
                                value={form.chart ?? chartOptions[0].value}
                                options={chartOptions}
                                onChange={(chart) => setForm({ ...form, chart })}
                            />
                        </div>
                    )}

                    <fieldset className="space-y-1.5">
                        <legend className={FIELD_LABEL}>Paleta de cores</legend>
                        <div className="grid grid-cols-2 gap-2">
                            {PAINEL_PALETTES.map((palette) => {
                                const selected =
                                    (form.palette ?? PAINEL_PALETTES[0].id) === palette.id;

                                return (
                                    <label
                                        key={palette.id}
                                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                                            selected
                                                ? 'border-emerald-400/60 bg-emerald-400/10'
                                                : 'border-border hover:bg-white/5'
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
                                        {palette.label}
                                        <span aria-hidden="true" className="flex gap-0.5">
                                            {palette.colors.map((color) => (
                                                <span
                                                    key={color}
                                                    className="size-3 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Todas as paletas usam tons claros, legíveis no tema escuro.
                        </p>
                    </fieldset>

                    <label className={FIELD_LABEL}>
                        Filtrar por região
                        <select
                            value={form.region ?? ''}
                            onChange={(event) =>
                                setForm({ ...form, region: event.target.value || undefined })
                            }
                            className={FIELD_INPUT}
                        >
                            <option value="" className="bg-popover">
                                Todas as regiões
                            </option>
                            {regionCodes.map((code) => (
                                <option key={code} value={code} className="bg-popover">
                                    {code}
                                </option>
                            ))}
                        </select>
                    </label>

                    {widget.type === 'kpi' && (
                        <fieldset className="space-y-2">
                            <legend className={FIELD_LABEL}>Limite de alerta</legend>

                            <label className="flex items-center gap-2 text-sm">
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
                                    className="size-4 accent-emerald-400"
                                />
                                Destacar o indicador quando o valor passar do limite
                            </label>

                            {form.alert && (
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="text-xs text-muted-foreground">
                                        Quando o valor estiver
                                        <select
                                            value={form.alert.direction}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    alert: {
                                                        direction: event.target.value as
                                                            'acima' | 'abaixo',
                                                        threshold: form.alert?.threshold ?? 0,
                                                    },
                                                })
                                            }
                                            className={`${FIELD_INPUT} text-foreground`}
                                        >
                                            <option value="acima" className="bg-popover">
                                                Acima de
                                            </option>
                                            <option value="abaixo" className="bg-popover">
                                                Abaixo de
                                            </option>
                                        </select>
                                    </label>

                                    <label className="text-xs text-muted-foreground">
                                        Limite
                                        <input
                                            type="number"
                                            step="any"
                                            value={form.alert.threshold}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    alert: {
                                                        direction: form.alert?.direction ?? 'acima',
                                                        threshold: Number(event.target.value) || 0,
                                                    },
                                                })
                                            }
                                            className={`${FIELD_INPUT} text-foreground`}
                                        />
                                    </label>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                O limite usa a unidade exibida no widget. Ao passar dele, o valor e
                                a borda ficam em vermelho.
                            </p>
                        </fieldset>
                    )}
                </div>

                <footer className="flex flex-wrap justify-end gap-2 border-t border-border p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-11 items-center rounded-lg border border-border bg-background/60 px-4 text-sm font-medium transition-colors hover:bg-white/5"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!title}
                        className="inline-flex min-h-11 items-center rounded-lg border border-emerald-400/45 bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Aplicar
                    </button>
                </footer>
            </form>
        </div>
    );
}
