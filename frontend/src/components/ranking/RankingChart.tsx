import { Link } from 'react-router';
import { formatRankingValue } from '@/components/ranking/formatRankingValue';
import { ChartCard } from '@/components/charts/ChartCard';
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
        <section aria-label="Gráfico do ranking">
            <ChartCard title={titles[criterion]} subtitle="Clique numa barra para ver o serviço.">
                {bars.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Nenhum serviço com coletas no período.
                    </p>
                ) : (
                    <ol className="space-y-2">
                        {bars.map((item) => {
                            const value = item[criterion] ?? 0;
                            const widthPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

                            return (
                                <li key={item.externalId}>
                                    <Link
                                        to={`/servicos/${item.externalId}`}
                                        aria-label={`Ver ${item.name}: ${formatRankingValue(criterion, item[criterion])}`}
                                        className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-md px-2 py-1 text-sm transition-colors hover:bg-white/5 sm:flex"
                                    >
                                        <span className="truncate sm:w-36 sm:shrink-0 text-muted-foreground group-hover:text-foreground">
                                            {item.name}
                                        </span>

                                        <div className="order-last col-span-2 h-4 rounded-sm bg-white/5 sm:order-none sm:flex-1">
                                            <div
                                                className="h-full rounded-sm bg-emerald-500 transition-colors group-hover:bg-emerald-400"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>

                                        <span className="text-right sm:w-32 sm:shrink-0 text-xs tabular-nums text-muted-foreground">
                                            {formatRankingValue(criterion, item[criterion])}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </ChartCard>
        </section>
    );
}
