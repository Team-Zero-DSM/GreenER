import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startCollectionJob, stopCollectionJob } from '../../../src/jobs/collections.job.js';
import { runCollectionRound } from '../../../src/modules/collections/collections.service.js';

vi.mock('../../../src/modules/collections/collections.service.js', () => ({
    runCollectionRound: vi.fn(),
}));

describe('Rotina periódica de coletas (collections.job)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        stopCollectionJob();
        vi.useRealTimers();
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
});

