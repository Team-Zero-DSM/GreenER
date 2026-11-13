import type { PainelWidget } from '@/types/painel';

import { PainelWidgetCard } from './PainelWidgetCard';

interface PainelGridProps {
    widgets: readonly PainelWidget[];
}

export function PainelGrid({ widgets }: PainelGridProps) {
    return (
        <section
            aria-label="Widgets do painel"
            className="grid auto-rows-[4.875rem] grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12"
        >
            {widgets.map((widget) => (
                <PainelWidgetCard key={widget.id} widget={widget} />
            ))}
        </section>
    );
}
