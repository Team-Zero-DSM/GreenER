import type { RankingCriterion } from '@/types/ranking';
import type { HistoryRange } from '@/types/service';

interface RankingChartProps {
    criterion: RankingCriterion;
    range: HistoryRange;
}

const titles: Record<RankingCriterion, string> = {
    co2eGrams: 'Emissão por serviço',
    energyKwh: 'Consumo de energia por serviço',
};

export function RankingChart({ criterion, range }: RankingChartProps) {
    return (
        <section aria-label="Gráfico do ranking" className="space-y-3 border-t border-border pt-6">
            <div>
                <h2 className="text-xl font-semibold">{titles[criterion]}</h2>

                <p className="text-sm text-muted-foreground">
                    Clique numa barra para ver o serviço.
                </p>
            </div>

            <div className="flex min-h-64 items-center justify-center rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Área do gráfico de barras ({range})</p>
            </div>
        </section>
    );
}
