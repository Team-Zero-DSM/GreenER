import type { CSSProperties } from 'react';

import type { PainelWidget } from '@/types/painel';

import { PAINEL_GRID_COLUMNS, PAINEL_TABLET_COLUMNS } from './painelLayoutPadrao';

interface PainelWidgetCardProps {
    widget: PainelWidget;
}

export function PainelWidgetCard({ widget }: PainelWidgetCardProps) {
    // No desktop o widget fica exatamente na coordenada salva (a grade do CSS começa
    // em 1, as coordenadas em 0). No tablet e no celular a posição é automática, na
    // ordem da lista: só a altura e, no tablet, meia largura ou largura inteira.
    const position = {
        '--painel-col': `${widget.x + 1} / span ${widget.w}`,
        '--painel-row': `${widget.y + 1} / span ${widget.h}`,
        '--painel-h': widget.h,
        '--painel-w-tablet':
            widget.w > PAINEL_GRID_COLUMNS / 2 ? PAINEL_TABLET_COLUMNS : PAINEL_TABLET_COLUMNS / 2,
    } as CSSProperties;

    return (
        <article
            style={position}
            className="flex min-w-0 [grid-row:span_var(--painel-h)] flex-col rounded-xl border border-border bg-card p-4 md:[grid-column:span_var(--painel-w-tablet)] lg:[grid-column:var(--painel-col)] lg:[grid-row:var(--painel-row)]"
        >
            <h2 className="truncate text-sm font-semibold">{widget.title}</h2>
            <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Conteúdo do widget em breve
            </p>
        </article>
    );
}
