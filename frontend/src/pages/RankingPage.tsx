import { useState } from 'react';
import { RankingChart } from '@/components/ranking/RankingChart';
import { RankingFilters } from '@/components/ranking/RankingFilters';
import { RankingTable } from '@/components/ranking/RankingTable';
import { getRankingPeriod } from '@/components/ranking/rankingPeriod';
import { formatDateTimeSeconds } from '@/lib/format';
import { getRankingMock } from '@/mocks/rankingResponse.mock';
import type { RankingCriterion } from '@/types/ranking';
import type { HistoryRange } from '@/types/service';

export function RankingPage() {
    const [criterion, setCriterion] = useState<RankingCriterion>('co2eGrams');
    const [range, setRange] = useState<HistoryRange>('24h');
    const [periodEnd, setPeriodEnd] = useState(() => new Date().toISOString());
    const period = getRankingPeriod(range, periodEnd);
    const ranking = getRankingMock(criterion, range, periodEnd);

    function handleRangeChange(value: HistoryRange) {
        setRange(value);
        setPeriodEnd(new Date().toISOString());
    }

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
                    onRangeChange={handleRangeChange}
                />
            </div>

            <p className="text-sm text-muted-foreground">
                Período considerado:{' '}
                <span className="font-medium text-foreground tabular-nums">
                    {formatDateTimeSeconds(period.from)} até {formatDateTimeSeconds(period.to)}
                </span>
            </p>

            <RankingChart criterion={criterion} items={ranking.items} />

            <RankingTable criterion={criterion} items={ranking.items} />
        </main>
    );
}
