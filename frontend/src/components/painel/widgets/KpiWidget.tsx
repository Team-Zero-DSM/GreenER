import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

import type { PainelKpiData } from '@/types/painel';

interface KpiWidgetProps {
    data: PainelKpiData;
}

export function KpiWidget({ data }: KpiWidgetProps) {
    const { label, value, unit, previousValue, lowerIsBetter, fractionDigits = 1 } = data;

    const formattedValue = value.toLocaleString('pt-BR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });

    // Sem período anterior (ou anterior zerado) não há base para a variação.
    const variation =
        previousValue === null || previousValue === 0
            ? null
            : ((value - previousValue) / Math.abs(previousValue)) * 100;

    const stable = variation !== null && Math.abs(variation) < 0.05;
    const improved = variation !== null && (lowerIsBetter ? variation < 0 : variation > 0);
    const Icon = stable ? Minus : variation !== null && variation < 0 ? ArrowDown : ArrowUp;
    const variationColor = stable
        ? 'text-muted-foreground'
        : improved
          ? 'text-emerald-400'
          : 'text-destructive';

    return (
        <div className="flex flex-1 flex-col justify-end gap-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="text-3xl font-bold tracking-tight tabular-nums">
                    {formattedValue}
                </span>
                <span className="text-sm text-muted-foreground">{unit}</span>
            </p>
            {variation === null ? (
                <p className="text-xs text-muted-foreground">Sem período anterior para comparar</p>
            ) : (
                <p className="flex flex-wrap items-center gap-x-1 text-xs">
                    <span
                        className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${variationColor}`}
                    >
                        <Icon aria-hidden="true" className="size-3.5" />
                        {Math.abs(variation).toLocaleString('pt-BR', {
                            maximumFractionDigits: 1,
                        })}
                        %<span className="sr-only">{variation < 0 ? ' a menos' : ' a mais'}</span>
                    </span>
                    <span className="text-muted-foreground">vs. período anterior</span>
                </p>
            )}
        </div>
    );
}
