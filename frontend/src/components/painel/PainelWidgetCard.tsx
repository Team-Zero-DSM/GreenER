import type { CSSProperties } from 'react';

import type { PainelWidget } from '@/types/painel';

interface PainelWidgetCardProps {
    widget: PainelWidget;
}

export function PainelWidgetCard({ widget }: PainelWidgetCardProps) {
    // A grade do CSS começa em 1, as coordenadas do widget em 0.
    const position: CSSProperties = {
        gridColumn: `${widget.x + 1} / span ${widget.w}`,
        gridRow: `${widget.y + 1} / span ${widget.h}`,
    };

    return (
        <article
            style={position}
            className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4"
        >
            <h2 className="truncate text-sm font-semibold">{widget.title}</h2>
            <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Conteúdo do widget em breve
            </p>
        </article>
    );
}
