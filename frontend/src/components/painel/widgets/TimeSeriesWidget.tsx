import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import type { PainelChartType, PainelSeriesData } from '@/types/painel';

import { PAINEL_CHART_COLORS } from '../painelLayoutPadrao';

interface TimeSeriesWidgetProps {
    data: PainelSeriesData;
    chart: PainelChartType;
}

const formatValue = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

export function TimeSeriesWidget({ data, chart }: TimeSeriesWidgetProps) {
    // O Recharts espera uma linha por ponto, com uma coluna para cada série.
    const rows = data.points.map((point) => ({ label: point.label, ...point.values }));

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {data.series.map((serie, index) => (
                    <li key={serie.key} className="inline-flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{
                                backgroundColor:
                                    PAINEL_CHART_COLORS[index % PAINEL_CHART_COLORS.length],
                            }}
                        />
                        {serie.label}
                    </li>
                ))}
                <li className="ml-auto">{data.unit}</li>
            </ul>

            <div className="min-h-0 flex-1 text-muted-foreground">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                        <CartesianGrid stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: 'currentColor' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                        />
                        <YAxis
                            width={44}
                            tickFormatter={(value) => formatValue(Number(value))}
                            tick={{ fontSize: 11, fill: 'currentColor' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                `${formatValue(Number(value))} ${data.unit}`,
                                String(name),
                            ]}
                            cursor={{ stroke: 'currentColor', strokeOpacity: 0.3 }}
                            contentStyle={{
                                background: 'var(--popover)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            labelStyle={{ color: 'var(--muted-foreground)' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                        />

                        {data.series.map((serie, index) => {
                            const color = PAINEL_CHART_COLORS[index % PAINEL_CHART_COLORS.length];

                            // Área e barras empilham as séries para mostrar o total;
                            // a linha compara as séries lado a lado.
                            if (chart === 'area') {
                                return (
                                    <Area
                                        key={serie.key}
                                        type="monotone"
                                        dataKey={serie.key}
                                        name={serie.label}
                                        stackId="total"
                                        stroke={color}
                                        strokeWidth={2}
                                        fill={color}
                                        fillOpacity={0.35}
                                        isAnimationActive={false}
                                    />
                                );
                            }

                            if (chart === 'barras') {
                                return (
                                    <Bar
                                        key={serie.key}
                                        dataKey={serie.key}
                                        name={serie.label}
                                        stackId="total"
                                        fill={color}
                                        isAnimationActive={false}
                                    />
                                );
                            }

                            return (
                                <Line
                                    key={serie.key}
                                    type="monotone"
                                    dataKey={serie.key}
                                    name={serie.label}
                                    stroke={color}
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            );
                        })}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
