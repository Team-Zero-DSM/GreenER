import { useState, type ReactNode } from 'react';
import { CircleAlert, Ellipsis, Inbox } from 'lucide-react';

import type { PainelWidgetAction, PainelWidgetStatus } from '@/types/painel';

interface PainelWidgetFrameProps {
    title: string;
    subtitle?: string;
    status: PainelWidgetStatus;
    errorMessage?: string;
    actions?: readonly PainelWidgetAction[];
    children?: ReactNode;
}

// Contêiner comum a todos os widgets: cabeçalho com título e menu de ações, e os
// avisos de carregamento, erro e sem dados. Cada widget só cuida do próprio conteúdo.
export function PainelWidgetFrame({
    title,
    subtitle,
    status,
    errorMessage,
    actions = [],
    children,
}: PainelWidgetFrameProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4">
            <header className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">{title}</h2>
                    {subtitle && (
                        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                {actions.length > 0 && (
                    <div
                        className="relative shrink-0"
                        onBlur={(event) => {
                            // Fecha quando o foco sai do menu inteiro, não ao ir do botão para um item.
                            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                                setMenuOpen(false);
                            }
                        }}
                    >
                        <button
                            type="button"
                            aria-label={`Ações do widget ${title}`}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                            className="-mt-1 -mr-1 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                            <Ellipsis aria-hidden="true" className="size-4" />
                        </button>

                        {menuOpen && (
                            <ul
                                role="menu"
                                className="absolute right-0 z-10 mt-1 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-lg"
                            >
                                {actions.map((action) => (
                                    <li key={action.label} role="none">
                                        <button
                                            type="button"
                                            role="menuitem"
                                            disabled={action.disabled}
                                            onClick={() => {
                                                action.onSelect?.();
                                                setMenuOpen(false);
                                            }}
                                            className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:text-muted-foreground/60 disabled:hover:bg-transparent"
                                        >
                                            {action.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </header>

            <div className="mt-3 flex min-h-0 flex-1 flex-col">
                {status === 'loading' && (
                    <div
                        role="status"
                        aria-label={`Carregando ${title}`}
                        className="flex flex-1 animate-pulse flex-col justify-end gap-2"
                    >
                        <div className="h-3 w-1/3 rounded bg-white/10" />
                        <div className="h-3 w-2/3 rounded bg-white/10" />
                        <div className="min-h-4 flex-1 rounded-lg bg-white/5" />
                    </div>
                )}

                {status === 'error' && (
                    <p
                        role="alert"
                        className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-destructive"
                    >
                        <CircleAlert aria-hidden="true" className="size-5" />
                        {errorMessage ?? 'Não foi possível carregar este widget.'}
                    </p>
                )}

                {status === 'empty' && (
                    <p className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                        <Inbox aria-hidden="true" className="size-5" />
                        Sem dados no período.
                    </p>
                )}

                {status === 'ready' && children}
            </div>
        </div>
    );
}
