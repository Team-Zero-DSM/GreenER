import { useState } from 'react';

import { PainelGrid } from '@/components/painel/PainelGrid';
import { addWidget } from '@/components/painel/painelLayout';
import { PainelShell } from '@/components/painel/PainelShell';
import { PainelUpdateInfo } from '@/components/painel/PainelUpdateInfo';
import { PainelToolbar } from '@/components/painel/PainelToolbar';
import { PainelWidgetCatalog } from '@/components/painel/PainelWidgetCatalog';
import { usePainelConfig } from '@/hooks/usePainelConfig';
import { usePainelData } from '@/hooks/usePainelData';
import type { PainelWidget } from '@/types/painel';
import type { HistoryRange } from '@/types/service';

export function PainelPage() {
    const [range, setRange] = useState<HistoryRange>('24h');
    // Configuração salva do painel (carregada ao abrir a página) e, durante a
    // edição, o rascunho com as alterações ainda não salvas. Sem rascunho, o
    // painel está no modo de visualização.
    const { config, isLoading, notice, saveConfig } = usePainelConfig();
    const [draftWidgets, setDraftWidgets] = useState<readonly PainelWidget[] | null>(null);
    const [catalogOpen, setCatalogOpen] = useState(false);

    const sources = usePainelData(range);

    const editing = draftWidgets !== null;
    const widgets = draftWidgets ?? config.widgets;

    function finishEditing(save: boolean) {
        // Sair do modo de edição salvando grava a configuração no backend.
        if (save && draftWidgets) {
            void saveConfig({ ...config, widgets: draftWidgets });
        }

        setDraftWidgets(null);
        setCatalogOpen(false);
    }

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
                    <PainelUpdateInfo />
                </header>

                <PainelToolbar
                    template={config.template}
                    range={range}
                    editing={editing}
                    onTemplateChange={(template) => void saveConfig({ ...config, template })}
                    onRangeChange={setRange}
                    onStartEditing={() => {
                        if (!isLoading) setDraftWidgets(config.widgets);
                    }}
                    onAddWidget={() => setCatalogOpen(true)}
                    onSave={() => finishEditing(true)}
                    onDiscard={() => finishEditing(false)}
                />
            </div>

            {editing && (
                <p
                    role="status"
                    className="rounded-lg border border-dashed border-emerald-400/45 bg-emerald-400/5 px-4 py-3 text-sm text-muted-foreground"
                >
                    <strong className="font-semibold text-foreground">Modo de edição.</strong>{' '}
                    Arraste um widget pelo título para mudar a posição e use a alça do canto para
                    redimensionar. Os demais widgets se reorganizam sozinhos.
                </p>
            )}

            {notice && (
                <p
                    role="alert"
                    className="rounded-lg border border-amber-400/40 bg-amber-400/5 px-4 py-3 text-sm text-amber-200"
                >
                    {notice}
                </p>
            )}

            {isLoading ? (
                <p role="status" className="py-16 text-center text-sm text-muted-foreground">
                    Carregando o seu painel…
                </p>
            ) : (
                <PainelGrid
                    widgets={widgets}
                    sources={sources}
                    editing={editing}
                    onWidgetsChange={setDraftWidgets}
                />
            )}

            {editing && catalogOpen && (
                <PainelWidgetCatalog
                    widgetIdsInUse={widgets.map((widget) => widget.id)}
                    onAdd={(widget) => {
                        setDraftWidgets(addWidget(widgets, widget));
                        setCatalogOpen(false);
                    }}
                    onClose={() => setCatalogOpen(false)}
                />
            )}
        </PainelShell>
    );
}
