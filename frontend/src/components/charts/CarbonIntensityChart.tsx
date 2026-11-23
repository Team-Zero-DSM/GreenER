import type { Region } from '@/types/api';
import { formatIntensity } from '@/utils/format';

interface CarbonIntensityChartProps {
    regions: Region[];
}

const BAR_COLORS = [
    '#60A5FA',
    '#34D399',
    '#22D3EE',
    '#A78BFA',
    '#F472B6',
    '#818CF8',
    '#2DD4BF',
    '#93C5FD',
    '#6EE7B7',
    '#C4B5FD',
    '#38BDF8',
    '#FB7185',
];

function regionName(region: Region): string {
    return region.city ?? region.region ?? region.code;
}

export function CarbonIntensityChart({ regions }: CarbonIntensityChartProps) {
    const rows = regions
        .filter(
            (region): region is Region & { gco2ePerKwh: number } =>
                region.gco2ePerKwh != null && Number.isFinite(region.gco2ePerKwh),
        )
        .toSorted((a, b) => b.gco2ePerKwh - a.gco2ePerKwh);

    if (rows.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">Sem dados de intensidade de carbono.</p>
        );
    }

    const maxValue = Math.max(...rows.map((region) => region.gco2ePerKwh));

    return (
        <ol
            className="mt-5 space-y-3.5 sm:space-y-4"
            role="list"
            aria-label="Intensidade de carbono por região"
        >
            {rows.map((region, index) => {
                const value = region.gco2ePerKwh;
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const color = BAR_COLORS[index % BAR_COLORS.length];

                return (
                    <li
                        key={region.code}
                        className="group rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-muted/20 sm:px-4"
                    >
                        <div className="flex min-w-0 items-center justify-between gap-3">
                            <span className="flex min-w-0 items-center gap-2.5">
                                <span
                                    aria-hidden="true"
                                    className="size-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <span
                                    className="truncate text-sm font-medium text-foreground"
                                    title={regionName(region)}
                                >
                                    {regionName(region)}
                                </span>
                            </span>

                            <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums text-foreground">
                                {formatIntensity(value)}
                            </span>
                        </div>

                        <div
                            className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary/80"
                            role="meter"
                            aria-label={`Intensidade de carbono de ${regionName(region)}`}
                            aria-valuemin={0}
                            aria-valuemax={maxValue}
                            aria-valuenow={value}
                        >
                            <div
                                className="h-full rounded-full transition-[width] duration-500 ease-out group-hover:brightness-110"
                                style={{ width: `${percentage}%`, backgroundColor: color }}
                            />
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
