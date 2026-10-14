import type { ReactNode } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import { ChartCard } from '@/components/charts/ChartCard';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { ServiceStatusBadge } from '@/components/services/ServiceStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime, formatNumber } from '@/lib/format';
import { buildServiceHistory } from '@/mocks/serviceHistory';
import { findServiceById } from '@/mocks/services';

const chartColors = {
    co2e: '#34d399',
    power: '#fbbf24',
    cpu: '#3987e5',
    memory: '#9085e9',
};

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-lg font-semibold">{value}</dd>
        </div>
    );
}

function BackLink() {
    return (
        <RouterLink to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Serviços
        </RouterLink>
    );
}

export function ServiceDetailPage() {
    const { id } = useParams();
    const service = id ? findServiceById(id) : undefined;

    if (!service) {
        return (
            <main className="mx-auto max-w-7xl space-y-4 p-6">
                <BackLink />
                <h1 className="text-2xl font-semibold">Serviço não encontrado</h1>
                <p className="text-muted-foreground">
                    Não existe serviço com o identificador "{id}".
                </p>
            </main>
        );
    }

    const { location, metrics, environmental } = service;
    const history = buildServiceHistory(service);
    const period = 'Últimas 24 horas';

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <BackLink />

            <header>
                <h1 className="text-3xl font-semibold">{service.name}</h1>
                <p className="text-muted-foreground">
                    <span className="font-mono">{service.id}</span> · {location.city},{' '}
                    {location.region}, {location.country}
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <InfoItem
                            label="Estado"
                            value={<ServiceStatusBadge status={service.status} />}
                        />
                        <InfoItem label="Região" value={location.regionCode} />
                        <InfoItem
                            label="Coordenadas"
                            value={`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                        />
                        <InfoItem
                            label="Visto por último"
                            value={formatDateTime(service.lastSeenAt)}
                        />
                        <InfoItem label="CPU" value={formatNumber(metrics?.cpuPercent, '%')} />
                        <InfoItem label="Memória" value={formatNumber(metrics?.memoryGb, 'GB')} />
                        <InfoItem label="Disco" value={formatNumber(metrics?.diskGb, 'GB')} />
                        <InfoItem label="Rede" value={formatNumber(metrics?.networkGb, 'GB')} />
                        <InfoItem
                            label="Potência estimada"
                            value={formatNumber(environmental?.powerWatts, 'W', 2)}
                        />
                        <InfoItem
                            label="Energia (última coleta)"
                            value={formatNumber(environmental?.energyKwh, 'kWh', 5)}
                        />
                        <InfoItem
                            label="CO₂e (última coleta)"
                            value={formatNumber(environmental?.co2eGrams, 'g', 3)}
                        />
                        <InfoItem
                            label="Intensidade da região"
                            value={formatNumber(environmental?.carbonIntensity, 'gCO₂e/kWh', 0)}
                        />
                        <InfoItem
                            label="Energia renovável"
                            value={formatNumber(environmental?.renewableSharePercent, '%')}
                        />
                    </dl>
                </CardContent>
            </Card>

            {history.length === 0 ? (
                <Card>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Sem métricas no período. Os gráficos aparecem quando o serviço voltar a
                            enviar métricas.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard title="CO₂e por coleta" subtitle={period}>
                        <TimeSeriesChart
                            label="CO₂e por coleta"
                            color={chartColors.co2e}
                            data={history.map((point) => ({
                                time: point.collectedAt,
                                value: point.co2eGrams,
                            }))}
                            formatValue={(value) => formatNumber(value, 'g', 3)}
                        />
                    </ChartCard>
                    <ChartCard title="Potência estimada" subtitle={period}>
                        <TimeSeriesChart
                            label="Potência estimada"
                            color={chartColors.power}
                            data={history.map((point) => ({
                                time: point.collectedAt,
                                value: point.powerWatts,
                            }))}
                            formatValue={(value) => formatNumber(value, 'W')}
                        />
                    </ChartCard>
                    <ChartCard title="Uso de CPU" subtitle={period}>
                        <TimeSeriesChart
                            label="Uso de CPU"
                            color={chartColors.cpu}
                            data={history.map((point) => ({
                                time: point.collectedAt,
                                value: point.cpuPercent,
                            }))}
                            formatValue={(value) => formatNumber(value, '%')}
                        />
                    </ChartCard>
                    <ChartCard title="Memória em uso" subtitle={period}>
                        <TimeSeriesChart
                            label="Memória em uso"
                            color={chartColors.memory}
                            data={history.map((point) => ({
                                time: point.collectedAt,
                                value: point.memoryGb,
                            }))}
                            formatValue={(value) => formatNumber(value, 'GB')}
                        />
                    </ChartCard>
                </div>
            )}
        </main>
    );
}