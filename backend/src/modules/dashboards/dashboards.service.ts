import type { DashboardsRepository } from './dashboards.repository.js';
import type { DashboardConfig } from './types/dashboards.types.js';

export class DashboardsService {
    constructor(private readonly repository: DashboardsRepository) {}

    // Painel salvo do usuário, ou null quando ele ainda não salvou nenhum.
    async getMine(userId: string): Promise<{ dashboard: DashboardConfig | null }> {
        return { dashboard: await this.repository.findByUser(userId) };
    }

    // Grava a configuração (já validada pela rota) e devolve o painel salvo.
    async saveMine(
        userId: string,
        config: DashboardConfig,
    ): Promise<{ dashboard: DashboardConfig }> {
        return { dashboard: await this.repository.upsert(userId, config) };
    }
}
