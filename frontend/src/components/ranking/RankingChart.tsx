import { Link } from 'react-router';
import { formatRankingValue } from '@/components/ranking/formatRankingValue';
import { RankingPosition } from '@/components/ranking/RankingPosition';
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
                                        className="group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border/50 bg-background/20 px-3 py-2.5 text-sm transition-[border-color,background-color] duration-200 hover:border-primary/20 hover:bg-muted/30 sm:grid-cols-[2rem_minmax(6rem,8rem)_minmax(0,1fr)_minmax(8rem,auto)] sm:gap-x-4 sm:py-3"
                                    >
                                        <span className="col-start-1 row-start-1 sm:col-start-1 sm:row-start-1">
                                            <RankingPosition position={item.position} />
                                        </span>

                                        <span className="col-start-2 row-start-1 min-w-0 truncate font-medium text-foreground sm:col-start-2 sm:row-start-1">
                                            {item.name}
                                        </span>

                                        <span className="col-start-3 row-start-1 whitespace-nowrap text-right text-xs font-medium tabular-nums text-foreground sm:col-start-4 sm:text-sm">
                                            {formatRankingValue(criterion, item[criterion])}
                                        </span>

                                        <div className="col-span-2 col-start-2 row-start-2 h-1.5 overflow-hidden rounded-full bg-secondary/80 sm:col-span-1 sm:col-start-3 sm:row-start-1">
                                            <div
                                                className="h-full rounded-full bg-primary/80 transition-[width,background-color] duration-500 ease-out group-hover:bg-primary"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
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
