import type { CSSProperties, PointerEvent } from 'react';

import type { PainelWidget, PainelWidgetAction, PainelWidgetSource } from '@/types/painel';

import { PAINEL_GRID_COLUMNS, PAINEL_TABLET_COLUMNS } from './painelLayoutPadrao';
import { PainelWidgetView } from './PainelWidgetView';

interface PainelWidgetCardProps {
    widget: PainelWidget;
    // Situação e conteúdo vindos do backend. Sem fonte, o widget fica "sem dados".
    source?: PainelWidgetSource;
    editing?: boolean;
    // Widget que está sendo arrastado ou redimensionado no momento.
    active?: boolean;
    // Quando informado, o cabeçalho do widget vira a área de arrastar.
    onMoveStart?: (event: PointerEvent<HTMLElement>) => void;
    // Quando informado, o widget ganha a alça de redimensionar no canto inferior direito.
    onResizeStart?: (event: PointerEvent<HTMLElement>) => void;
    // Quando informado, a ação "Remover widget" do menu fica disponível.
    onRemove?: () => void;
    // Abre o painel de configuração deste widget.
    onConfigure?: () => void;
}

export function PainelWidgetCard({
    widget,
    source,
    editing = false,
    active = false,
    onMoveStart,
    onResizeStart,
    onRemove,
    onConfigure,
}: PainelWidgetCardProps) {
    // Remover só funciona no modo de edição.
    const actions: readonly PainelWidgetAction[] = [
        { label: 'Configurar widget', onSelect: onConfigure, disabled: onConfigure === undefined },
        { label: 'Remover widget', onSelect: onRemove, disabled: onRemove === undefined },
    ];

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
            className={`relative min-w-0 ${active ? 'z-10' : ''} [grid-row:span_var(--painel-h)] md:[grid-column:span_var(--painel-w-tablet)] lg:[grid-column:var(--painel-col)] lg:[grid-row:var(--painel-row)]`}
        >
            <PainelWidgetView
                widget={widget}
                source={source}
                actions={actions}
                editing={editing}
                active={active}
                onMoveStart={onMoveStart}
            />

            {onResizeStart && (
                <span
                    role="presentation"
                    title="Arraste para redimensionar o widget"
                    onPointerDown={onResizeStart}
                    className="absolute right-0 bottom-0 flex size-6 cursor-nwse-resize touch-none items-end justify-end p-1.5"
                >
                    <span className="size-2.5 rounded-br-sm border-r-2 border-b-2 border-emerald-400" />
                </span>
            )}
        </article>
    );
}
