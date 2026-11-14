import { RegisterInput } from './accounts.schema.js';
import { AccountsService } from './accounts.service.js';
import type { Request, Response } from 'express';

export class AccountsController {
    constructor(private readonly service: AccountsService) {}

    register = async (req: Request, res: Response) => {
        const account = await this.service.register(req.body as RegisterInput);

        res.status(201).json(account);
    };
}
