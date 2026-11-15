import type { CSSProperties, ReactNode } from 'react';

import {
    PAINEL_DISTRIBUTION_MOCK,
    PAINEL_KPI_MOCK,
    PAINEL_SERIES_MOCK,
    PAINEL_STATUS_MOCK,
    PAINEL_TABLE_MOCK,
} from '@/mocks/painelWidgets.mock';
import type { PainelWidget, PainelWidgetAction } from '@/types/painel';

import { PAINEL_GRID_COLUMNS, PAINEL_TABLET_COLUMNS } from './painelLayoutPadrao';
import { PainelWidgetFrame } from './PainelWidgetFrame';
import { DistributionWidget } from './widgets/DistributionWidget';
import { KpiWidget } from './widgets/KpiWidget';
import { StatusWidget } from './widgets/StatusWidget';
import { TableWidget } from './widgets/TableWidget';
import { TimeSeriesWidget } from './widgets/TimeSeriesWidget';

// Configurar e remover entram com a personalização (#147) e a edição do layout (#145).
const WIDGET_ACTIONS: readonly PainelWidgetAction[] = [
    { label: 'Configurar widget', disabled: true },
    { label: 'Remover widget', disabled: true },
];

// Escolhe o componente pelo tipo do widget. Devolve null quando não há dados,
// e o contêiner mostra o aviso de "sem dados".
function renderWidgetContent(widget: PainelWidget): ReactNode {
    switch (widget.type) {
        case 'kpi': {
            const data = PAINEL_KPI_MOCK[widget.id];
            return data ? <KpiWidget data={data} /> : null;
        }
        case 'serie-temporal': {
            const data = PAINEL_SERIES_MOCK[widget.id];
            return data && data.points.length > 0 ? (
                <TimeSeriesWidget data={data} chart={widget.chart ?? 'linha'} />
            ) : null;
        }
        case 'distribuicao': {
            const data = PAINEL_DISTRIBUTION_MOCK[widget.id];
            return data && data.items.length > 0 ? (
                <DistributionWidget data={data} chart={widget.chart ?? 'rosca'} />
            ) : null;
        }
        case 'tabela': {
            const data = PAINEL_TABLE_MOCK[widget.id];
            return data && data.rows.length > 0 ? <TableWidget data={data} /> : null;
        }
        case 'status': {
            const data = PAINEL_STATUS_MOCK[widget.id];
            return data ? <StatusWidget data={data} /> : null;
        }
    }
}

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

    const content = renderWidgetContent(widget);

    return (
        <article
            style={position}
            className="min-w-0 [grid-row:span_var(--painel-h)] md:[grid-column:span_var(--painel-w-tablet)] lg:[grid-column:var(--painel-col)] lg:[grid-row:var(--painel-row)]"
        >
            <PainelWidgetFrame
                title={widget.title}
                status={content === null ? 'empty' : 'ready'}
                actions={WIDGET_ACTIONS}
            >
                {content}
            </PainelWidgetFrame>
        </article>
    );
}
