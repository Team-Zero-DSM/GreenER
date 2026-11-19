import type { PainelConfig, PainelWidget } from '@/types/painel';

// Cópia da configuração do painel guardada no navegador, usada enquanto as rotas
// de persistência do backend não respondem.
const STORAGE_KEY = 'greener:painel:config';

function isWidget(value: unknown): value is PainelWidget {
    if (typeof value !== 'object' || value === null) return false;

    const widget = value as Record<string, unknown>;

    return (
        typeof widget.id === 'string' &&
        typeof widget.type === 'string' &&
        typeof widget.title === 'string' &&
        ['x', 'y', 'w', 'h'].every((key) => Number.isInteger(widget[key]))
    );
}

// Devolve null quando não há nada guardado ou o conteúdo não tem o formato esperado.
export function readStoredPainelConfig(): PainelConfig | null {
    try {
        const stored: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');

        if (typeof stored !== 'object' || stored === null) return null;

        const { template, widgets } = stored as Record<string, unknown>;

        if (typeof template !== 'string' || !Array.isArray(widgets) || !widgets.every(isWidget)) {
            return null;
        }

        return stored as PainelConfig;
    } catch {
        // JSON inválido ou armazenamento bloqueado pelo navegador.
        return null;
    }
}

export function writeStoredPainelConfig(config: PainelConfig): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
        // Sem espaço ou armazenamento bloqueado: o painel segue só na memória.
    }
}
