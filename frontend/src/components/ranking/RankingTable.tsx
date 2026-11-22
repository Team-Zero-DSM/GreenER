import { formatCo2e, formatEnergy } from '@/components/ranking/formatRankingValue';
import { ChartCard } from '@/components/charts/ChartCard';
import type { RankingCriterion, RankingItem } from '@/types/ranking';
import { ArrowDown } from 'lucide-react';

interface RankingTableProps {
    criterion: RankingCriterion;
    items: RankingItem[];
}

const rankingColumns: {
    label: string;
    criterion?: RankingCriterion;
    className?: string;
}[] = [
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

export function RankingTable({ criterion, items }: RankingTableProps) {
    return (
        <section aria-label="Tabela de classificação">
            <ChartCard
                title="Classificação"
                subtitle={`Totais somados no período considerado, ordenados por ${sortLabels[criterion]}, do maior para o menor.`}
            >
                <div className="overflow-hidden rounded-xl border border-border/60 bg-background/20">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-lg text-sm sm:min-w-xl">
                            <thead>
                                <tr>
                                    {rankingColumns.map((column) => {
                                        const isSorted = column.criterion === criterion;

                                        return (
                                            <th
                                                key={column.label}
                                                scope="col"
                                                aria-sort={isSorted ? 'descending' : undefined}
                                                className={`whitespace-nowrap border-b border-border/60 px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] ${
                                                    column.className ?? ''
                                                } ${isSorted ? 'text-foreground' : 'text-muted-foreground'}`}
                                            >
                                                <span className="inline-flex items-center gap-1.5">
                                                    {column.label}
                                                    {isSorted && (
                                                        <ArrowDown
                                                            aria-hidden="true"
                                                            className="size-3 text-primary"
                                                        />
                                                    )}
                                                </span>
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
                                            className={`group transition-colors duration-150 hover:bg-muted/35 ${
                                                !hasData ? 'opacity-60' : ''
                                            }`}
                                        >
                                            {/* Posição. */}
                                            <td className="border-b border-border/45 px-4 py-3 tabular-nums last:border-b-0">
                                                <span
                                                    className={`inline-flex size-7 items-center justify-center rounded-lg text-xs font-medium ${
                                                        hasData
                                                            ? 'bg-primary/8 text-foreground ring-1 ring-inset ring-primary/15'
                                                            : 'bg-muted/60 text-muted-foreground'
                                                    }`}
                                                >
                                                    {item.position ?? '—'}
                                                </span>
                                            </td>

                                            {/* Serviço. */}
                                            <td className="border-b border-border/45 px-4 py-3 last:border-b-0">
                                                <span className="font-medium text-foreground">
                                                    {item.name}
                                                </span>

                                                <span className="mt-1 block text-xs text-muted-foreground sm:hidden">
                                                    {item.region.code}
                                                </span>

                                                {!hasData && (
                                                    <span className="mt-1.5 inline-block whitespace-nowrap text-[11px] text-muted-foreground sm:ml-2 sm:mt-0">
                                                        Sem dados no período
                                                    </span>
                                                )}
                                            </td>

                                            {/* Região. */}
                                            <td className="hidden border-b border-border/45 px-4 py-3 text-muted-foreground last:border-b-0 sm:table-cell">
                                                {item.region.code}
                                            </td>

                                            {/* Energia. */}
                                            <td
                                                className={`whitespace-nowrap border-b border-border/45 px-4 py-3 text-right tabular-nums last:border-b-0 ${criterion === 'energyKwh' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                                            >
                                                {formatEnergy(item.energyKwh)}
                                            </td>

                                            {/* Emissões. */}
                                            <td
                                                className={`whitespace-nowrap border-b border-border/45 px-4 py-3 text-right tabular-nums last:border-b-0 ${criterion === 'co2eGrams' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                                            >
                                                {formatCo2e(item.co2eGrams)}
                                            </td>

                                            {/* Coletas. */}
                                            <td className="border-b border-border/45 px-4 py-3 text-right tabular-nums text-muted-foreground last:border-b-0">
                                                {item.sampleCount.toLocaleString('pt-BR')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ChartCard>
        </section>
    );
}
