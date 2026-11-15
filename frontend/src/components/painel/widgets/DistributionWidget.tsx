import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { PainelChartType, PainelDistributionData } from '@/types/painel';

import { PAINEL_CHART_COLORS } from '../painelLayoutPadrao';

interface DistributionWidgetProps {
    data: PainelDistributionData;
    chart: PainelChartType;
}

const formatValue = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

export function DistributionWidget({ data, chart }: DistributionWidgetProps) {
    const total = data.items.reduce((sum, item) => sum + item.value, 0);
    const largest = Math.max(...data.items.map((item) => item.value));
    const items = data.items.map((item, index) => ({
        ...item,
        color: PAINEL_CHART_COLORS[index % PAINEL_CHART_COLORS.length],
        share: total > 0 ? (item.value / total) * 100 : 0,
    }));

    if (chart === 'barras-horizontais') {
        return (
            <ul className="flex flex-1 flex-col justify-center gap-3">
                {items.map((item) => (
                    <li key={item.label} className="space-y-1">
                        <div className="flex items-baseline justify-between gap-2 text-xs">
                            <span className="truncate">{item.label}</span>
                            <span className="font-semibold whitespace-nowrap tabular-nums">
                                {formatValue(item.value)} {data.unit}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5">
                            <div
                                className="h-2 rounded-full"
                                style={{
                                    // A maior categoria ocupa a barra inteira; as demais, a proporção dela.
                                    width: `${largest > 0 ? (item.value / largest) * 100 : 0}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 items-center gap-4">
            <div className="relative h-full min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={items}
                            dataKey="value"
                            nameKey="label"
                            // A rosca é a pizza com um furo no meio, onde vai o total.
                            innerRadius={chart === 'rosca' ? '62%' : 0}
                            outerRadius="95%"
                            paddingAngle={chart === 'rosca' ? 2 : 0}
                            stroke="none"
                            isAnimationActive={false}
                        >
                            {items.map((item) => (
                                <Cell key={item.label} fill={item.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [
                                `${formatValue(Number(value))} ${data.unit}`,
                                String(name),
                            ]}
                            contentStyle={{
                                background: 'var(--popover)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {chart === 'rosca' && (
                    <p className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold tabular-nums">{formatValue(total)}</span>
                        <span className="text-xs text-muted-foreground">{data.unit}</span>
                    </p>
                )}
            </div>

            <ul className="flex shrink-0 flex-col gap-1.5 text-xs">
                {items.map((item) => (
                    <li key={item.label} className="flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="ml-auto pl-2 font-semibold tabular-nums">
                            {item.share.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
