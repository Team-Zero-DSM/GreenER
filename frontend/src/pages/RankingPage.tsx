import { RankingChart } from '@/components/ranking/RankingChart';
import { RankingFilters } from '@/components/ranking/RankingFilters';
import { RankingTable } from '@/components/ranking/RankingTable';

export function RankingPage() {
    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold">Ranking de impacto</h1>

                    <p className="text-muted-foreground">
                        Serviços ordenados por emissão ou consumo estimado no período escolhido.
                    </p>
                </header>

                <RankingFilters />
            </div>

            <p className="text-sm text-muted-foreground">
                Período considerado:{' '}
                <span className="font-medium text-foreground">início e fim do período</span>
            </p>

            <RankingChart />

            <RankingTable />
        </main>
    );
}
