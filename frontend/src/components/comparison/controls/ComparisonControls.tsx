import { useRef, useState } from 'react';
import { ArrowLeftRight, ChartNoAxesColumnIncreasing, Check, ChevronDown } from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutside';
import type { HistoryRange } from '@/types/service';

export type ComparisonMetric = 'co2eGrams' | 'energyKwh';

interface ComparisonControlsProps {
    periodo: HistoryRange;
    metrica: ComparisonMetric;
    podeComparar: boolean;
    onPeriodoChange: (periodo: HistoryRange) => void;
    onMetricaChange: (metrica: ComparisonMetric) => void;
    onComparar: () => void;
}

const PERIODOS: { valor: HistoryRange; label: string }[] = [
    { valor: '1h', label: '1h' },
    { valor: '6h', label: '6h' },
    { valor: '24h', label: '1d' },
    { valor: '7d', label: '7d' },
    { valor: '30d', label: '30d' },
];

const METRICAS: { valor: ComparisonMetric; label: string }[] = [
    { valor: 'co2eGrams', label: 'Emissões (CO₂ equivalente)' },
    { valor: 'energyKwh', label: 'Energia (kWh)' },
];

export function ComparisonControls({
    periodo,
    metrica,
    onPeriodoChange,
    onMetricaChange,
    onComparar,
    podeComparar,
}: ComparisonControlsProps) {
    const [mostrarMetricas, setMostrarMetricas] = useState(false);

    const botaoMetricaRef = useRef<HTMLButtonElement>(null);
    const listaMetricasRef = useRef<HTMLDivElement>(null);

    useClickOutside(mostrarMetricas, botaoMetricaRef, listaMetricasRef, setMostrarMetricas);

    const metricaSelecionada = METRICAS.find((item) => item.valor === metrica);

    return (
        <div className="flex flex-col gap-5 border-t border-slate-800 pt-6 xl:flex-row xl:items-end xl:justify-between">
            {/* Período */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-300">Período</h3>

                <div className="flex flex-wrap gap-2">
                    {PERIODOS.map((item) => {
                        const selecionado = periodo === item.valor;

                        return (
                            <button
                                key={item.valor}
                                type="button"
                                aria-pressed={selecionado}
                                onClick={() => onPeriodoChange(item.valor)}
                                className={`min-h-10 min-w-16 rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                    selecionado
                                        ? 'border-teal-300 bg-teal-400 text-slate-950'
                                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-teal-400/60 hover:bg-slate-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Métrica e comparação */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="min-w-0 space-y-2 sm:w-72">
                    <label
                        id="comparison-metric-label"
                        className="block text-sm font-semibold text-slate-300"
                    >
                        Métrica
                    </label>

                    <div className="relative">
                        <button
                            ref={botaoMetricaRef}
                            type="button"
                            aria-labelledby="comparison-metric-label"
                            aria-haspopup="listbox"
                            aria-expanded={mostrarMetricas}
                            aria-controls="comparison-metric-listbox"
                            onClick={() => setMostrarMetricas((aberto) => !aberto)}
                            className={`flex min-h-11 w-full items-center gap-3 rounded-xl border bg-slate-950 px-3 py-2 text-left text-sm text-slate-100 transition-colors duration-200 ${
                                mostrarMetricas
                                    ? 'border-teal-400 ring-1 ring-teal-400/30'
                                    : 'border-slate-700 hover:border-teal-400/60'
                            }`}
                        >
                            <ChartNoAxesColumnIncreasing
                                aria-hidden="true"
                                className="size-5 shrink-0 text-teal-300"
                            />

                            <span className="min-w-0 flex-1 truncate">
                                {metricaSelecionada?.label ?? 'Selecione uma métrica'}
                            </span>

                            <ChevronDown
                                aria-hidden="true"
                                className={`size-4 shrink-0 text-slate-300 transition-transform duration-200 ${
                                    mostrarMetricas ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Menu personalizado */}
                        <div
                            ref={listaMetricasRef}
                            id="comparison-metric-listbox"
                            role="listbox"
                            aria-labelledby="comparison-metric-label"
                            aria-hidden={!mostrarMetricas}
                            className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-xl border border-teal-500/30 bg-slate-950 p-2 shadow-xl shadow-black/30 transition-all duration-200 ease-out ${
                                mostrarMetricas
                                    ? 'visible translate-y-0 scale-100 opacity-100'
                                    : 'invisible -translate-y-1 scale-[0.98] opacity-0'
                            }`}
                        >
                            {METRICAS.map((item) => {
                                const selecionada = metrica === item.valor;

                                return (
                                    <button
                                        key={item.valor}
                                        type="button"
                                        role="option"
                                        aria-selected={selecionada}
                                        tabIndex={mostrarMetricas ? 0 : -1}
                                        onClick={() => {
                                            onMetricaChange(item.valor);
                                            setMostrarMetricas(false);
                                        }}
                                        className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ${
                                            selecionada
                                                ? 'bg-teal-400/10 text-teal-200'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <span className="min-w-0 flex-1">{item.label}</span>

                                        {selecionada && (
                                            <Check
                                                aria-hidden="true"
                                                className="size-4 shrink-0 text-teal-300"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onComparar}
                    disabled={!podeComparar}
                    className={`flex min-h-14 items-center justify-center gap-3 rounded-xl px-7 text-sm font-semibold transition-colors duration-200 ${
                        podeComparar
                            ? 'bg-teal-400 text-slate-950 hover:bg-teal-300 active:bg-teal-500'
                            : 'cursor-not-allowed bg-slate-800 text-slate-500'
                    }`}
                >
                    <ArrowLeftRight aria-hidden="true" className="size-5" />
                    <span>Comparar</span>
                </button>
            </div>
        </div>
    );
}
