import { useState } from 'react';

import { PainelConfirmDialog } from '@/components/painel/PainelConfirmDialog';
import { PainelGrid } from '@/components/painel/PainelGrid';
import { addWidget } from '@/components/painel/painelLayout';
import { PAINEL_COLUMNS } from '@/components/painel/painelLayoutPadrao';
import {
    getLayoutWidgets,
    setLayoutWidgets,
    toTabletSize,
} from '@/components/painel/painelLayoutResponsivo';
import { getPainelTemplate } from '@/components/painel/painelTemplates';
import { PainelShell } from '@/components/painel/PainelShell';
import { PainelUpdateInfo } from '@/components/painel/PainelUpdateInfo';
import { PainelToolbar } from '@/components/painel/PainelToolbar';
import { PainelWidgetCatalog } from '@/components/painel/PainelWidgetCatalog';
import { PainelWidgetSettings } from '@/components/painel/PainelWidgetSettings';
import { usePainelBreakpoint } from '@/hooks/usePainelBreakpoint';
import { usePainelConfig } from '@/hooks/usePainelConfig';
import { usePainelData } from '@/hooks/usePainelData';
import type { PainelConfig, PainelTemplateId, PainelWidget } from '@/types/painel';
import type { HistoryRange } from '@/types/service';

function sameLayout(a: readonly PainelWidget[], b: readonly PainelWidget[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function PainelPage() {
    const [range, setRange] = useState<HistoryRange>('24h');
    // Configuração salva do painel (carregada ao abrir a página) e, durante a
    // edição, o rascunho com as alterações ainda não salvas. Sem rascunho, o
    // painel está no modo de visualização.
    const { config, isLoading, notice, saveConfig } = usePainelConfig();
    const [draft, setDraft] = useState<PainelConfig | null>(null);
    const [catalogOpen, setCatalogOpen] = useState(false);
    // Widget com o painel de configuração aberto.
    const [settingsWidgetId, setSettingsWidgetId] = useState<string | null>(null);
    // Template escolhido no seletor que ainda espera a confirmação do usuário.
    const [pendingTemplate, setPendingTemplate] = useState<PainelTemplateId | null>(null);

    const { getSource, regionCodes } = usePainelData(range);

    const editing = draft !== null;
    const current = draft ?? config;
    const settingsWidget = current.widgets.find((widget) => widget.id === settingsWidgetId);

    // A grade trabalha com o arranjo do tamanho de tela em uso; cada tamanho
    // (desktop, tablet) mantém o seu.
    const breakpoint = usePainelBreakpoint();
    const layoutWidgets = getLayoutWidgets(current, breakpoint);

    function changeDraftWidgets(widgets: readonly PainelWidget[]) {
        setDraft(setLayoutWidgets(current, breakpoint, widgets));
    }

    // Coloca um widget do catálogo no primeiro espaço livre do arranjo em uso.
    function addCatalogWidget(widget: PainelWidget) {
        if (breakpoint === 'mobile') {
            // No celular o widget novo entra no fim da pilha.
            changeDraftWidgets([...layoutWidgets, widget]);
        } else {
            const sized = breakpoint === 'tablet' ? toTabletSize(widget) : widget;

            changeDraftWidgets(addWidget(layoutWidgets, sized, PAINEL_COLUMNS[breakpoint]));
        }

        setCatalogOpen(false);
    }

    // Alterações do modo de edição que ainda não foram salvas.
    const hasUnsavedChanges = draft !== null && JSON.stringify(draft) !== JSON.stringify(config);
    // Painel salvo que já não é igual ao template de onde partiu.
    const isCustomized =
        config.tablet !== undefined ||
        config.mobileOrder !== undefined ||
        !sameLayout(config.widgets, getPainelTemplate(config.template).widgets);

    // Aplica um template: os widgets do painel são trocados pelos do template. No
    // modo de edição a troca fica no rascunho; fora dele, já é salva.
    function applyTemplate(id: PainelTemplateId) {
        const next: PainelConfig = { template: id, widgets: getPainelTemplate(id).widgets };

        if (editing) {
            setDraft(next);
        } else {
            void saveConfig(next);
        }

        setPendingTemplate(null);
    }

    // Trocar de template apaga o arranjo atual, então pede confirmação quando há
    // alterações não salvas ou um painel personalizado que seria perdido.
    function requestTemplate(id: PainelTemplateId) {
        if (hasUnsavedChanges || (!editing && isCustomized)) {
            setPendingTemplate(id);
        } else {
            applyTemplate(id);
        }
    }

    // Troca um widget pela versão configurada. No modo de edição a troca fica no
    // rascunho; fora dele, já é salva.
    function applyWidgetSettings(widget: PainelWidget) {
        const next: PainelConfig = {
            ...current,
            widgets: current.widgets.map((item) => (item.id === widget.id ? widget : item)),
        };

        if (editing) {
            setDraft(next);
        } else {
            void saveConfig(next);
        }

        setSettingsWidgetId(null);
    }

    function finishEditing(save: boolean) {
        // Sair do modo de edição salvando grava a configuração no backend.
        if (save && draft) {
            void saveConfig(draft);
        }

        setDraft(null);
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
                    template={current.template}
                    range={range}
                    editing={editing}
                    onTemplateChange={requestTemplate}
                    onRangeChange={setRange}
                    onStartEditing={() => {
                        if (!isLoading) setDraft(config);
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
                    {breakpoint === 'mobile'
                        ? 'Use as setas de cada widget para subir ou descer na ordem. A ordem do celular não muda o arranjo do desktop e do tablet.'
                        : 'Arraste um widget pelo título para mudar a posição e use a alça do canto para redimensionar. Os demais widgets se reorganizam sozinhos, e cada tamanho de tela guarda o seu arranjo.'}
                </p>
            )}

            {notice && (
                <p
                    role="status"
                    className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
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
                    widgets={layoutWidgets}
                    breakpoint={breakpoint}
                    getSource={getSource}
                    editing={editing}
                    onWidgetsChange={changeDraftWidgets}
                    onConfigureWidget={(widget) => setSettingsWidgetId(widget.id)}
                />
            )}

            {editing && catalogOpen && (
                <PainelWidgetCatalog
                    widgetIdsInUse={current.widgets.map((widget) => widget.id)}
                    onAdd={addCatalogWidget}
                    onClose={() => setCatalogOpen(false)}
                />
            )}

            {settingsWidget && (
                <PainelWidgetSettings
                    key={settingsWidget.id}
                    widget={settingsWidget}
                    regionCodes={regionCodes}
                    getSource={getSource}
                    onApply={applyWidgetSettings}
                    onClose={() => setSettingsWidgetId(null)}
                />
            )}

            {pendingTemplate && (
                <PainelConfirmDialog
                    title={`Aplicar o template "${getPainelTemplate(pendingTemplate).label}"?`}
                    message={
                        hasUnsavedChanges
                            ? 'Você tem alterações não salvas no layout. Ao aplicar o template, elas serão substituídas pelos widgets dele.'
                            : 'O seu painel personalizado será substituído pelos widgets do template.'
                    }
                    confirmLabel="Aplicar template"
                    onConfirm={() => applyTemplate(pendingTemplate)}
                    onCancel={() => setPendingTemplate(null)}
                />
            )}
        </PainelShell>
    );
}
