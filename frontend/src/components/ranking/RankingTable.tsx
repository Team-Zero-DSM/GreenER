import type { RankingCriterion } from '@/types/ranking';

interface RankingTableProps {
    criterion: RankingCriterion;
}

const rankingColumns: { label: string; criterion?: RankingCriterion }[] = [
    { label: '#' },
    { label: 'Serviço' },
    { label: 'Região' },
    { label: 'Energia', criterion: 'energyKwh' },
    { label: 'CO₂e', criterion: 'co2eGrams' },
    { label: 'Coletas' },
];

export function RankingTable({ criterion }: RankingTableProps) {
    return (
        <section
            aria-label="Tabela de classificação"
            className="space-y-3 border-t border-border pt-6"
        >
            <h2 className="text-xl font-semibold">Classificação</h2>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-xl text-sm">
                    <thead className="border-b border-border text-muted-foreground">
                        <tr>
                            {rankingColumns.map((column) => {
                                const isSorted = column.criterion === criterion;

                                return (
                                    <th
                                        key={column.label}
                                        scope="col"
                                        aria-sort={isSorted ? 'descending' : undefined}
                                        className={`px-4 py-3 text-left font-medium ${isSorted ? 'text-foreground' : ''}`}
                                    >
                                        {column.label}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td
                                colSpan={rankingColumns.length}
                                className="px-4 py-10 text-center text-muted-foreground"
                            >
                                Área das linhas da classificação
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
