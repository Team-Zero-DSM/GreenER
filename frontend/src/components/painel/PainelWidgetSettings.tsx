import { useEffect } from 'react';
import { X } from 'lucide-react';

import type { PainelWidget } from '@/types/painel';

import { PAINEL_WIDGET_TYPE_LABELS } from './painelLayoutPadrao';

interface PainelWidgetSettingsProps {
    widget: PainelWidget;
    onClose: () => void;
}

// Painel lateral de configuração de um widget, aberto pelo menu do próprio widget.
export function PainelWidgetSettings({ widget, onClose }: PainelWidgetSettingsProps) {
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="painel-configuracao-titulo"
                onClick={(event) => event.stopPropagation()}
                className="flex h-full w-full max-w-md flex-col border-l border-border bg-popover shadow-2xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-border p-4">
                    <div className="min-w-0 space-y-1">
                        <p className="text-xs font-medium tracking-wide text-primary uppercase">
                            {PAINEL_WIDGET_TYPE_LABELS[widget.type]}
                        </p>
                        <h2 id="painel-configuracao-titulo" className="text-lg font-semibold">
                            Configurar widget
                        </h2>
                        <p className="truncate text-sm text-muted-foreground">{widget.title}</p>
                    </div>

                    <button
                        type="button"
                        aria-label="Fechar configurações"
                        onClick={onClose}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                        <X aria-hidden="true" className="size-4" />
                    </button>
                </header>

                <div className="flex-1 space-y-5 overflow-y-auto p-4" />
            </aside>
        </div>
    );
}
