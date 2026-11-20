import type { Request, Response } from 'express';
import type { ReportFilters } from './reports.schema.js';
import type { ReportsService } from './reports.service.js';

export class ReportsController {
    constructor(private readonly service: ReportsService) {}

    preview = async (req: Request, res: Response) => {
        res.json(await this.service.preview(req.body as ReportFilters));
    };
}
