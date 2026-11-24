import { Component, type ReactNode } from 'react';

interface PainelWidgetBoundaryProps {
    // O que mostrar no lugar do widget quando ele falha ao renderizar.
    fallback: ReactNode;
    // Quando este valor muda (chegaram dados novos), o widget tenta desenhar de novo.
    resetKey: unknown;
    children: ReactNode;
}

interface PainelWidgetBoundaryState {
    failed: boolean;
}

// Isola cada widget: se um deles lançar um erro ao desenhar o conteúdo, só ele é
// trocado pelo aviso de erro e o restante do painel continua na tela.
export class PainelWidgetBoundary extends Component<
    PainelWidgetBoundaryProps,
    PainelWidgetBoundaryState
> {
    state: PainelWidgetBoundaryState = { failed: false };

    static getDerivedStateFromError(): PainelWidgetBoundaryState {
        return { failed: true };
    }

    componentDidUpdate(previous: PainelWidgetBoundaryProps) {
        if (this.state.failed && previous.resetKey !== this.props.resetKey) {
            this.setState({ failed: false });
        }
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}
