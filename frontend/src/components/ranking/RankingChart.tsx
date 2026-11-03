import type { RankingCriterion, RankingItem } from '@/types/ranking';

interface RankingChartProps {
    criterion: RankingCriterion;
    items: RankingItem[];
}

const titles: Record<RankingCriterion, string> = {
    co2eGrams: 'Emissão por serviço',
    energyKwh: 'Consumo de energia por serviço',
};

export function RankingChart({ criterion, items }: RankingChartProps) {
    // Serviços sem dados no período ficam só na tabela.
    const bars = items.filter((item) => item[criterion] !== null);
    const maxValue = Math.max(0, ...bars.map((item) => item[criterion] ?? 0));

    return (
        <section aria-label="Gráfico do ranking" className="space-y-3 border-t border-border pt-6">
            <div>
                <h2 className="text-xl font-semibold">{titles[criterion]}</h2>

                <p className="text-sm text-muted-foreground">
                    Clique numa barra para ver o serviço.
                </p>
            </div>

            <ol className="space-y-2 rounded-lg border border-border p-4">
                {bars.map((item) => {
                    const value = item[criterion] ?? 0;
                    const widthPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

                    return (
                        <li key={item.externalId} className="flex items-center gap-3 text-sm">
                            <span className="w-36 shrink-0 truncate text-muted-foreground">
                                {item.name}
                            </span>

                            <div className="h-4 flex-1 rounded-sm bg-white/5">
                                <div
                                    className="h-full rounded-sm bg-emerald-500"
                                    style={{ width: `${widthPercent}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
