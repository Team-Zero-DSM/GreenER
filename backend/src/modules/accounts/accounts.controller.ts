import { accountFrom } from '../../shared/middleware/auth.js';
import {
    AccountCredentials,
    ChangePasswordInput,
    ProfileInput,
    RegisterInput,
    ResetPasswordInput,
} from './accounts.schema.js';
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

    resetPassword = async (req: Request, res: Response) => {
        await this.service.resetPassword(req.body as ResetPasswordInput);
        res.sendStatus(204);
    };

    profile = (_req: Request, res: Response) => {
        const { id, name, email, role } = accountFrom(res);
        res.json({ id, name, email, role });
    };
    updateProfile = async (req: Request, res: Response) => {
        res.json(await this.service.updateProfile(accountFrom(res).id, req.body as ProfileInput));
    };

    changePassword = async (req: Request, res: Response) => {
        res.json(
            await this.service.changePassword(accountFrom(res).id, req.body as ChangePasswordInput),
        );
    };
}
