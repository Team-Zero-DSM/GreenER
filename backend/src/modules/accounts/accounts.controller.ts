import { AccountCredentials, RegisterInput } from './accounts.schema.js';
import { AccountsService } from './accounts.service.js';
import type { Request, Response } from 'express';

export class AccountsController {
    constructor(private readonly service: AccountsService) {}

    register = async (req: Request, res: Response) => {
        const account = await this.service.register(req.body as RegisterInput);

        res.status(201).json(account);
    };

    login = async (req: Request, res: Response) => {
        res.json(await this.service.login(req.body as AccountCredentials));
    };
    forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body as { email: string };
        await this.service.requestPasswordReset(email);
        res.status(202).json({
            message: 'Se houver uma conta ativa, enviaremos um link de redefinição.',
        });
    };
}
