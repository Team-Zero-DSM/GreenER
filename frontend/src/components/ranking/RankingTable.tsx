import { formatCo2e, formatEnergy } from '@/components/ranking/formatRankingValue';
import type { RankingCriterion, RankingItem } from '@/types/ranking';

interface RankingTableProps {
    criterion: RankingCriterion;
    items: RankingItem[];
}

const rankingColumns: { label: string; criterion?: RankingCriterion; className?: string }[] = [
    { label: '#' },
    { label: 'Serviço' },
    { label: 'Região', className: 'hidden sm:table-cell' },
    { label: 'Energia', criterion: 'energyKwh' },
    { label: 'CO₂e', criterion: 'co2eGrams' },
    { label: 'Coletas' },
];

const sortLabels: Record<RankingCriterion, string> = {
    co2eGrams: 'emissão de CO₂e',
    energyKwh: 'consumo de energia',
};

function valueClass(isSorted: boolean) {
    return `px-4 py-3 whitespace-nowrap tabular-nums ${isSorted ? 'font-semibold text-foreground' : 'text-muted-foreground'}`;
}

export function RankingTable({ criterion, items }: RankingTableProps) {
    return (
        <section
            aria-label="Tabela de classificação"
            className="space-y-3 border-t border-border pt-6"
        >
            <div>
                <h2 className="text-xl font-semibold">Classificação</h2>

                <p className="text-sm text-muted-foreground">
                    Totais somados no período considerado, ordenados por {sortLabels[criterion]}, do
                    maior para o menor.
                </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-lg text-sm sm:min-w-xl">
                    <thead className="border-b border-border text-muted-foreground">
                        <tr>
                            {rankingColumns.map((column) => {
                                const isSorted = column.criterion === criterion;

                                return (
                                    <th
                                        key={column.label}
                                        scope="col"
                                        aria-sort={isSorted ? 'descending' : undefined}
                                        className={`px-4 py-3 text-left font-medium ${column.className ?? ''} ${isSorted ? 'text-foreground' : ''}`}
                                    >
                                        {column.label}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => {
                            // Sem coletas no período o backend devolve position null e métricas null.
                            const hasData = item.sampleCount > 0;

                            return (
                                <tr
                                    key={item.externalId}
                                    className={`border-b border-border last:border-b-0 ${hasData ? '' : 'opacity-60'}`}
                                >
                                    <td className="px-4 py-3 tabular-nums">
                                        {item.position ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium">{item.name}</span>

                                        <span className="block text-xs text-muted-foreground sm:hidden">
                                            {item.region.code}
                                        </span>

                                        {!hasData && (
                                            <span className="mt-1 inline-block whitespace-nowrap rounded-full sm:mt-0 sm:ml-2 border border-border px-2 py-0.5 text-xs text-muted-foreground">
                                                Sem dados no período
                                            </span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                                        {item.region.code}
                                    </td>
                                    <td className={valueClass(criterion === 'energyKwh')}>
                                        {formatEnergy(item.energyKwh)}
                                    </td>
                                    <td className={valueClass(criterion === 'co2eGrams')}>
                                        {formatCo2e(item.co2eGrams)}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">
                                        {item.sampleCount.toLocaleString('pt-BR')}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
