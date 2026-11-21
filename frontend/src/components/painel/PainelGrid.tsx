import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react';

import type { PainelBreakpoint, PainelSourceGetter, PainelWidget } from '@/types/painel';

import {
    arrangeWidgets,
    moveWidget,
    PAINEL_WIDGET_MIN_SIZE,
    removeWidget,
    resizeWidget,
    shiftWidget,
} from './painelLayout';
import { PAINEL_COLUMNS } from './painelLayoutPadrao';
import {
    PAINEL_SPRING_DROP,
    PAINEL_SPRING_LAYOUT,
    prefersReducedMotion,
    type PainelSpring,
} from './painelMotion';
import {
    PainelWidgetCard,
    type PainelCardHandlers,
    type PainelResizeEdge,
} from './PainelWidgetCard';

interface PainelGridProps {
    // Widgets já com a posição do tamanho de tela em uso.
    widgets: readonly PainelWidget[];
    breakpoint: PainelBreakpoint;
    // Entrega os dados de cada widget.
    getSource: PainelSourceGetter;
    // No modo de edição os widgets ganham os controles de layout; no modo de
    // visualização a grade só exibe.
    editing?: boolean;
    onWidgetsChange?: (widgets: readonly PainelWidget[]) => void;
    // Avisado no começo de cada alteração feita na grade (gesto, teclado, remover),
    // para a página guardar o estado anterior e permitir desfazer.
    onBeforeChange?: () => void;
    onConfigureWidget?: (widget: PainelWidget) => void;
}

// Gesto em andamento. As posições são calculadas sempre a partir do início do
// gesto, e o widget segue o ponteiro pixel a pixel enquanto a grade encaixa.
interface PainelGesture {
    kind: 'move' | 'resize';
    edge: PainelResizeEdge;
    widget: PainelWidget;
    element: HTMLElement;
    pointerId: number;
    started: boolean;
    startClientX: number;
    startClientY: number;
    startScrollX: number;
    startScrollY: number;
    clientX: number;
    clientY: number;
    // Posição e tamanho do widget na grade, em pixels, no início do gesto.
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
    // Tamanho, em pixels, de um passo de coluna e de linha (célula + espaçamento).
    columnStep: number;
    rowStep: number;
    columnGap: number;
    rowGap: number;
    columns: number;
    initialWidgets: readonly PainelWidget[];
    // Última célula em que o widget encaixou, para só reorganizar quando ela muda.
    lastCell: string;
    lastDx: number;
    lastDy: number;
    tilt: number;
    frame: number;
}

interface Box {
    left: number;
    top: number;
    width: number;
    height: number;
}

const GHOST_ID = '__ghost';
// Distância que o ponteiro precisa andar para um clique virar arrasto.
const DRAG_THRESHOLD = 5;
// Faixa perto das bordas da janela que rola a página durante o arrasto.
const AUTO_SCROLL_EDGE = 80;
const AUTO_SCROLL_MAX = 22;
// Elementos que continuam clicáveis no modo de edição (não iniciam arrasto).
const INTERACTIVE = 'button, a, input, select, textarea, [role="menu"], [data-painel-resize]';

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function cellKey(widget: PainelWidget | undefined): string {
    return widget ? `${widget.x},${widget.y},${widget.w},${widget.h}` : '';
}

// Retângulo do elemento em coordenadas da página (não mudam com a rolagem).
function pageBox(element: Element): Box {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
    };
}

function play(element: HTMLElement, keyframes: Keyframe[], spring: PainelSpring): Animation {
    return element.animate(keyframes, { duration: spring.duration, easing: spring.easing });
}

