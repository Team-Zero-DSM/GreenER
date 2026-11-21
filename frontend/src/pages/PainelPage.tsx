import { useCallback, useEffect, useRef, useState } from 'react';
import { Minimize } from 'lucide-react';

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
import { usePainelFullscreen } from '@/hooks/usePainelFullscreen';
import type { PainelConfig, PainelTemplateId, PainelWidget } from '@/types/painel';
import type { HistoryRange } from '@/types/service';

// Quantas alterações o "Desfazer" consegue voltar.
const HISTORY_LIMIT = 50;

interface PainelHistory {
    past: PainelConfig[];
    future: PainelConfig[];
}

const EMPTY_HISTORY: PainelHistory = { past: [], future: [] };

function sameConfig(a: PainelConfig, b: PainelConfig): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Atalhos de teclado não valem enquanto o usuário digita num campo.
function isTyping(target: EventTarget | null): boolean {
    return (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    );
}

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
    // Histórico do modo de edição, para desfazer e refazer alterações.
    const [history, setHistory] = useState<PainelHistory>(EMPTY_HISTORY);

    const { getSource, regionCodes } = usePainelData(range);

    // Modo tela cheia/TV: esconde a navegação e as ferramentas de edição.
    const fullscreen = usePainelFullscreen();

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

    // Guarda o estado atual antes de uma alteração, para o "Desfazer" voltar a ele.
    // Uma alteração nova apaga o que havia para refazer.
    const draftRef = useRef(draft);
    useEffect(() => {
        draftRef.current = draft;
    });

    const pushHistory = useCallback(() => {
        const snapshot = draftRef.current;
        if (!snapshot) return;

        setHistory((previous) => {
            const last = previous.past[previous.past.length - 1];
            if (last && sameConfig(last, snapshot)) return { past: previous.past, future: [] };

            return { past: [...previous.past, snapshot].slice(-HISTORY_LIMIT), future: [] };
        });
    }, []);

    // Volta (ou avança) no histórico, pulando estados iguais ao atual, como o de um
    // arraste cancelado.
    const travel = useCallback((direction: 'undo' | 'redo') => {
        const present = draftRef.current;
        if (!present) return;

        setHistory((previous) => {
            const from = direction === 'undo' ? [...previous.past] : [...previous.future];
            const to = direction === 'undo' ? [...previous.future] : [...previous.past];
            let target = from.pop();

            while (target && sameConfig(target, present)) target = from.pop();
            if (!target) return previous;

            to.push(present);
            setDraft(target);

            return direction === 'undo' ? { past: from, future: to } : { past: to, future: from };
        });
    }, []);

    const canUndo = history.past.some((entry) => !draft || !sameConfig(entry, draft));
    const canRedo = history.future.length > 0;

    // Ctrl+Z desfaz; Ctrl+Shift+Z ou Ctrl+Y refazem (Cmd no Mac).
    useEffect(() => {
        if (!editing) return;

        function handleShortcut(event: globalThis.KeyboardEvent) {
            if (!(event.ctrlKey || event.metaKey) || event.altKey || isTyping(event.target)) return;

            const key = event.key.toLowerCase();

            if (key === 'z') {
                event.preventDefault();
                travel(event.shiftKey ? 'redo' : 'undo');
            } else if (key === 'y') {
                event.preventDefault();
                travel('redo');
            }
        }

        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, [editing, travel]);

    // Coloca um widget do catálogo no primeiro espaço livre do arranjo em uso.
    function addCatalogWidget(widget: PainelWidget) {
        pushHistory();

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
            pushHistory();
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
            pushHistory();
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
        setHistory(EMPTY_HISTORY);
        setCatalogOpen(false);
    }

    return (
        <PainelShell fullscreen={fullscreen.active}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <header className="min-w-0 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Painel de monitoramento
                    </h1>
                    {!fullscreen.active && (
                        <p className="text-muted-foreground">
                            Indicadores de operação e impacto ambiental reunidos em um painel
                            personalizável.
                        </p>
                    )}
                    <PainelUpdateInfo />
                </header>

                {fullscreen.active ? (
                    <button
                        type="button"
                        onClick={fullscreen.exit}
                        className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg border border-border bg-background/60 px-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-white/5 xl:self-auto"
                    >
                        <Minimize aria-hidden="true" className="size-4" />
                        Sair da tela cheia
                    </button>
                ) : (
                    <PainelToolbar
                        template={current.template}
                        range={range}
                        editing={editing}
                        onTemplateChange={requestTemplate}
                        onRangeChange={setRange}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onUndo={() => travel('undo')}
                        onRedo={() => travel('redo')}
                        onStartEditing={() => {
                            if (isLoading) return;
                            setHistory(EMPTY_HISTORY);
                            setDraft(config);
                        }}
                        onAddWidget={() => setCatalogOpen(true)}
                        onSave={() => finishEditing(true)}
                        onDiscard={() => finishEditing(false)}
                        onEnterFullscreen={fullscreen.enter}
                    />
                )}
            </div>

            {editing && (
                <p
                    role="status"
                    className="rounded-lg border border-dashed border-emerald-400/45 bg-emerald-400/5 px-4 py-3 text-sm text-muted-foreground"
                >
                    <strong className="font-semibold text-foreground">Modo de edição.</strong>{' '}
                    {breakpoint === 'mobile'
                        ? 'Use as setas de cada widget para subir ou descer na ordem. A ordem do celular não muda o arranjo do desktop e do tablet.'
                        : 'Arraste qualquer widget para mover e puxe as bordas ou o canto para redimensionar. Os demais se reorganizam sozinhos. As setas do teclado também funcionam, e Ctrl+Z desfaz.'}
                </p>
            )}

            {notice && !fullscreen.active && (
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
                    onBeforeChange={pushHistory}
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
