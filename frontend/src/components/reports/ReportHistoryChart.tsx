import type { ChartType } from '@/types/report';
import type { HistoryRange } from '@/types/service';

interface Point {
    time: number;
    value: number;
}

interface Props {
    points: Point[];
    from: number;
    to: number;
    type: ChartType;
    color: string;
    range: HistoryRange;
    formatAxis: (v: number) => string;
    formatValue: (v: number) => string;
    ariaLabel: string;
}

const W = 640;
const H = 170;
const PAD = { left: 56, right: 12, top: 10, bottom: 24 };

const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
const fullFmt = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

const axisTime = (range: HistoryRange, t: number) =>
    (range === '7d' || range === '30d' ? dayFmt : timeFmt).format(new Date(t));

// Arredonda o topo do eixo para 1, 2, 5 ou 10 vezes uma potência de 10.
function niceMax(v: number) {
    if (v <= 0) return 1;
    const exp = Math.floor(Math.log10(v));
    const f = v / 10 ** exp;
    const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nice * 10 ** exp;
}

const GRID = [0, 0.5, 1];

// SVG simples, sem biblioteca: renderiza igual na tela e no PDF.
export function ReportHistoryChart({
    points,
    from,
    to,
    type,
    color,
    range,
    formatAxis,
    formatValue,
    ariaLabel,
}: Props) {
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const n = points.length;
    const max = niceMax(Math.max(0, ...points.map((p) => p.value)));
    const span = Math.max(to - from, 1);
    const colW = n > 0 ? innerW / n : innerW;
    const baseline = PAD.top + innerH;
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
    const xCenter = (i: number) => PAD.left + colW * i + colW / 2;
    const barW = Math.max(colW * 0.7, 1);

    const line = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${xCenter(i).toFixed(1)},${y(p.value).toFixed(1)}`)
        .join(' ');
    const area =
        n > 0
            ? `${line} L${xCenter(n - 1).toFixed(1)},${baseline} L${xCenter(0).toFixed(1)},${baseline} Z`
            : '';

    return (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full">
            {GRID.map((f) => (
                <g key={f}>
                    <line
                        x1={PAD.left}
                        x2={W - PAD.right}
                        y1={y(max * f)}
                        y2={y(max * f)}
                        stroke="#d6dcd8"
                        strokeWidth={1}
                    />
                    <text
                        x={PAD.left - 6}
                        y={y(max * f)}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize={11}
                        fill="#5b6b6e"
                    >
                        {formatAxis(max * f)}
                    </text>
                </g>
            ))}

            {type === 'line' ? (
                <>
                    <path d={area} fill={color} fillOpacity={0.12} />
                    <path
                        d={line}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                </>
            ) : (
                points.map((p, i) => (
                    <rect
                        key={p.time}
                        x={xCenter(i) - barW / 2}
                        y={y(p.value)}
                        width={barW}
                        height={Math.max(baseline - y(p.value), 0)}
                        fill={color}
                        rx={1}
                    />
                ))
            )}

            {GRID.map((f) => (
                <text
                    key={`x-${f}`}
                    x={PAD.left + f * innerW}
                    y={H - 6}
                    textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}
                    fontSize={11}
                    fill="#5b6b6e"
                >
                    {axisTime(range, from + f * span)}
                </text>
            ))}

            {/* Colunas invisíveis: mostram o valor do intervalo ao passar o mouse. */}
            {points.map((p, i) => (
                <rect
                    key={`hit-${p.time}`}
                    x={PAD.left + colW * i}
                    y={PAD.top}
                    width={colW}
                    height={innerH}
                    fill="transparent"
                >
                    <title>{`${fullFmt.format(new Date(p.time))}: ${formatValue(p.value)}`}</title>
                </rect>
            ))}
        </svg>
    );
}
