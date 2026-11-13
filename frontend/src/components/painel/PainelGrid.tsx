import type { PainelWidget } from '@/types/painel';

import { PainelWidgetCard } from './PainelWidgetCard';

interface PainelGridProps {
    widgets: readonly PainelWidget[];
    // No modo de edição os widgets ganham os controles de layout; no modo de
    // visualização a grade só exibe.
    editing?: boolean;
    onWidgetsChange?: (widgets: readonly PainelWidget[]) => void;
}

export function PainelGrid({ widgets, editing = false }: PainelGridProps) {
    return (
        <section
            aria-label="Widgets do painel"
            data-editing={editing}
            className="grid auto-rows-[4.875rem] grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12"
        >
            {widgets.map((widget) => (
                <PainelWidgetCard key={widget.id} widget={widget} editing={editing} />
            ))}
        </section>
    );
}
