import type { RankingCriterion } from '@/types/ranking';

interface RankingFiltersProps {
    criterion: RankingCriterion;
    onCriterionChange: (criterion: RankingCriterion) => void;
}

const criteria: { value: RankingCriterion; label: string }[] = [
    { value: 'co2eGrams', label: 'Emissão (CO₂e)' },
    { value: 'energyKwh', label: 'Energia' },
];

export function RankingFilters({ criterion, onCriterionChange }: RankingFiltersProps) {
    return (
        <section
            aria-label="Filtros do ranking"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
            <div
                aria-label="Critério do ranking"
                className="flex rounded-lg border border-border bg-background/60 p-1"
            >
                {criteria.map(({ value, label }) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={criterion === value}
                        onClick={() => onCriterionChange(value)}
                        className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5"
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex min-h-10 items-center rounded-md border border-dashed border-border px-3 py-2">
                <p className="text-sm text-muted-foreground">1h | 6h | 24h | 7d | 30d</p>
            </div>
        </section>
    );
}
