import type { PointerEvent, ReactNode } from 'react';

import type {
    PainelWidget,
    PainelWidgetAction,
    PainelWidgetContent,
    PainelWidgetSource,
} from '@/types/painel';

import { isAlerting } from './painelLayout';
import { getWidgetColors } from './painelPaletas';
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
            return <KpiWidget data={content.data} alerting={isAlerting(widget, content.data)} />;
        case 'serie-temporal':
            return (
                <TimeSeriesWidget
                    data={content.data}
                    chart={widget.chart ?? 'linha'}
                    colors={getWidgetColors(widget)}
                />
            );
        case 'distribuicao':
            return (
                <DistributionWidget
                    data={content.data}
                    chart={widget.chart ?? 'rosca'}
                    colors={getWidgetColors(widget)}
                />
            );
        case 'tabela':
            return <TableWidget data={content.data} />;
        case 'status':
            return <StatusWidget data={content.data} />;
    }
}

interface PainelWidgetViewProps {
    widget: PainelWidget;
    // Situação e conteúdo vindos do backend. Sem fonte, o widget fica "sem dados".
    source?: PainelWidgetSource;
    actions?: readonly PainelWidgetAction[];
    editing?: boolean;
    active?: boolean;
    onMoveStart?: (event: PointerEvent<HTMLElement>) => void;
}

// Desenha um widget (contêiner e conteúdo) a partir da configuração dele e da
// fonte de dados. É usado na grade do painel e na pré-visualização das
// configurações, então o que aparece na prévia é exatamente o que vai para o painel.
export function PainelWidgetView({
    widget,
    source,
    actions,
    editing = false,
    active = false,
    onMoveStart,
}: PainelWidgetViewProps) {
    const content = source?.status === 'ready' ? renderWidgetContent(widget, source.content) : null;
    const alerting =
        source?.status === 'ready' &&
        source.content?.type === 'kpi' &&
        isAlerting(widget, source.content.data);
    const status =
        source && source.status !== 'ready' ? source.status : content ? 'ready' : 'empty';

    return (
        <PainelWidgetBoundary
            resetKey={source}
            fallback={
                <PainelWidgetFrame
                    title={widget.title}
                    accentColor={widget.palette ? getWidgetColors(widget)[0] : undefined}
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
                accentColor={widget.palette ? getWidgetColors(widget)[0] : undefined}
                subtitle={source?.subtitle}
                status={status}
                alerting={alerting}
                errorMessage={source?.errorMessage}
                editing={editing}
                active={active}
                onMoveStart={onMoveStart}
                actions={actions}
            >
                {content}
            </PainelWidgetFrame>
        </PainelWidgetBoundary>
    );
}
