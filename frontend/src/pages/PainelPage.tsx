import { useState } from 'react';

import { PainelGrid } from '@/components/painel/PainelGrid';
import { PAINEL_DEFAULT_WIDGETS } from '@/components/painel/painelLayoutPadrao';
import { PainelShell } from '@/components/painel/PainelShell';
import { PainelToolbar } from '@/components/painel/PainelToolbar';
import type { PainelTemplateId } from '@/types/painel';
import type { HistoryRange } from '@/types/service';

export function PainelPage() {
    const [template, setTemplate] = useState<PainelTemplateId>('visao-geral');
    const [range, setRange] = useState<HistoryRange>('24h');
    const [editing, setEditing] = useState(false);

    return (
        <PainelShell>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <header className="min-w-0 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Painel de monitoramento
                    </h1>
                    <p className="text-muted-foreground">
                        Indicadores de operação e impacto ambiental reunidos em um painel
                        personalizável.
                    </p>
                </header>

                <PainelToolbar
                    template={template}
                    range={range}
                    editing={editing}
                    onTemplateChange={setTemplate}
                    onRangeChange={setRange}
                    onEditingChange={setEditing}
                />
            </div>

            <PainelGrid widgets={PAINEL_DEFAULT_WIDGETS} />
        </PainelShell>
    );
}
