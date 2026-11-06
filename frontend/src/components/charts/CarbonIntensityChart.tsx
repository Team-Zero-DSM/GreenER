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
            className="mb-2 mt-4 space-y-4 lg:space-y-6"
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
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 sm:grid-cols-[minmax(5rem,6rem)_minmax(0,1fr)_minmax(8rem,auto)] sm:gap-y-0 lg:gap-x-2"
                    >
                        <span
                            className="col-start-1 row-start-1 min-w-0 truncate text-md font-medium text-foreground sm:font-normal sm:text-muted-foreground"
                            title={regionName(region)}
                        >
                            {regionName(region)}
                        </span>
                        <div
                            className="col-span-2 col-start-1 row-start-2 h-2.5 overflow-hidden rounded-full bg-secondary/80 ring-1 ring-white/5 sm:col-span-1 sm:col-start-2 sm:row-start-1"
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
                                    boxShadow: `0 0 12px ${BAR_COLORS[index % BAR_COLORS.length]}66`,
                                }}
                            />
                        </div>
                        <span className="col-start-2 row-start-1 whitespace-nowrap text-right text-xs font-medium tabular-nums text-muted-foreground sm:col-start-3 sm:text-sm">
                            {formatIntensity(value)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
