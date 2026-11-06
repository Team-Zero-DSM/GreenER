import type { RankingCriterion } from '@/types/ranking';
import type { HistoryRange } from '@/types/service';

interface RankingFiltersProps {
    criterion: RankingCriterion;
    range: HistoryRange;
    onCriterionChange: (criterion: RankingCriterion) => void;
    onRangeChange: (range: HistoryRange) => void;
}

const criteria: { value: RankingCriterion; label: string }[] = [
    { value: 'co2eGrams', label: 'Emissão (CO₂e)' },
    { value: 'energyKwh', label: 'Energia' },
];

const optionClass = 'rounded-md px-3 py-1.5 text-sm transition-colors';
const selectedClass = 'bg-primary/15 font-semibold text-primary';
const idleClass = 'text-muted-foreground hover:bg-white/5';

const ranges: HistoryRange[] = ['1h', '6h', '24h', '7d', '30d'];

export function RankingFilters({
    criterion,
    range,
    onCriterionChange,
    onRangeChange,
}: RankingFiltersProps) {
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
                        className={`${optionClass} ${criterion === value ? selectedClass : idleClass}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div
                aria-label="Período do ranking"
                className="flex rounded-lg border border-border bg-background/60 p-1"
            >
                {ranges.map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={range === value}
                        onClick={() => onRangeChange(value)}
                        className={`${optionClass} ${range === value ? selectedClass : idleClass}`}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </section>
    );
}
