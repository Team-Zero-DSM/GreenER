import type { Region } from '@/types/api';
import { formatIntensity } from '@/utils/format';

interface CarbonIntensityChartProps {
    regions: Region[];
}

const BAR_COLORS = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#f97316'];

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
        <div
            className="mb-2 mt-4 space-y-4"
            role="list"
            aria-label="Intensidade de carbono por região"
        >
            {rows.map((region, index) => {
                const value = region.gco2ePerKwh;
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                return (
                    <div
                        key={region.code}
                        role="listitem"
                        className="grid grid-cols-[minmax(4rem,5rem)_minmax(0,1fr)_minmax(5.5rem,auto)] items-center gap-3"
                    >
                        <span
                            className="truncate text-sm text-muted-foreground pl-0 ml-0"
                            title={regionName(region)}
                        >
                            {regionName(region)}
                        </span>
                        <div
                            className="h-3 overflow-hidden rounded-full bg-secondary"
                            role="meter"
                            aria-label={`Intensidade de carbono de ${regionName(region)}`}
                            aria-valuemin={0}
                            aria-valuemax={maxValue}
                            aria-valuenow={value}
                        >
                            <div
                                className="h-full rounded-full transition-[width] duration-500"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                                }}
                            />
                        </div>
                        <span className="text-right text-xs tabular-nums text-muted-foreground sm:text-sm">
                            {formatIntensity(value)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
