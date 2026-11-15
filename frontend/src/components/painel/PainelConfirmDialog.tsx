import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

interface PainelConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
}

// Pede a confirmação do usuário antes de uma ação que descarta o layout atual.
export function PainelConfirmDialog({
    title,
    message,
    confirmLabel,
    onConfirm,
    onCancel,
}: PainelConfirmDialogProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onCancel();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={onCancel}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="painel-confirmacao-titulo"
                aria-describedby="painel-confirmacao-mensagem"
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md space-y-4 rounded-xl border border-border bg-popover p-5 shadow-2xl"
            >
                <div className="flex items-start gap-3">
                    <TriangleAlert
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 text-amber-400"
                    />
                    <div className="space-y-1">
                        <h2 id="painel-confirmacao-titulo" className="text-lg font-semibold">
                            {title}
                        </h2>
                        <p
                            id="painel-confirmacao-mensagem"
                            className="text-sm text-muted-foreground"
                        >
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        autoFocus
                        onClick={onCancel}
                        className="inline-flex min-h-11 items-center rounded-lg border border-border bg-background/60 px-4 text-sm font-medium transition-colors hover:bg-white/5"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex min-h-11 items-center rounded-lg border border-emerald-400/45 bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}
