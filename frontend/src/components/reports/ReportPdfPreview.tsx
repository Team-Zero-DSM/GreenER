import { useEffect, useRef, useState } from 'react';
import {
    getDocument,
    GlobalWorkerOptions,
    type PDFDocumentLoadingTask,
    type PDFDocumentProxy,
    type RenderTask,
} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { SECONDARY_ACTION_BUTTON_CLASS_NAME } from '@/components/shared/actionButtonStyles';

GlobalWorkerOptions.workerSrc = workerUrl;

function PreviewError({ onRetry }: { onRetry: () => void }) {
    return (
        <div role="alert" className="grid justify-items-start gap-3 p-4">
            <p className="text-sm text-destructive">
                Não foi possível exibir a prévia do relatório.
            </p>
            <button type="button" className={SECONDARY_ACTION_BUTTON_CLASS_NAME} onClick={onRetry}>
                Tentar de novo
            </button>
        </div>
    );
}

function ReportPage({
    document,
    number,
    onRetry,
}: {
    document: PDFDocumentProxy;
    number: number;
    onRetry: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(0);
    const [rendered, setRendered] = useState<{
        width: number;
        text: string;
        error: boolean;
    } | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver(([entry]) => {
            setWidth(Math.round(entry.contentRect.width));
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !width) return;
        let active = true;
        let task: RenderTask | undefined;

        async function render() {
            const page = await document.getPage(number);
            if (!active) return;
            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: width / base.width });
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas!.width = Math.ceil(viewport.width * ratio);
            canvas!.height = Math.ceil(viewport.height * ratio);
            task = page.render({
                canvas: canvas!,
                viewport,
                transform: [ratio, 0, 0, ratio, 0, 0],
            });
            const [, content] = await Promise.all([task.promise, page.getTextContent()]);
            if (!active) return;
            const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
            setRendered({ width, text, error: false });
        }

        render().catch(() => {
            if (active) setRendered({ width, text: '', error: true });
        });
        return () => {
            active = false;
            task?.cancel();
        };
    }, [document, number, width]);

    const ready = rendered?.width === width && width > 0;

    return (
        <div
            ref={containerRef}
            className="relative min-w-0 overflow-hidden rounded-sm bg-white shadow-2xl shadow-black/40"
            aria-busy={!ready}
        >
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Página ${number} de ${document.numPages} do relatório`}
                className={`block h-auto w-full ${ready && !rendered.error ? '' : 'invisible'}`}
            />
            {ready && rendered.error ? (
                <PreviewError onRetry={onRetry} />
            ) : !ready ? (
                <p
                    role="status"
                    className="absolute inset-0 grid place-items-center text-sm text-[#60756b]"
                >
                    Preparando página {number}...
                </p>
            ) : (
                <p className="sr-only">{rendered.text}</p>
            )}
        </div>
    );
}

interface LoadedPdf {
    blob: Blob;
    document: PDFDocumentProxy | null;
    error: boolean;
}

// As páginas fazem parte da tela, sem controles ou rolagem interna de um leitor de PDF.
export default function ReportPdfPreview({ blob, onRetry }: { blob: Blob; onRetry: () => void }) {
    const [loaded, setLoaded] = useState<LoadedPdf | null>(null);

    useEffect(() => {
        let active = true;
        let task: PDFDocumentLoadingTask | undefined;
        async function load() {
            const data = new Uint8Array(await blob.arrayBuffer());
            if (!active) return;
            task = getDocument({ data });
            const document = await task.promise;
            if (active) setLoaded({ blob, document, error: false });
        }
        load().catch(() => {
            if (active) setLoaded({ blob, document: null, error: true });
        });
        return () => {
            active = false;
            void task?.destroy();
        };
    }, [blob]);

    const current = loaded?.blob === blob ? loaded : null;
    if (current?.error) return <PreviewError onRetry={onRetry} />;
    if (!current?.document) {
        return (
            <p role="status" className="text-muted-foreground">
                Preparando prévia...
            </p>
        );
    }
    const document = current.document;

    return (
        <article
            id="report-sheet"
            aria-label="Prévia do PDF do relatório"
            className="mx-auto grid w-full max-w-4xl gap-5"
        >
            {Array.from({ length: document.numPages }, (_, index) => (
                <ReportPage
                    key={`${document.fingerprints[0]}-${index}`}
                    document={document}
                    number={index + 1}
                    onRetry={onRetry}
                />
            ))}
        </article>
    );
}
