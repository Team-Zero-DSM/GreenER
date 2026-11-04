import { useState } from 'react';
import { RankingChart } from '@/components/ranking/RankingChart';
import { RankingFilters } from '@/components/ranking/RankingFilters';
import { RankingTable } from '@/components/ranking/RankingTable';
import { formatDateTimeSeconds } from '@/lib/format';
import { useRanking } from '@/hooks/useRanking';
import type { RankingCriterion } from '@/types/ranking';
import type { HistoryRange } from '@/types/service';

export function RankingPage() {
    const [criterion, setCriterion] = useState<RankingCriterion>('co2eGrams');
    const [range, setRange] = useState<HistoryRange>('24h');
    // A requisição leva o critério e o período escolhidos. Gráfico e tabela usam o critério
    // devolvido pelo backend, para não misturar a ordem antiga com o destaque novo
    // enquanto a próxima resposta não chega.
    const { data: ranking } = useRanking(criterion, range);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold">Ranking de impacto</h1>

                    <p className="text-muted-foreground">
                        Serviços ordenados por emissão ou consumo estimado no período escolhido.
                    </p>
                </header>

                <RankingFilters
                    criterion={criterion}
                    range={range}
                    onCriterionChange={setCriterion}
                    onRangeChange={setRange}
                />
            </div>

            {ranking && (
                <>
                    <p className="text-sm text-muted-foreground">
                        Período considerado:{' '}
                        <span className="font-medium text-foreground tabular-nums">
                            {formatDateTimeSeconds(ranking.period.from)} até{' '}
                            {formatDateTimeSeconds(ranking.period.to)}
                        </span>
                    </p>

                    <RankingChart criterion={ranking.criterion} items={ranking.items} />

                    <RankingTable criterion={ranking.criterion} items={ranking.items} />
                </>
            )}
        </main>
    );
}
