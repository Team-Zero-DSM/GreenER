import { useEffect, useState, type ReactNode } from 'react';
import { useMonitoringStatus } from '@/hooks/useMonitoringStatus';
import type { DependencyStatus } from '@/types/monitoring';

const dependencyLabel: Record<DependencyStatus, string> = {
    available: 'no ar',
    unavailable: 'fora do ar',
    unknown: 'sem confirmação',
};

function secondsBetween(from: number, to: number) {
    return Math.max(0, Math.round((to - from) / 1000));
}

function formatAgo(seconds: number) {
    if (seconds < 60) return `há ${seconds} s`;
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
    return `há ${Math.floor(seconds / 3600)} h`;
}

function Item({ label, children }: { label: string; children: ReactNode }) {
    return (
        <span>
            {label}: <strong className="font-semibold text-foreground">{children}</strong>
        </span>
    );
}

export function MonitoringBar() {
    const { status, nextCollectionAt, lastCollectionAt, error } = useMonitoringStatus();
    const [now, setNow] = useState(() => Date.now());

    // Só atualiza os contadores na tela; não consulta a API.
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const remaining = nextCollectionAt === null ? null : secondsBetween(now, nextCollectionAt);
    const nextCollection = status?.running
        ? 'em andamento'
        : remaining === null
          ? 'sem previsão'
          : remaining === 0
            ? 'iniciando'
            : `em ${remaining} s`;
    const connected = status !== null && error === null;

    return (
        <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
            <div className="mx-auto max-w-7xl space-y-2">
                <span
                    title={error ?? undefined}
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-medium ${connected ? 'border-emerald-400/40 text-emerald-300' : 'border-destructive/40 text-destructive'}`}
                >
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                    {connected
                        ? 'Conectado'
                        : status === null && !error
                          ? 'Conectando...'
                          : 'Sem conexão'}
                </span>

                {status && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                        <Item label="Última coleta">
                            {lastCollectionAt === null
                                ? '—'
                                : formatAgo(secondsBetween(lastCollectionAt, now))}
                        </Item>
                        <Item label="Próxima coleta">{nextCollection}</Item>
                        <Item label="Intervalo de coleta">
                            {status.collectionIntervalSeconds} s
                        </Item>
                        <Item label="APIs UniLaunch">
                            Métricas {dependencyLabel[status.dependencies.metricsDiscovery]} ·
                            Carbono {dependencyLabel[status.dependencies.carbon]}
                        </Item>
                    </div>
                )}
            </div>
        </div>
    );
}
