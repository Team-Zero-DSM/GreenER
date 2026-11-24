import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startCollectionJob, stopCollectionJob } from '../../../src/jobs/collections.job.js';
import { runCollectionRound } from '../../../src/modules/collections/collections.service.js';
import { readCollectionInterval } from '../../../src/jobs/collection-interval.js';

vi.mock('../../../src/modules/collections/collections.service.js', () => ({
    runCollectionRound: vi.fn(),
}));

vi.mock('../../../src/jobs/collection-interval.js', () => ({
    fallbackInterval: () => 30,
    readCollectionInterval: vi.fn(async (previous: number) => previous),
}));

describe('Rotina periódica de coletas (collections.job)', () => {
    beforeEach(() => {
        vi.stubEnv('COLLECTION_INTERVAL_SECONDS', '30');
        vi.useFakeTimers();
        vi.clearAllMocks();
        vi.mocked(readCollectionInterval).mockImplementation(async (previous) => previous);
    });

    afterEach(() => {
        stopCollectionJob();
        vi.useRealTimers();
        vi.unstubAllEnvs();
    });

    it('deve realizar múltiplas coletas periodicamente sem depender de reinicialização da aplicação', async () => {
        vi.mocked(runCollectionRound).mockResolvedValue(1);

        startCollectionJob();
        await vi.advanceTimersByTimeAsync(0);

        // Inicia coletas
        expect(runCollectionRound).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(30_000);

        expect(runCollectionRound).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(3);
    });

    it('deve interromper o agendamento de novas coletas quando stopCollectionJob for chamado', async () => {
        vi.mocked(runCollectionRound).mockResolvedValue(1);

        startCollectionJob();
        await vi.advanceTimersByTimeAsync(0);
        expect(runCollectionRound).toHaveBeenCalledTimes(1);

        stopCollectionJob();

        await vi.advanceTimersByTimeAsync(60_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(1);
    });

    it('deve aplicar o intervalo de sessenta segundos retornado pela configuração', async () => {
        vi.mocked(runCollectionRound).mockResolvedValue(1);
        vi.mocked(readCollectionInterval).mockResolvedValue(60);

        startCollectionJob();
        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(30_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(2);
    });

    it('deve aplicar um novo intervalo na próxima rodada', async () => {
        vi.mocked(runCollectionRound).mockResolvedValue(1);
        vi.mocked(readCollectionInterval).mockResolvedValue(30);

        startCollectionJob();
        await vi.advanceTimersByTimeAsync(0);
        vi.mocked(readCollectionInterval).mockResolvedValue(60);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(runCollectionRound).toHaveBeenCalledTimes(3);
    });
});
