import { Component, type ErrorInfo, type ReactNode } from 'react';
import { buttonClass } from '@/components/reports/reportStyles';

interface Props {
    children: ReactNode;
    label?: string;
    tone?: 'dark' | 'paper';
    resetKey?: unknown;
}

interface State {
    error: Error | null;
}

export class ReportErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Erro ao renderizar o relatório:', error, info.componentStack);
    }

    componentDidUpdate(prev: Props) {
        if (this.state.error && prev.resetKey !== this.props.resetKey) {
            this.setState({ error: null });
        }
    }

    render() {
        const { error } = this.state;
        if (!error) return this.props.children;

        const { label = 'o relatório', tone = 'dark' } = this.props;
        const paper = tone === 'paper';

        return (
            <div role="alert" className="mt-4 grid justify-items-start gap-3 print:hidden">
                <p className={`text-sm ${paper ? 'text-[#b5483d]' : 'text-destructive'}`}>
                    Não foi possível exibir {label}: {error.message}
                </p>
                <button
                    type="button"
                    onClick={() => this.setState({ error: null })}
                    className={
                        paper
                            ? 'rounded border border-[#17262a]/30 px-3 py-1 text-sm hover:bg-black/5'
                            : buttonClass
                    }
                >
                    Tentar de novo
                </button>
            </div>
        );
    }
}
