import type { Region } from '@/types/api';
import { formatCo2e, formatEnergy, formatIntensity } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RegionCardProps {
    region: Region;
}

function regionTitle(region: Region): string {
    return region.city ?? region.region ?? region.code;
}

function RegionMetric({
    label,
    value,
    align = 'left',
}: {
    label: string;
    value: string;
    align?: 'left' | 'right';
}) {
    return (
        <div className={align === 'right' ? 'text-right' : undefined}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold tabular-nums">{value}</p>
        </div>
    );
}

export function RegionCard({ region }: RegionCardProps) {
    const renewableShare =
        region.renewableSharePercent == null
            ? '—'
            : `${region.renewableSharePercent.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;

    return (
        <Card className="h-full bg-white/5 text-left text-white ring-white/10 transition-colors hover:bg-white/10">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg">{regionTitle(region)}</CardTitle>
                <p className="flex flex-wrap gap-x-1 text-sm text-white/60">
                    <span>{region.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{[region.region, region.country].filter(Boolean).join(', ')}</span>
                </p>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4">
                <RegionMetric label="Intensidade" value={formatIntensity(region.gco2ePerKwh)} />
                <RegionMetric label="Renováveis" value={renewableShare} align="right" />
                <div>
                    <RegionMetric label="Serviços" value={String(region.servicesCount)} />
                    {region.statusCounts.metricsMissing > 0 && (
                        <p className="mt-1 text-xs text-amber-300">
                            {region.statusCounts.metricsMissing} sem métricas
                        </p>
                    )}
                </div>
                <RegionMetric label="Energia no período" value={formatEnergy(region.energyKwh)} align="right" />
                <RegionMetric label="CO₂e no período" value={formatCo2e(region.co2eGrams)} />
            </CardContent>
        </Card>
    );
}
