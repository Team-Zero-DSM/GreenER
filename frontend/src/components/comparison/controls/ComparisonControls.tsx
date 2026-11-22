import { ArrowLeftRight } from 'lucide-react';
import { PRIMARY_ACTION_BUTTON_CLASS_NAME } from '@/components/shared/actionButtonStyles';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import {
    HISTORY_RANGE_OPTIONS,
    IMPACT_METRIC_OPTIONS,
} from '@/components/shared/segmentedControlOptions';
import type { HistoryRange } from '@/types/service';
import type { RankingCriterion } from '@/types/ranking';

export type ComparisonMetric = RankingCriterion;

interface ComparisonControlsProps {
    periodo: HistoryRange;
    metrica: ComparisonMetric;
    podeComparar: boolean;
    onPeriodoChange: (periodo: HistoryRange) => void;
    onMetricaChange: (metrica: ComparisonMetric) => void;
    onComparar: () => void;
}

export function ComparisonControls({
    periodo,
    metrica,
    onPeriodoChange,
    onMetricaChange,
    onComparar,
    podeComparar,
}: ComparisonControlsProps) {
    return (
        <div className="flex flex-col gap-4 border-t border-border pt-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SegmentedControl
                    label="Período da comparação"
                    value={periodo}
                    options={HISTORY_RANGE_OPTIONS}
                    onChange={onPeriodoChange}
                />
                <SegmentedControl
                    label="Métrica da comparação"
                    value={metrica}
                    options={IMPACT_METRIC_OPTIONS}
                    onChange={onMetricaChange}
                />
            </div>

            <button
                type="button"
                onClick={onComparar}
                disabled={!podeComparar}
                className={`${PRIMARY_ACTION_BUTTON_CLASS_NAME} min-h-12 w-full px-6 text-sm xl:w-auto`}
            >
                <ArrowLeftRight aria-hidden="true" className="size-5" />
                <span>Comparar</span>
            </button>
        </div>
    );
}
