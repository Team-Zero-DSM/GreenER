import { useState } from 'react';
import { LayoutTemplate, Pencil } from 'lucide-react';

import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { HISTORY_RANGE_OPTIONS } from '@/components/shared/segmentedControlOptions';
import type { HistoryRange } from '@/types/service';

type PainelTemplateId = 'visao-geral' | 'sustentabilidade' | 'operacional' | 'executivo';

const TEMPLATE_OPTIONS: readonly { value: PainelTemplateId; label: string }[] = [
    { value: 'visao-geral', label: 'Visão geral' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'operacional', label: 'Operacional' },
    { value: 'executivo', label: 'Executivo' },
];

export function PainelPage() {
    const [template, setTemplate] = useState<PainelTemplateId>('visao-geral');
    const [range, setRange] = useState<HistoryRange>('24h');
    const [editing, setEditing] = useState(false);

    return (
        // O painel não usa o PageShell: ele ocupa toda a largura da tela, sem o
        // limite max-w-7xl das demais páginas, para caber mais indicadores lado a lado.
        <main className="w-full space-y-4 p-4 sm:p-6">
            <div className="flex items-end justify-between gap-4">
                <header className="min-w-0 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Painel de monitoramento
                    </h1>
                    <p className="text-muted-foreground">
                        Indicadores de operação e impacto ambiental reunidos em um painel
                        personalizável.
                    </p>
                </header>

                <section aria-label="Ferramentas do painel" className="flex items-center gap-3">
                    <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm text-muted-foreground">
                        <LayoutTemplate aria-hidden="true" className="size-4 text-primary" />
                        Template:
                        <select
                            value={template}
                            onChange={(event) =>
                                setTemplate(event.target.value as PainelTemplateId)
                            }
                            className="bg-transparent font-semibold text-foreground outline-none"
                        >
                            {TEMPLATE_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    className="bg-popover"
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <SegmentedControl
                        label="Período do painel"
                        value={range}
                        options={HISTORY_RANGE_OPTIONS}
                        onChange={setRange}
                    />

                    <button
                        type="button"
                        aria-pressed={editing}
                        onClick={() => setEditing((current) => !current)}
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
            </div>
        </main>
    );
}
