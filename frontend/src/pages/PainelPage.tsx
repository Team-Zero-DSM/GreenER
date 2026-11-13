import { useState, type CSSProperties } from 'react';
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

// Cada widget ocupa um retângulo da grade de 12 colunas: x e y são a coluna e a
// linha onde ele começa (a partir de 0), w e h são quantas colunas e linhas ocupa.
interface PainelWidget {
    id: string;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

const GRID_COLUMNS = 12;

const DEFAULT_WIDGETS: readonly PainelWidget[] = [
    { id: 'co2e-total', title: 'CO₂e no período', x: 0, y: 0, w: 3, h: 2 },
    { id: 'energia-total', title: 'Energia no período', x: 3, y: 0, w: 3, h: 2 },
    { id: 'disponibilidade', title: 'Disponibilidade', x: 6, y: 0, w: 3, h: 2 },
    { id: 'intensidade-carbono', title: 'Intensidade de carbono', x: 9, y: 0, w: 3, h: 2 },
    { id: 'co2e-por-regiao', title: 'Emissão de CO₂e por região', x: 0, y: 2, w: 8, h: 4 },
    { id: 'status-servicos', title: 'Status dos serviços', x: 8, y: 2, w: 4, h: 4 },
    { id: 'top-emissores', title: 'Top 5 emissores', x: 0, y: 6, w: 4, h: 4 },
    { id: 'falhas-coleta', title: 'Falhas de coleta', x: 4, y: 6, w: 4, h: 4 },
    { id: 'energia-por-regiao', title: 'Energia por região', x: 8, y: 6, w: 4, h: 4 },
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

            <section
                aria-label="Widgets do painel"
                className="grid auto-rows-[4.875rem] gap-3"
                style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}
            >
                {DEFAULT_WIDGETS.map((widget) => {
                    // A grade do CSS começa em 1, as coordenadas do widget em 0.
                    const position: CSSProperties = {
                        gridColumn: `${widget.x + 1} / span ${widget.w}`,
                        gridRow: `${widget.y + 1} / span ${widget.h}`,
                    };

                    return (
                        <article
                            key={widget.id}
                            style={position}
                            className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4"
                        >
                            <h2 className="truncate text-sm font-semibold">{widget.title}</h2>
                            <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                                Conteúdo do widget em breve
                            </p>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}
