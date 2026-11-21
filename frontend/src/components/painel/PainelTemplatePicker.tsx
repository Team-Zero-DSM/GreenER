import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, LayoutTemplate } from 'lucide-react';

import type { PainelTemplateId } from '@/types/painel';

import { PAINEL_TEMPLATES, getPainelTemplate, type PainelTemplate } from './painelTemplates';

interface PainelTemplatePickerProps {
    value: PainelTemplateId;
    onChange: (template: PainelTemplateId) => void;
}

// Miniatura do arranjo do template: cada widget vira um bloco na grade de 12 colunas.
function TemplatePreview({ template }: { template: PainelTemplate }) {
    const rows = Math.max(1, ...template.widgets.map((widget) => widget.y + widget.h));

    if (template.widgets.length === 0) {
        return (
            <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-white/15 text-xs text-muted-foreground">
                Painel vazio
            </div>
        );
    }

    return (
        <div aria-hidden="true" className="relative aspect-[16/9] rounded-lg bg-white/[0.03]">
            {template.widgets.map((widget) => (
                <span
                    key={widget.id}
                    className="absolute rounded-[3px] border border-emerald-300/30 bg-emerald-400/15"
                    style={{
                        left: `calc(${(widget.x / 12) * 100}% + 2px)`,
                        top: `calc(${(widget.y / rows) * 100}% + 2px)`,
                        width: `calc(${(widget.w / 12) * 100}% - 4px)`,
                        height: `calc(${(widget.h / rows) * 100}% - 4px)`,
                    }}
                />
            ))}
        </div>
    );
}

function widgetCount(template: PainelTemplate): string {
    const count = template.widgets.length;

    if (count === 0) return 'Sem widgets';
    return count === 1 ? '1 widget' : `${count} widgets`;
}

// Seletor de template no estilo da tela: lista arredondada e, ao passar o mouse ou
// navegar pelo teclado, um cartão translúcido com o resumo e a miniatura do arranjo.
export function PainelTemplatePicker({ value, onChange }: PainelTemplatePickerProps) {
    const [open, setOpen] = useState(false);
    // Opção destacada (mouse ou teclado), que mostra o cartão de resumo.
    const [highlighted, setHighlighted] = useState<number | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const listId = useId();

    const current = getPainelTemplate(value);
    const preview = highlighted === null ? null : PAINEL_TEMPLATES[highlighted];

    // Fecha ao clicar fora.
    useEffect(() => {
        if (!open) return;

        function handlePointerDown(event: PointerEvent) {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        }

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    // Ao abrir, o foco vai para a opção destacada.
    useEffect(() => {
        if (open && highlighted !== null) optionRefs.current[highlighted]?.focus();
    }, [open, highlighted]);

    function openList() {
        setHighlighted(PAINEL_TEMPLATES.findIndex((template) => template.id === value));
        setOpen(true);
    }

    function close() {
        setOpen(false);
        setHighlighted(null);
        buttonRef.current?.focus();
    }

    function select(id: PainelTemplateId) {
        close();
        if (id !== value) onChange(id);
    }

    function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
        const last = PAINEL_TEMPLATES.length - 1;
        const index = highlighted ?? 0;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlighted(index >= last ? 0 : index + 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlighted(index <= 0 ? last : index - 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            setHighlighted(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            setHighlighted(last);
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            select(PAINEL_TEMPLATES[index].id);
        } else if (event.key === 'Escape' || event.key === 'Tab') {
            // Esc fecha a lista sem sair da tela cheia nem do modo de edição.
            event.preventDefault();
            event.stopPropagation();
            close();
        }
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? listId : undefined}
                onClick={() => (open ? close() : openList())}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        event.preventDefault();
                        openList();
                    }
                }}
                className={`inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border bg-background/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-white/5 xl:w-auto ${
                    open ? 'border-emerald-400/50' : 'border-border'
                }`}
            >
                <LayoutTemplate aria-hidden="true" className="size-4 text-primary" />
                Template:
                <span className="font-semibold text-foreground">{current.label}</span>
                <ChevronDown
                    aria-hidden="true"
                    className={`size-4 text-foreground transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="painel-popover absolute top-full left-0 z-40 mt-2">
                    <ul
                        id={listId}
                        role="listbox"
                        aria-label="Templates do painel"
                        aria-activedescendant={
                            highlighted === null ? undefined : `${listId}-${highlighted}`
                        }
                        onKeyDown={handleListKeyDown}
                        onPointerLeave={() => setHighlighted(null)}
                        className="w-64 rounded-xl border border-white/10 bg-popover/85 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
                    >
                        {PAINEL_TEMPLATES.map((template, index) => {
                            const selected = template.id === value;
                            const active = index === highlighted;

                            return (
                                <li
                                    key={template.id}
                                    id={`${listId}-${index}`}
                                    ref={(element) => {
                                        optionRefs.current[index] = element;
                                    }}
                                    role="option"
                                    aria-selected={selected}
                                    aria-describedby={active ? `${listId}-resumo` : undefined}
                                    tabIndex={active ? 0 : -1}
                                    onPointerEnter={() => setHighlighted(index)}
                                    onClick={() => select(template.id)}
                                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
                                        active ? 'bg-emerald-400/10 text-foreground' : ''
                                    }`}
                                >
                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={`block font-medium ${
                                                selected ? 'text-primary' : 'text-foreground'
                                            }`}
                                        >
                                            {template.label}
                                        </span>
                                        <span className="block text-xs text-muted-foreground">
                                            {widgetCount(template)}
                                        </span>
                                        {/* No celular não há "passar o mouse": o resumo aparece na própria opção. */}
                                        <span className="mt-1 block text-xs text-muted-foreground md:hidden">
                                            {template.description}
                                        </span>
                                    </span>
                                    {selected && (
                                        <Check aria-hidden="true" className="size-4 text-primary" />
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {preview && (
                        <div
                            key={preview.id}
                            id={`${listId}-resumo`}
                            role="tooltip"
                            // Alinhado à opção destacada (cada opção tem 3,5rem no desktop).
                            style={{ top: `calc(0.375rem + ${highlighted ?? 0} * 3.5rem)` }}
                            className="painel-tooltip pointer-events-none absolute left-full ml-2 hidden w-64 space-y-3 rounded-xl border border-emerald-400/20 bg-popover/70 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl md:block"
                        >
                            <TemplatePreview template={preview} />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    {preview.label}
                                </p>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    {preview.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
