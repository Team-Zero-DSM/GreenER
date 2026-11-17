import type { NextFunction, Request, Response } from 'express';
import { accountFrom } from '../../shared/middleware/auth.js';
import type { DashboardConfigInput } from './dashboards.schema.js';
import type { DashboardsService } from './dashboards.service.js';

export class DashboardsController {
    constructor(private readonly service: DashboardsService) {}

    getMine = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.service.getMine(accountFrom(res).id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    saveMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const config = req.body as DashboardConfigInput;
            const result = await this.service.saveMine(accountFrom(res).id, config);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
