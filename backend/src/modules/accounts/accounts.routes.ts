import { Router } from 'express';
import { pool } from '../../db/connection.js';
import { AccountsController } from './accounts.controller.js';
import { AccountsRepository } from './accounts.repository.js';
import { AccountsService } from './accounts.service.js';
import {
    changePasswordSchema,
    credentialsSchema,
    forgotPasswordSchema,
    profileSchema,
    registerSchema,
    resetPasswordSchema,
} from './accounts.schema.js';
import { validate } from '../../shared/middleware/validate.js';
import { throttle } from '../../shared/middleware/throttle.js';
import { requireAccount } from '../../shared/middleware/auth.js';

const controller = new AccountsController(new AccountsService(new AccountsRepository(pool)));

export const accountsRouter = Router();

accountsRouter.post('/auth/register', throttle(15), validate(registerSchema), controller.register);
accountsRouter.post('/auth/login', throttle(30), validate(credentialsSchema), controller.login);
accountsRouter.post(
    '/auth/forgot-password',
    throttle(10),
    validate(forgotPasswordSchema),
    controller.forgotPassword,
);

accountsRouter.post(
    '/auth/reset-password',
    throttle(20),
    validate(resetPasswordSchema),
    controller.resetPassword,
);

accountsRouter.get('/profile', requireAccount, controller.profile);
accountsRouter.patch('/profile', requireAccount, validate(profileSchema), controller.updateProfile);
accountsRouter.patch(
    '/profile/password',
    requireAccount,
    validate(changePasswordSchema),
    controller.changePassword,
);
