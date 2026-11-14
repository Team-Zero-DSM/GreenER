import { Router } from 'express';
import { pool } from '../../db/connection.js';
import { AccountsController } from './accounts.controller.js';
import { AccountsRepository } from './accounts.repository.js';
import { AccountsService } from './accounts.service.js';
import { credentialsSchema, registerSchema } from './accounts.schema.js';
import { validate } from '../../shared/middleware/validate.js';

const controller = new AccountsController(new AccountsService(new AccountsRepository(pool)));

export const accountsRouter = Router();

accountsRouter.post('/auth/register', validate(registerSchema), controller.register);
accountsRouter.post('/auth/login', validate(credentialsSchema), controller.login);
