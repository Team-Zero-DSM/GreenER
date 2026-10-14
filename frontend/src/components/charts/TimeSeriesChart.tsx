import { useId } from 'react';
import { formatTime } from '@/lib/format';

export interface TimeSeriesPoint {
    time: string;
    value: number;
}

interface TimeSeriesChartProps {
    data: TimeSeriesPoint[];
    label: string;
    color: string;
    formatValue: (value: number) => string;
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD = { top: 12, right: 12, bottom: 32, left: 96 };
const INNER_WIDTH = WIDTH - PAD.left - PAD.right;
const INNER_HEIGHT = HEIGHT - PAD.top - PAD.bottom;

export function TimeSeriesChart({ data, label, color, formatValue }: TimeSeriesChartProps) {
    const gradientId = `grad-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

    if (data.length < 2) {
        return <p className="text-sm text-muted-foreground">Sem dados no período.</p>;
    }

    const values = data.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const margin = (max - min || 1) * 0.1;
    const low = min - margin;
    const high = max + margin;

    const x = (index: number) => PAD.left + (index / (data.length - 1)) * INNER_WIDTH;
    const y = (value: number) => PAD.top + (1 - (value - low) / (high - low)) * INNER_HEIGHT;

    const line = data.map((point, index) => `${x(index)},${y(point.value)}`).join(' ');
    const bottom = PAD.top + INNER_HEIGHT;
    const area = `${x(0)},${bottom} ${line} ${x(data.length - 1)},${bottom}`;

    const yTicks = [low, (low + high) / 2, high];
    const xTicks = [0, Math.floor((data.length - 1) / 2), data.length - 1];

    return (
        <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={label}
            className="h-auto w-full"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.35 }} />
                    <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                </linearGradient>
            </defs>

            {yTicks.map((tick) => (
                <g key={tick}>
                    <line
                        x1={PAD.left}
                        x2={WIDTH - PAD.right}
                        y1={y(tick)}
                        y2={y(tick)}
                        className="stroke-white/10"
                    />
                    <text
                        x={PAD.left - 8}
                        y={y(tick)}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-[18px]"
                    >
                        {formatValue(tick)}
                    </text>
                </g>
            ))}

            {xTicks.map((index) => (
                <text
                    key={index}
                    x={x(index)}
                    y={HEIGHT - 6}
                    textAnchor={
                        index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'
                    }
                    className="fill-muted-foreground text-[18px]"
                >
                    {formatTime(data[index].time)}
                </text>
            ))}

            <polygon points={area} style={{ fill: `url(#${gradientId})` }} />
            <polyline
                points={line}
                fill="none"
                strokeWidth={2}
                strokeLinejoin="round"
                style={{ stroke: color }}
            />
            {data.map((point, index) => (
                <circle
                    key={point.time}
                    cx={x(index)}
                    cy={y(point.value)}
                    r={3}
                    style={{ fill: color }}
                >
                    <title>{`${formatTime(point.time)}: ${formatValue(point.value)}`}</title>
                </circle>
            ))}
        </svg>
    );
}