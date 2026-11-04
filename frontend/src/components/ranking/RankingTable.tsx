import type { RankingCriterion, RankingItem } from '@/types/ranking';

interface RankingTableProps {
    criterion: RankingCriterion;
    items: RankingItem[];
}

const rankingColumns: { label: string; criterion?: RankingCriterion }[] = [
    { label: '#' },
    { label: 'Serviço' },
    { label: 'Região' },
    { label: 'Energia', criterion: 'energyKwh' },
    { label: 'CO₂e', criterion: 'co2eGrams' },
    { label: 'Coletas' },
];

const sortLabels: Record<RankingCriterion, string> = {
    co2eGrams: 'emissão de CO₂e',
    energyKwh: 'consumo de energia',
};

function valueClass(isSorted: boolean) {
    return `px-4 py-3 tabular-nums ${isSorted ? 'font-semibold text-foreground' : 'text-muted-foreground'}`;
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
                    Ordenada por {sortLabels[criterion]}, do maior para o menor.
                </p>
            </div>

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
                        {items.map((item) => (
                            <tr
                                key={item.externalId}
                                className="border-b border-border last:border-b-0"
                            >
                                <td className="px-4 py-3 tabular-nums">{item.position}</td>
                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {item.region.code}
                                </td>
                                <td className={valueClass(criterion === 'energyKwh')}>
                                    {item.energyKwh}
                                </td>
                                <td className={valueClass(criterion === 'co2eGrams')}>
                                    {item.co2eGrams}
                                </td>
                                <td className="px-4 py-3 tabular-nums">{item.sampleCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
