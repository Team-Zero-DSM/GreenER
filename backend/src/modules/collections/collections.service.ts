import { CarbonClient } from '../../integrations/carbon-api.js';
import { MetricsClient } from '../../integrations/metrics-api.js';
import { CollectionsRepository } from './collections.repository.js';

export class CollectionsService {
    constructor(
        private readonly repository: CollectionsRepository,
        private readonly carbon: CarbonClient,
        private readonly metrics: MetricsClient,
    ) {}

    async syncRegions(): Promise<void> {
        const response = await this.carbon.getRegions();

        for (const region of response.regions) {
            try {
                if (await this.repository.existsByCode(region.code)) {
                    await this.repository.updateRegion(region);
                } else {
                    await this.repository.createRegion(region);
                }
            } catch (err) {
                console.error(`Falha ao sincronizar região ${region.code}:`, err);
            }
        }
    }
}
