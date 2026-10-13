import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as collectionsService from '../modules/collections/collections.service.js';
import { startCollectionJob, stopCollectionJob } from './collections.job.js';

vi.mock('../modules/collections/collections.service.js', () => ({
    runCollectionRound: vi.fn(),
}));

const mockRunRound = vi.mocked(collectionsService.runCollectionRound);

const INTERVAL_MS = 30_000;

beforeEach(() => {
    vi.useFakeTimers();
    vi.resetAllMocks();
    mockRunRound.mockResolvedValue(0);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    delete process.env.COLLECTION_INTERVAL_SECONDS;
});

afterEach(() => {
    stopCollectionJob();
    vi.restoreAllMocks();
    vi.useRealTimers();
    delete process.env.COLLECTION_INTERVAL_SECONDS;
});

describe('job de coleta periódica', () => {
    describe('rotina periódica', () => {
        it('inicia a primeira rodada imediatamente ao chamar startCollectionJob', () => {
            startCollectionJob();

            expect(mockRunRound).toHaveBeenCalledTimes(1);
        });

        it('executa rodadas a cada intervalo configurado, sem reinício manual', async () => {
            startCollectionJob();
            expect(mockRunRound).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(2);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(3);
        });

        it('não executa nova rodada antes do fim do intervalo', async () => {
            startCollectionJob();
            expect(mockRunRound).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS - 1);
            expect(mockRunRound).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(1);
            expect(mockRunRound).toHaveBeenCalledTimes(2);
        });

        it('usa o intervalo de COLLECTION_INTERVAL_SECONDS quando definido', async () => {
            process.env.COLLECTION_INTERVAL_SECONDS = '5';

            startCollectionJob();

            await vi.advanceTimersByTimeAsync(4_999);
            expect(mockRunRound).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(1);
            expect(mockRunRound).toHaveBeenCalledTimes(2);

            await vi.advanceTimersByTimeAsync(5_000);
            expect(mockRunRound).toHaveBeenCalledTimes(3);
        });

        it.each(['abc', '0', '-3', ''])(
            'usa o padrão de 30 s quando COLLECTION_INTERVAL_SECONDS é inválido (%s)',
            async (valor) => {
                process.env.COLLECTION_INTERVAL_SECONDS = valor;

                startCollectionJob();

                await vi.advanceTimersByTimeAsync(INTERVAL_MS - 1);
                expect(mockRunRound).toHaveBeenCalledTimes(1);

                await vi.advanceTimersByTimeAsync(1);
                expect(mockRunRound).toHaveBeenCalledTimes(2);
            },
        );
    });

    describe('resiliência da rotina', () => {
        it('falha em uma rodada não interrompe as rodadas seguintes', async () => {
            mockRunRound.mockRejectedValueOnce(new Error('falha simulada'));

            startCollectionJob();
            expect(mockRunRound).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(2);
            expect(console.error).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(3);
        });

        it('stopCollectionJob impede novas rodadas', async () => {
            startCollectionJob();
            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(2);

            stopCollectionJob();

            await vi.advanceTimersByTimeAsync(INTERVAL_MS * 3);
            expect(mockRunRound).toHaveBeenCalledTimes(2);
        });

        it('startCollectionJob após stop retoma a rotina', async () => {
            startCollectionJob();
            stopCollectionJob();
            startCollectionJob();

            expect(mockRunRound).toHaveBeenCalledTimes(2);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(3);
        });

        it('startCollectionJob chamado duas vezes não duplica a rotina', async () => {
            startCollectionJob();
            startCollectionJob();

            expect(mockRunRound).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(2);
        });

        it('stop durante rodada em andamento não agenda a próxima rodada', async () => {
            let liberarRodada: ((coletados: number) => void) | undefined;
            mockRunRound.mockImplementationOnce(
                () =>
                    new Promise<number>((resolve) => {
                        liberarRodada = resolve;
                    }),
            );

            startCollectionJob();
            expect(mockRunRound).toHaveBeenCalledTimes(1);

            stopCollectionJob();
            liberarRodada?.(0);

            await vi.advanceTimersByTimeAsync(INTERVAL_MS);
            expect(mockRunRound).toHaveBeenCalledTimes(1);
        });
    });
});
