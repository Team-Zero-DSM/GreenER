import { LayoutTemplate, Pencil } from 'lucide-react';

import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { HISTORY_RANGE_OPTIONS } from '@/components/shared/segmentedControlOptions';
import type { PainelTemplateId } from '@/types/painel';
import type { HistoryRange } from '@/types/service';

import { PAINEL_TEMPLATE_OPTIONS } from './painelLayoutPadrao';

interface PainelToolbarProps {
    template: PainelTemplateId;
    range: HistoryRange;
    editing: boolean;
    onTemplateChange: (template: PainelTemplateId) => void;
    onRangeChange: (range: HistoryRange) => void;
    onEditingChange: (editing: boolean) => void;
}

export function PainelToolbar({
    template,
    range,
    editing,
    onTemplateChange,
    onRangeChange,
    onEditingChange,
}: PainelToolbarProps) {
    return (
        <section aria-label="Ferramentas do painel" className="flex items-center gap-3">
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

            <button
                type="button"
                aria-pressed={editing}
                onClick={() => onEditingChange(!editing)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    editing
                        ? 'border-emerald-400/45 bg-primary text-primary-foreground'
                        : 'border-border bg-background/60 hover:bg-white/5'
                }`}
            >
                <Pencil aria-hidden="true" className="size-4" />
                {editing ? 'Concluir edição' : 'Editar layout'}
            </button>
        </section>
    );
}