export function PainelGrid({
    widgets,
    breakpoint,
    getSource,
    editing = false,
    onWidgetsChange,
    onBeforeChange,
    onConfigureWidget,
}: PainelGridProps) {
    const gridRef = useRef<HTMLElement>(null);
    const gestureRef = useRef<PainelGesture | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState('');

    // Arrastar e redimensionar valem nas grades com coordenadas (desktop e tablet).
    // No celular os widgets são empilhados e a ordem muda pelos botões.
    const columns = PAINEL_COLUMNS[breakpoint];
    const canArrange = editing && breakpoint !== 'mobile' && onWidgetsChange !== undefined;
    const canChange = editing && onWidgetsChange !== undefined;

    // Valores mais recentes, lidos pelas funções estáveis entregues aos widgets.
    const latest = useRef({ widgets, columns, canArrange, onWidgetsChange, onBeforeChange });
    const configureRef = useRef(onConfigureWidget);
    useLayoutEffect(() => {
        latest.current = { widgets, columns, canArrange, onWidgetsChange, onBeforeChange };
        configureRef.current = onConfigureWidget;
    });

    // Posições de antes da última alteração, para animar cada widget do lugar
    // antigo até o novo (técnica FLIP).
    const snapshotRef = useRef<Map<string, Box> | null>(null);
    // Posições medidas depois da última mudança. Servem de "antes" para mudanças
    // que vêm de fora da grade (desfazer, adicionar widget, trocar de template).
    const lastBoxesRef = useRef(new Map<string, Box>());
    const animationsRef = useRef(new Map<Element, Animation>());

    // Com a janela redimensionada as posições guardadas deixam de valer.
    useEffect(() => {
        const forget = () => lastBoxesRef.current.clear();
        window.addEventListener('resize', forget);
        return () => window.removeEventListener('resize', forget);
    }, []);

    const snapshot = useCallback(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const boxes = new Map<string, Box>();
        grid.querySelectorAll<HTMLElement>('[data-painel-id]').forEach((element) => {
            boxes.set(element.dataset.painelId as string, pageBox(element));
        });
        snapshotRef.current = boxes;
    }, []);

    // Toda alteração passa por aqui: fotografa as posições atuais e entrega o novo arranjo.
    const commit = useCallback(
        (next: readonly PainelWidget[]) => {
            snapshot();
            latest.current.onWidgetsChange?.(next);
        },
        [snapshot],
    );

    // Faz o widget ativo acompanhar o ponteiro. Chamado a cada quadro e logo depois
    // que a grade muda, para o widget não "pular" quando a célula de destino troca.
    const applyGestureVisual = useCallback(() => {
        const gesture = gestureRef.current;
        if (!gesture?.started) return;

        const { element, lastDx: dx, lastDy: dy } = gesture;
        const reduced = prefersReducedMotion();

        if (gesture.kind === 'move') {
            const tx = gesture.startLeft + dx - element.offsetLeft;
            const ty = gesture.startTop + dy - element.offsetTop;
            const rotate = reduced ? 0 : gesture.tilt;
            const scale = reduced ? 1 : 1.025;
            element.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rotate}deg) scale(${scale})`;
            return;
        }

        const minimum = PAINEL_WIDGET_MIN_SIZE[gesture.widget.type];
        const minWidth = minimum.w * gesture.columnStep - gesture.columnGap;
        const maxWidth =
            (gesture.columns - gesture.widget.x) * gesture.columnStep - gesture.columnGap;
        const minHeight = minimum.h * gesture.rowStep - gesture.rowGap;
        const growsX = gesture.edge !== 's';
        const growsY = gesture.edge !== 'e';

        element.style.width = `${clamp(gesture.startWidth + (growsX ? dx : 0), minWidth, maxWidth)}px`;
        element.style.height = `${Math.max(minHeight, gesture.startHeight + (growsY ? dy : 0))}px`;
    }, []);

    const frameRef = useRef<() => void>(() => undefined);

    // Um quadro do gesto: rola a página perto das bordas, encaixa o widget na
    // célula mais próxima e atualiza a posição visual. Roda no ritmo da tela.
    const runFrame = useCallback(() => {
        const gesture = gestureRef.current;
        if (!gesture?.started) return;

        let scroll = 0;
        if (gesture.clientY < AUTO_SCROLL_EDGE) {
            scroll = -((AUTO_SCROLL_EDGE - gesture.clientY) / AUTO_SCROLL_EDGE) * AUTO_SCROLL_MAX;
        } else if (gesture.clientY > window.innerHeight - AUTO_SCROLL_EDGE) {
            scroll =
                ((gesture.clientY - (window.innerHeight - AUTO_SCROLL_EDGE)) / AUTO_SCROLL_EDGE) *
                AUTO_SCROLL_MAX;
        }
        if (scroll !== 0) window.scrollBy(0, scroll);

        const dx = gesture.clientX - gesture.startClientX + (window.scrollX - gesture.startScrollX);
        const dy = gesture.clientY - gesture.startClientY + (window.scrollY - gesture.startScrollY);

        // Inclinação suave na direção do movimento, como um cartão de verdade.
        const velocity = dx - gesture.lastDx;
        gesture.tilt += (clamp(velocity * 0.35, -5, 5) - gesture.tilt) * 0.18;
        gesture.lastDx = dx;
        gesture.lastDy = dy;

        const { widget, initialWidgets, columns: gridColumns } = gesture;
        const stepX = Math.round(dx / gesture.columnStep);
        const stepY = Math.round(dy / gesture.rowStep);
        const changed =
            gesture.kind === 'move'
                ? moveWidget(
                      initialWidgets,
                      widget.id,
                      widget.x + stepX,
                      widget.y + stepY,
                      gridColumns,
                  )
                : resizeWidget(
                      initialWidgets,
                      widget.id,
                      widget.w + (gesture.edge === 's' ? 0 : stepX),
                      widget.h + (gesture.edge === 'e' ? 0 : stepY),
                      gridColumns,
                  );
        const cell = cellKey(changed.find((item) => item.id === widget.id));

        if (cell !== gesture.lastCell) {
            gesture.lastCell = cell;
            // Os outros widgets abrem espaço para o que está sendo editado.
            commit(arrangeWidgets(changed, widget.id));
            navigator.vibrate?.(6);
        }

        applyGestureVisual();
        gesture.frame = requestAnimationFrame(() => frameRef.current());
    }, [applyGestureVisual, commit]);

    // Ouvintes da janela durante o gesto. São criados uma vez só, para poderem ser
    // removidos pela mesma referência, e chamam sempre a versão mais nova das funções.
    const finishRef = useRef<(cancelled: boolean) => void>(() => undefined);
    const startRef = useRef<() => void>(() => undefined);
    const listeners = useMemo(
        () => ({
            move(event: PointerEvent) {
                const gesture = gestureRef.current;
                if (!gesture || event.pointerId !== gesture.pointerId) return;

                gesture.clientX = event.clientX;
                gesture.clientY = event.clientY;

                if (!gesture.started) {
                    const distance = Math.hypot(
                        event.clientX - gesture.startClientX,
                        event.clientY - gesture.startClientY,
                    );
                    if (gesture.kind === 'move' && distance < DRAG_THRESHOLD) return;
                    startRef.current();
                }
            },
            up(event: PointerEvent) {
                if (event.pointerId === gestureRef.current?.pointerId) finishRef.current(false);
            },
            cancel(event: PointerEvent) {
                if (event.pointerId === gestureRef.current?.pointerId) finishRef.current(true);
            },
            key(event: KeyboardEvent) {
                if (event.key === 'Escape') finishRef.current(true);
            },
        }),
        [],
    );

    const startGesture = () => {
        const gesture = gestureRef.current;
        if (!gesture || gesture.started) return;

        gesture.started = true;
        latest.current.onBeforeChange?.();
        gesture.element.style.willChange = 'transform';
        document.body.style.cursor = gesture.kind === 'move' ? 'grabbing' : 'nwse-resize';
        document.body.style.userSelect = 'none';
        setActiveId(gesture.widget.id);
        gesture.frame = requestAnimationFrame(() => frameRef.current());
    };

    const finishGesture = (cancelled: boolean) => {
        const gesture = gestureRef.current;
        gestureRef.current = null;
        window.removeEventListener('pointermove', listeners.move);
        window.removeEventListener('pointerup', listeners.up);
        window.removeEventListener('pointercancel', listeners.cancel);
        window.removeEventListener('keydown', listeners.key);

        if (!gesture?.started) return;

        cancelAnimationFrame(gesture.frame);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        const { element } = gesture;
        const reduced = prefersReducedMotion();

        if (cancelled) {
            commit(gesture.initialWidgets);
        }

        if (gesture.kind === 'move') {
            // Solta o widget: ele sai de onde está o ponteiro e assenta na célula com
            // uma mola, partindo da inclinação e da escala que tinha no arrasto.
            const from = element.style.transform;
            element.style.transform = '';
            element.style.willChange = '';
            if (!reduced && from) {
                requestAnimationFrame(() => {
                    const settle = play(
                        element,
                        [{ transform: from }, { transform: 'none' }],
                        PAINEL_SPRING_DROP,
                    );
                    animationsRef.current.set(element, settle);
                });
            }
        } else {
            const fromWidth = element.style.width;
            const fromHeight = element.style.height;
            element.style.width = '';
            element.style.height = '';
            element.style.willChange = '';
            if (!reduced && fromWidth) {
                requestAnimationFrame(() => {
                    play(
                        element,
                        [
                            { width: fromWidth, height: fromHeight },
                            {
                                width: `${element.offsetWidth}px`,
                                height: `${element.offsetHeight}px`,
                            },
                        ],
                        PAINEL_SPRING_DROP,
                    );
                });
            }
        }

        const placed = latest.current.widgets.find((item) => item.id === gesture.widget.id);
        if (placed) {
            setAnnouncement(
                cancelled
                    ? `${placed.title} voltou para o lugar.`
                    : `${placed.title}: coluna ${placed.x + 1}, linha ${placed.y + 1}, ${placed.w} por ${placed.h}.`,
            );
        }
        setActiveId(null);
    };

    useLayoutEffect(() => {
        startRef.current = startGesture;
        finishRef.current = finishGesture;
        frameRef.current = runFrame;
    });

    const beginGesture = useCallback(
        (
            kind: PainelGesture['kind'],
            edge: PainelResizeEdge,
            id: string,
            event: ReactPointerEvent<HTMLElement>,
        ) => {
            const grid = gridRef.current;
            const { widgets: current, canArrange: allowed, columns: gridColumns } = latest.current;
            const widget = current.find((item) => item.id === id);
            const element = grid?.querySelector<HTMLElement>(
                `[data-painel-id="${CSS.escape(id)}"]`,
            );

            // Só o botão principal do mouse (ou o toque) inicia o gesto.
            if (!allowed || !grid || !widget || !element || event.button !== 0) return;
            if (gestureRef.current) return;

            event.preventDefault();

            const styles = window.getComputedStyle(grid);
            const columnGap = Number.parseFloat(styles.columnGap) || 0;
            const rowGap = Number.parseFloat(styles.rowGap) || 0;
            const rowHeight = Number.parseFloat(styles.gridAutoRows) || 0;

            gestureRef.current = {
                kind,
                edge,
                widget,
                element,
                pointerId: event.pointerId,
                started: false,
                startClientX: event.clientX,
                startClientY: event.clientY,
                startScrollX: window.scrollX,
                startScrollY: window.scrollY,
                clientX: event.clientX,
                clientY: event.clientY,
                startLeft: element.offsetLeft,
                startTop: element.offsetTop,
                startWidth: element.offsetWidth,
                startHeight: element.offsetHeight,
                columnStep: (grid.clientWidth + columnGap) / gridColumns,
                rowStep: rowHeight + rowGap,
                columnGap,
                rowGap,
                columns: gridColumns,
                initialWidgets: current,
                lastCell: cellKey(widget),
                lastDx: 0,
                lastDy: 0,
                tilt: 0,
                frame: 0,
            };

            window.addEventListener('pointermove', listeners.move);
            window.addEventListener('pointerup', listeners.up);
            window.addEventListener('pointercancel', listeners.cancel);
            window.addEventListener('keydown', listeners.key);

            // O redimensionamento começa no toque, sem esperar o ponteiro andar.
            if (kind === 'resize') startRef.current();
        },
        [listeners],
    );

    // Libera a janela se a grade sair da tela no meio de um gesto.
    useEffect(() => () => finishRef.current(true), []);

    // Depois de cada mudança na grade: cada widget que mudou de lugar desliza da
    // posição antiga até a nova com uma mola, e o widget ativo continua colado no ponteiro.
    useLayoutEffect(() => {
        const grid = gridRef.current;
        const before =
            snapshotRef.current ?? (lastBoxesRef.current.size > 0 ? lastBoxesRef.current : null);
        snapshotRef.current = null;
        applyGestureVisual();
        if (!grid) return;

        const measured = new Map<string, Box>();
        const reduced = prefersReducedMotion();

        grid.querySelectorAll<HTMLElement>('[data-painel-id]').forEach((element) => {
            const id = element.dataset.painelId as string;
            if (id === gestureRef.current?.widget.id && gestureRef.current.started) return;

            const old = before?.get(id);
            const running = animationsRef.current.get(element);
            const now = pageBox(element);
            measured.set(id, now);

            if (!before || reduced) return;
            if (old && Math.abs(old.left - now.left) < 0.5 && Math.abs(old.top - now.top) < 0.5) {
                if (
                    Math.abs(old.width - now.width) < 0.5 &&
                    Math.abs(old.height - now.height) < 0.5
                )
                    return;
            }
            running?.cancel();
            const settled = running ? pageBox(element) : now;
            if (running) measured.set(id, settled);

            if (!old) {
                // Widget que acabou de entrar: surge crescendo do lugar dele.
                if (id !== GHOST_ID && before.size > 0) {
                    play(
                        element,
                        [
                            { opacity: 0, transform: 'scale(0.92)' },
                            { opacity: 1, transform: 'none' },
                        ],
                        PAINEL_SPRING_DROP,
                    );
                }
                return;
            }

            const dx = old.left - settled.left;
            const dy = old.top - settled.top;
            const sx = old.width / (settled.width || 1);
            const sy = old.height / (settled.height || 1);
            const resized = Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && !resized) return;

            // O conteúdo dos widgets não é esticado; só o marcador de destino muda de escala.
            const scale = id === GHOST_ID && resized ? ` scale(${sx}, ${sy})` : '';
            const animation = play(
                element,
                [
                    {
                        transform: `translate(${dx}px, ${dy}px)${scale}`,
                        transformOrigin: 'top left',
                    },
                    { transform: 'none', transformOrigin: 'top left' },
                ],
                PAINEL_SPRING_LAYOUT,
            );
            animationsRef.current.set(element, animation);
            animation.onfinish = () => animationsRef.current.delete(element);
        });

        lastBoxesRef.current = measured;
    }, [widgets, activeId, applyGestureVisual]);

    // Teclado: setas movem o widget em foco uma célula; com Shift, redimensionam.
    const handleKeyDown = useCallback(
        (id: string, event: ReactKeyboardEvent<HTMLElement>) => {
            const steps: Record<string, [number, number]> = {
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
            };
            const step = steps[event.key];
            const { widgets: current, columns: gridColumns, canArrange: allowed } = latest.current;
            const widget = current.find((item) => item.id === id);
            if (!step || !widget || !allowed || event.target !== event.currentTarget) return;

            event.preventDefault();
            const [dx, dy] = step;
            const changed = event.shiftKey
                ? resizeWidget(current, id, widget.w + dx, widget.h + dy, gridColumns)
                : moveWidget(current, id, widget.x + dx, widget.y + dy, gridColumns);
            const arranged = arrangeWidgets(changed, id);
            const placed = arranged.find((item) => item.id === id);
            if (!placed || cellKey(placed) === cellKey(widget)) return;

            latest.current.onBeforeChange?.();
            commit(arranged);
            setAnnouncement(
                `${placed.title}: coluna ${placed.x + 1}, linha ${placed.y + 1}, ${placed.w} por ${placed.h}.`,
            );
        },
        [commit],
    );

    const handlers = useMemo<PainelCardHandlers>(
        () => ({
            onPointerDown: (id, event) => {
                if ((event.target as Element).closest(INTERACTIVE)) return;
                beginGesture('move', 'se', id, event);
            },
            onResizeStart: (id, edge, event) => {
                event.stopPropagation();
                beginGesture('resize', edge, id, event);
            },
            onKeyDown: handleKeyDown,
            onConfigure: (id) => {
                const widget = latest.current.widgets.find((item) => item.id === id);
                if (widget) configureRef.current?.(widget);
            },
            onRemove: (id) => {
                const { widgets: current, columns: gridColumns } = latest.current;
                latest.current.onBeforeChange?.();
                commit(
                    // No celular não há posições a reorganizar: o widget só sai da pilha.
                    gridColumns === PAINEL_COLUMNS.mobile
                        ? current.filter((item) => item.id !== id)
                        : removeWidget(current, id),
                );
            },
            onShift: (id, direction) => {
                latest.current.onBeforeChange?.();
                commit(shiftWidget(latest.current.widgets, id, direction));
            },
        }),
        [beginGesture, handleKeyDown, commit],
    );

    if (widgets.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
                {editing
                    ? 'O painel está vazio. Use "Adicionar widget" para escolher um widget do catálogo.'
                    : 'O painel está vazio. Clique em "Editar layout" e depois em "Adicionar widget" para montar o seu.'}
            </p>
        );
    }

    const activeWidget = activeId ? widgets.find((widget) => widget.id === activeId) : undefined;

    return (
        <section
            ref={gridRef}
            aria-label="Widgets do painel"
            data-editing={editing}
            className="relative grid auto-rows-[4.875rem] grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12"
        >
            {activeWidget && (
                <>
                    {/* Colunas da grade, para mostrar onde o widget pode encaixar. */}
                    <div
                        aria-hidden="true"
                        className="painel-guides pointer-events-none absolute inset-0 grid grid-cols-6 gap-3 lg:grid-cols-12"
                    >
                        {Array.from({ length: columns }, (_, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-emerald-400/10 bg-emerald-400/[0.035]"
                            />
                        ))}
                    </div>

                    {/* Marcador de destino: onde o widget vai ficar ao soltar. */}
                    <div
                        aria-hidden="true"
                        data-painel-id={GHOST_ID}
                        style={{
                            gridColumn: `${activeWidget.x + 1} / span ${activeWidget.w}`,
                            gridRow: `${activeWidget.y + 1} / span ${activeWidget.h}`,
                        }}
                        className="painel-ghost pointer-events-none relative flex items-center justify-center rounded-xl border-2 border-dashed border-emerald-400/70 bg-emerald-400/10"
                    >
                        <span className="rounded-full bg-background/80 px-3 py-1 font-mono text-sm font-semibold text-emerald-300 tabular-nums">
                            {activeWidget.w} × {activeWidget.h}
                        </span>
                    </div>
                </>
            )}

            {widgets.map((widget, index) => (
                <PainelWidgetCard
                    key={widget.id}
                    widget={widget}
                    source={getSource(widget)}
                    editing={editing}
                    arrangeable={canArrange}
                    active={widget.id === activeId}
                    reorderable={canChange && breakpoint === 'mobile'}
                    canMoveUp={index > 0}
                    canMoveDown={index < widgets.length - 1}
                    handlers={handlers}
                />
            ))}

            <p aria-live="polite" className="sr-only">
                {announcement}
            </p>
        </section>
    );
}
