import { useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';

import type { PainelWidget, PainelWidgetType } from '@/types/painel';

import { PAINEL_WIDGET_CATALOG } from './painelLayoutPadrao';

const WIDGET_TYPE_LABELS: Record<PainelWidgetType, string> = {
    kpi: 'Indicador',
    'serie-temporal': 'Série temporal',
    distribuicao: 'Distribuição',
    tabela: 'Tabela',
    status: 'Status',
};

interface PainelWidgetCatalogProps {
    // Ids dos widgets que já estão no painel, para não adicionar o mesmo duas vezes.
    widgetIdsInUse: readonly string[];
    onAdd: (widget: PainelWidget) => void;
    onClose: () => void;
}

// Catálogo com os widgets disponíveis para adicionar ao painel no modo de edição.
export function PainelWidgetCatalog({ widgetIdsInUse, onAdd, onClose }: PainelWidgetCatalogProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="painel-catalogo-titulo"
                onClick={(event) => event.stopPropagation()}
                className="flex max-h-full w-full max-w-2xl flex-col rounded-xl border border-border bg-popover shadow-2xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-border p-4">
                    <div className="space-y-1">
                        <h2 id="painel-catalogo-titulo" className="text-lg font-semibold">
                            Adicionar widget
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Escolha um widget do catálogo. Ele entra no primeiro espaço livre do
                            painel e pode ser movido depois.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Fechar catálogo"
                        onClick={onClose}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                        <X aria-hidden="true" className="size-4" />
                    </button>
                </header>

                <ul className="grid gap-3 overflow-y-auto p-4 sm:grid-cols-2">
                    {PAINEL_WIDGET_CATALOG.map((item) => {
                        const inUse = widgetIdsInUse.includes(item.widget.id);

                        return (
                            <li key={item.widget.id}>
                                <button
                                    type="button"
                                    disabled={inUse}
                                    onClick={() => onAdd(item.widget)}
                                    className="flex h-full w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-emerald-400/45 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-card"
                                >
                                    <span className="min-w-0 flex-1 space-y-1">
                                        <span className="block text-xs font-medium tracking-wide text-primary uppercase">
                                            {WIDGET_TYPE_LABELS[item.widget.type]}
                                        </span>
                                        <span className="block text-sm font-semibold">
                                            {item.widget.title}
                                        </span>
                                        <span className="block text-xs text-muted-foreground">
                                            {item.description}
                                        </span>
                                    </span>

                                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
                                        {inUse ? (
                                            <>
                                                <Check aria-hidden="true" className="size-3.5" />
                                                No painel
                                            </>
                                        ) : (
                                            <>
                                                <Plus aria-hidden="true" className="size-3.5" />
                                                Adicionar
                                            </>
                                        )}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}
