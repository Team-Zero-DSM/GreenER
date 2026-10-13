import { runCollectionRound } from '../modules/collections/collections.service.js';

const DEFAULT_INTERVAL_SECONDS = 30;

let timer: NodeJS.Timeout | undefined;
let started = false;
let session = 0;

function intervalMs(): number {
    const parsed = Number(process.env.COLLECTION_INTERVAL_SECONDS);
    const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_INTERVAL_SECONDS;
    return seconds * 1000;
}

async function tick(): Promise<void> {
    const currentSession = session;
    timer = undefined;
    console.log('[collection] rodada iniciada');
    try {
        const collected = await runCollectionRound();
        console.log(`[collection] rodada concluída: ${collected} serviço(s) coletado(s)`);
    } catch (err) {
        console.error('[collection] rodada abortada:', err);
    } finally {
        if (started && currentSession === session) {
            timer = setTimeout(tick, intervalMs());
        }
    }
}

export function startCollectionJob(): void {
    if (started) return;
    started = true;
    void tick();
}

export function stopCollectionJob(): void {
    started = false;
    session += 1;
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
    }
}
