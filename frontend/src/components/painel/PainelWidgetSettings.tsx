import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

import type { PainelWidget } from '@/types/painel';

import { PAINEL_WIDGET_TYPE_LABELS } from './painelLayoutPadrao';

interface PainelWidgetSettingsProps {
    widget: PainelWidget;
    // Recebe o widget com as alterações quando o usuário aplica.
    onApply: (widget: PainelWidget) => void;
    onClose: () => void;
}

const FIELD_LABEL = 'block text-sm font-medium';
const FIELD_INPUT =
    'mt-1.5 min-h-11 w-full rounded-lg border border-border bg-background/60 px-3 text-sm outline-none focus:border-emerald-400/60';

// Painel lateral de configuração de um widget, aberto pelo menu do próprio widget.
export function PainelWidgetSettings({ widget, onApply, onClose }: PainelWidgetSettingsProps) {
    // Cópia do widget que o formulário altera. O painel só muda ao aplicar.
    const [form, setForm] = useState<PainelWidget>(widget);

    const title = form.title.trim();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (title) {
            onApply({ ...form, title });
        }
    }

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
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="painel-configuracao-titulo"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
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

                <div className="flex-1 space-y-5 overflow-y-auto p-4">
                    <label className={FIELD_LABEL}>
                        Título
                        <input
                            type="text"
                            value={form.title}
                            maxLength={60}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            className={FIELD_INPUT}
                        />
                        {!title && (
                            <span className="mt-1.5 block text-xs font-normal text-destructive">
                                Informe um título para o widget.
                            </span>
                        )}
                    </label>
                </div>

                <footer className="flex flex-wrap justify-end gap-2 border-t border-border p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-11 items-center rounded-lg border border-border bg-background/60 px-4 text-sm font-medium transition-colors hover:bg-white/5"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!title}
                        className="inline-flex min-h-11 items-center rounded-lg border border-emerald-400/45 bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Aplicar
                    </button>
                </footer>
            </form>
        </div>
    );
}
