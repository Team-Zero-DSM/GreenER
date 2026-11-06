import { describe, it, expect } from 'vitest';
import { listServicesQuerySchema } from '../../../../src/modules/services/services.schema.js';

describe('Validação de entradas (services)', () => {
    it('deve rejeitar um valor inválido no filtro active', () => {
        const result = listServicesQuerySchema.safeParse({ active: 'talvez' });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toEqual(
            expect.arrayContaining([expect.objectContaining({ path: ['active'] })]),
        );
    });
});
