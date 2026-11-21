import { afterEach, describe, expect, it, vi } from 'vitest';
import { fallbackInterval, readCollectionInterval } from '../../../src/jobs/collection-interval.js';
import { ProjectRepository } from '../../../src/modules/project/project.repository.js';

describe('Intervalo da coleta', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    it('usa o intervalo da variável de ambiente', () => {
        vi.stubEnv('COLLECTION_INTERVAL_SECONDS', '45');

        expect(fallbackInterval()).toBe(45);
    });

    it('usa trinta segundos quando o valor do ambiente é inválido', () => {
        vi.stubEnv('COLLECTION_INTERVAL_SECONDS', 'abc');

        expect(fallbackInterval()).toBe(30);
    });

    it('usa o intervalo salvo no banco', async () => {
        vi.spyOn(ProjectRepository.prototype, 'getInterval').mockResolvedValue(90);

        expect(await readCollectionInterval(30)).toBe(90);
    });

    it('usa o ambiente quando não há configuração no banco', async () => {
        vi.stubEnv('COLLECTION_INTERVAL_SECONDS', '45');
        vi.spyOn(ProjectRepository.prototype, 'getInterval').mockResolvedValue(undefined);

        expect(await readCollectionInterval(30)).toBe(45);
    });

    it('mantém o intervalo anterior quando a consulta falha', async () => {
        vi.spyOn(ProjectRepository.prototype, 'getInterval').mockRejectedValue(
            new Error('Banco indisponível'),
        );
        vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(await readCollectionInterval(120)).toBe(120);
    });
});
