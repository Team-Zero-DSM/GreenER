import { useEffect, useState, type ReactNode } from 'react';

import { Clock3 } from 'lucide-react';

import { useMonitoring } from '@/contexts/monitoring';
import { formatDateTimeSeconds } from '@/lib/format';
import type { DependencyStatus } from '@/types/monitoring';

const dependencyLabel: Record<DependencyStatus, string> = {
    available: 'no ar',
    unavailable: 'fora do ar',
    unknown: 'sem confirmação',
};

function secondsBetween(from: number, to: number) {
    return Math.max(0, Math.round((to - from) / 1000));
}

function Item({ label, children }: { label: string; children: ReactNode }) {
    return (
        <span className="whitespace-nowrap">
            {label}: <strong className="font-semibold text-foreground">{children}</strong>
        </span>
    );
}

export function MonitoringBar() {
    const { status, nextCollectionAt, error, screenUpdatedAt } = useMonitoring();

    const [now, setNow] = useState(() => Date.now());

    // Atualiza o contador visual sem realizar novas consultas à API.
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
        <div className="w-fit max-w-full py-2.5 text-xs text-muted-foreground sm:py-3">
            <div className="w-fit max-w-full px-3 sm:px-4">
                <div className="flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:justify-start sm:gap-x-6">
                    {/* Estado da conexão. */}
                    <span
                        title={error ?? undefined}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium whitespace-nowrap ${
                            connected
                                ? 'border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300'
                                : 'border-destructive/30 bg-destructive/[0.06] text-destructive'
                        }`}
                    >
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />

                        {connected
                            ? 'Conectado'
                            : status === null && !error
                              ? 'Conectando...'
                              : 'Sem conexão'}
                    </span>

                    {status && (
                        <>
                            {/* Informações completas para desktop. */}
                            <div className="hidden w-fit max-w-full flex-wrap items-center gap-x-6 gap-y-2 sm:flex">
                                <Item label="Próxima coleta">{nextCollection}</Item>

                                <Item label="Intervalo de coleta">
                                    {status.collectionIntervalSeconds} s
                                </Item>

                                <Item label="Tela atualizada">
                                    {formatDateTimeSeconds(screenUpdatedAt)}
                                </Item>

                                <Item label="APIs UniLaunch">
                                    Métricas {dependencyLabel[status.dependencies.metricsDiscovery]}{' '}
                                    · Carbono {dependencyLabel[status.dependencies.carbon]}
                                </Item>
                            </div>

                            {/* Informação compacta para mobile. */}
                            <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-300 sm:hidden">
                                <Clock3 aria-hidden="true" className="size-3.5 text-cyan-300" />

                                <span>{nextCollection}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
