import type { PainelStatusData } from '@/types/painel';

interface StatusWidgetProps {
    data: PainelStatusData;
}

export function StatusWidget({ data }: StatusWidgetProps) {
    const groups = [
        { label: 'Ativos', count: data.available, color: 'bg-emerald-400' },
        { label: 'Sem métricas', count: data.metricsMissing, color: 'bg-amber-400' },
        { label: 'Indisponíveis', count: data.unavailable, color: 'bg-red-400' },
    ];
    const total = groups.reduce((sum, group) => sum + group.count, 0);

    return (
        <div className="flex flex-1 flex-col justify-center gap-4">
            <p className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight tabular-nums">
                    {data.available}
                </span>
                <span className="text-sm text-muted-foreground">de {total} serviços ativos</span>
            </p>

            {total > 0 && (
                // Barra única dividida na proporção de cada situação.
                <div aria-hidden="true" className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
                    {groups
                        .filter((group) => group.count > 0)
                        .map((group) => (
                            <div
                                key={group.label}
                                className={group.color}
                                style={{ width: `${(group.count / total) * 100}%` }}
                            />
                        ))}
                </div>
            )}

            <ul className="space-y-1.5 text-sm">
                {groups.map((group) => (
                    <li
                        key={group.label}
                        className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5"
                    >
                        <span aria-hidden="true" className={`size-2 rounded-full ${group.color}`} />
                        <span className="text-muted-foreground">{group.label}</span>
                        <span className="ml-auto font-semibold tabular-nums">{group.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
