import type { CSSProperties, PointerEvent, ReactNode } from 'react';

import type {
    PainelWidget,
    PainelWidgetAction,
    PainelWidgetContent,
    PainelWidgetSource,
} from '@/types/painel';

import { PAINEL_GRID_COLUMNS, PAINEL_TABLET_COLUMNS } from './painelLayoutPadrao';
import { PainelWidgetBoundary } from './PainelWidgetBoundary';
import { PainelWidgetFrame } from './PainelWidgetFrame';
import { DistributionWidget } from './widgets/DistributionWidget';
import { KpiWidget } from './widgets/KpiWidget';
import { StatusWidget } from './widgets/StatusWidget';
import { TableWidget } from './widgets/TableWidget';
import { TimeSeriesWidget } from './widgets/TimeSeriesWidget';

// Escolhe o componente pelo tipo do widget. Devolve null quando o conteúdo não
// existe ou não é do tipo do widget, e o contêiner mostra o aviso de "sem dados".
function renderWidgetContent(widget: PainelWidget, content?: PainelWidgetContent): ReactNode {
    if (!content || content.type !== widget.type) {
        return null;
    }

    switch (content.type) {
        case 'kpi':
            return <KpiWidget data={content.data} />;
        case 'serie-temporal':
            return <TimeSeriesWidget data={content.data} chart={widget.chart ?? 'linha'} />;
        case 'distribuicao':
            return <DistributionWidget data={content.data} chart={widget.chart ?? 'rosca'} />;
        case 'tabela':
            return <TableWidget data={content.data} />;
        case 'status':
            return <StatusWidget data={content.data} />;
    }
}

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
}

export function PainelWidgetCard({
    widget,
    source,
    editing = false,
    active = false,
    onMoveStart,
    onResizeStart,
    onRemove,
}: PainelWidgetCardProps) {
    // Remover só funciona no modo de edição. Configurar entra com a personalização (#147).
    const actions: readonly PainelWidgetAction[] = [
        { label: 'Configurar widget', disabled: true },
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

    const content = source?.status === 'ready' ? renderWidgetContent(widget, source.content) : null;
    const status =
        source && source.status !== 'ready' ? source.status : content ? 'ready' : 'empty';

    return (
        <article
            style={position}
            className={`relative min-w-0 ${active ? 'z-10' : ''} [grid-row:span_var(--painel-h)] md:[grid-column:span_var(--painel-w-tablet)] lg:[grid-column:var(--painel-col)] lg:[grid-row:var(--painel-row)]`}
        >
            <PainelWidgetBoundary
                resetKey={source}
                fallback={
                    <PainelWidgetFrame
                        title={widget.title}
                        subtitle={source?.subtitle}
                        status="error"
                        errorMessage="Este widget encontrou um erro ao exibir os dados."
                        editing={editing}
                        actions={actions}
                    />
                }
            >
                <PainelWidgetFrame
                    title={widget.title}
                    subtitle={source?.subtitle}
                    status={status}
                    errorMessage={source?.errorMessage}
                    editing={editing}
                    active={active}
                    onMoveStart={onMoveStart}
                    actions={actions}
                >
                    {content}
                </PainelWidgetFrame>
            </PainelWidgetBoundary>

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
