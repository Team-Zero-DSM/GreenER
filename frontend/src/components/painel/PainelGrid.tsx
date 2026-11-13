import type { PainelWidget } from '@/types/painel';

import { PAINEL_GRID_COLUMNS } from './painelLayoutPadrao';
import { PainelWidgetCard } from './PainelWidgetCard';

interface PainelGridProps {
    widgets: readonly PainelWidget[];
}

export function PainelGrid({ widgets }: PainelGridProps) {
    return (
        <section
            aria-label="Widgets do painel"
            className="grid auto-rows-[4.875rem] gap-3"
            style={{ gridTemplateColumns: `repeat(${PAINEL_GRID_COLUMNS}, minmax(0, 1fr))` }}
        >
            {widgets.map((widget) => (
                <PainelWidgetCard key={widget.id} widget={widget} />
            ))}
        </section>
    );
}
