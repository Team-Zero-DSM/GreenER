import { Check, LayoutTemplate, Maximize, Pencil, Plus, Redo2, Undo2, X } from 'lucide-react';

import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { HISTORY_RANGE_OPTIONS } from '@/components/shared/segmentedControlOptions';
import type { PainelTemplateId } from '@/types/painel';
import type { HistoryRange } from '@/types/service';

import { PAINEL_TEMPLATE_OPTIONS } from './painelTemplates';

const ICON_BUTTON =
    'inline-flex size-11 items-center justify-center rounded-lg border border-border bg-background/60 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

const SECONDARY_BUTTON =
    'inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-white/5';

interface PainelToolbarProps {
    template: PainelTemplateId;
    range: HistoryRange;
    editing: boolean;
    onTemplateChange: (template: PainelTemplateId) => void;
    onRangeChange: (range: HistoryRange) => void;
    onStartEditing: () => void;
    onAddWidget: () => void;
    // Histórico do modo de edição.
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    // Saem do modo de edição: salvar mantém as alterações, descartar volta ao layout anterior.
    onSave: () => void;
    onDiscard: () => void;
    // Entra no modo tela cheia/TV.
    onEnterFullscreen: () => void;
}

export function PainelToolbar({
    template,
    range,
    editing,
    onTemplateChange,
    onRangeChange,
    onStartEditing,
    onAddWidget,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onSave,
    onDiscard,
    onEnterFullscreen,
}: PainelToolbarProps) {
    return (
        <section aria-label="Ferramentas do painel" className="flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm text-muted-foreground">
                <LayoutTemplate aria-hidden="true" className="size-4 text-primary" />
                Template:
                <select
                    value={template}
                    onChange={(event) => onTemplateChange(event.target.value as PainelTemplateId)}
                    className="bg-transparent font-semibold text-foreground outline-none"
                >
                    {PAINEL_TEMPLATE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-popover">
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <SegmentedControl
                label="Período do painel"
                value={range}
                options={HISTORY_RANGE_OPTIONS}
                onChange={onRangeChange}
            />

            {editing ? (
                <>
                    <button type="button" onClick={onAddWidget} className={SECONDARY_BUTTON}>
                        <Plus aria-hidden="true" className="size-4" />
                        Adicionar widget
                    </button>

                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={onUndo}
                            disabled={!canUndo}
                            aria-label="Desfazer"
                            title="Desfazer (Ctrl+Z)"
                            className={ICON_BUTTON}
                        >
                            <Undo2 aria-hidden="true" className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onRedo}
                            disabled={!canRedo}
                            aria-label="Refazer"
                            title="Refazer (Ctrl+Shift+Z)"
                            className={ICON_BUTTON}
                        >
                            <Redo2 aria-hidden="true" className="size-4" />
                        </button>
                    </div>

                    <button type="button" onClick={onDiscard} className={SECONDARY_BUTTON}>
                        <X aria-hidden="true" className="size-4" />
                        Descartar
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-400/45 bg-primary px-3 text-sm font-medium whitespace-nowrap text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        <Check aria-hidden="true" className="size-4" />
                        Salvar alterações
                    </button>
                </>
            ) : (
                <>
                    <button type="button" onClick={onStartEditing} className={SECONDARY_BUTTON}>
                        <Pencil aria-hidden="true" className="size-4" />
                        Editar layout
                    </button>

                    <button type="button" onClick={onEnterFullscreen} className={SECONDARY_BUTTON}>
                        <Maximize aria-hidden="true" className="size-4" />
                        Tela cheia
                    </button>
                </>
            )}
        </section>
    );
}
