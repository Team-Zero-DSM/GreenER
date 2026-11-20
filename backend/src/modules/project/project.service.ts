import type { ProjectRepository } from './project.repository.js';
import type { MemberAccess, MembersQuery } from './project.schema.js';
import type { MonitoringService } from '../monitoring/monitoring.service.js';

export class ProjectService {
    constructor(
        private readonly repository: ProjectRepository,
        private readonly monitoring: MonitoringService,
    ) {}

    async collectionSettings() {
        const intervalSeconds = await this.repository.getInterval();
        const monitoring = this.monitoring.getStatus();
        return {
            intervalSeconds: intervalSeconds ?? monitoring.collectionIntervalSeconds,
            effectiveIntervalSeconds: monitoring.collectionIntervalSeconds,
            lastRoundAt: monitoring.lastRoundFinishedAt,
            nextRoundAt: monitoring.nextCollectionAt,
        };
    }

    async updateInterval(intervalSeconds: number, actor: string) {
        await this.repository.updateInterval(intervalSeconds, actor);
        return { intervalSeconds };
    }

    listMembers(query: MembersQuery) {
        return this.repository.listMembers(query);
    }

    updateMember(id: string, actor: string, access: MemberAccess) {
        return this.repository.updateMember(id, actor, access);
    }
}
