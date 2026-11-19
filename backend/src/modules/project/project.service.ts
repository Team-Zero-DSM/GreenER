import type { ProjectRepository } from './project.repository.js';
import type { MemberAccess, MembersQuery } from './project.schema.js';

export class ProjectService {
    constructor(private readonly repository: ProjectRepository) {}

    listMembers(query: MembersQuery) {
        return this.repository.listMembers(query);
    }

    updateMember(id: string, actor: string, access: MemberAccess) {
        return this.repository.updateMember(id, actor, access);
    }
}
