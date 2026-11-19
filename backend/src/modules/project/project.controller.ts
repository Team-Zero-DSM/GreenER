import type { Request, Response } from 'express';
import { accountFrom } from '../../shared/middleware/auth.js';
import type { MemberAccess, MembersQuery } from './project.schema.js';
import type { ProjectService } from './project.service.js';

export class ProjectController {
    constructor(private readonly service: ProjectService) {}

    listMembers = async (req: Request, res: Response) => {
        res.json(await this.service.listMembers(req.query as unknown as MembersQuery));
    };

    updateMember = async (req: Request<{ id: string }>, res: Response) => {
        res.json(
            await this.service.updateMember(
                req.params.id,
                accountFrom(res).id,
                req.body as MemberAccess,
            ),
        );
    };
}
