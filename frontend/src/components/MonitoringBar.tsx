import { useEffect, useState } from 'react';
import { useMonitoringStatus } from '@/hooks/useMonitoringStatus';
import { formatDateTime } from '@/lib/format';
import type { DependencyStatus } from '@/types/monitoring';

const dependencyLabel: Record<DependencyStatus, string> = {
    available: 'disponível',
    unavailable: 'indisponível',
    unknown: 'sem confirmação',
};

export function MonitoringBar() {
    const { status, nextCollectionAt, error } = useMonitoringStatus();
    const [now, setNow] = useState(() => Date.now());

    // Só atualiza o contador na tela; não consulta a API.
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const remaining =
        nextCollectionAt === null ? null : Math.max(0, Math.ceil((nextCollectionAt - now) / 1000));
    const nextCollection = status?.running
        ? 'em andamento'
        : remaining === null
          ? 'sem previsão'
          : remaining === 0
            ? 'iniciando'
            : `em ${remaining} s`;

    return (
        <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-x-4 gap-y-1">
                {error ? (
                    <strong className="text-destructive">Sem conexão com a API · {error}</strong>
                ) : (
                    <strong className="text-emerald-300">
                        {status ? 'Conectado à API' : 'Conectando à API...'}
                    </strong>
                )}

                {status && (
                    <>
                        <span>Próxima coleta: {nextCollection}</span>
                        <span>
                            Última coleta: {formatDateTime(status.lastSuccessfulCollectionAt)}
                        </span>
                        <span>Intervalo: {status.collectionIntervalSeconds} s</span>
                        <span>
                            Métricas: {dependencyLabel[status.dependencies.metricsDiscovery]} ·
                            Carbono: {dependencyLabel[status.dependencies.carbon]}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
