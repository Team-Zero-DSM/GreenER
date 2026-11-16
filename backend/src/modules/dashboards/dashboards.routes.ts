import { Router } from 'express';
import { pool } from '../../db/connection.js';
import { requireAccount } from '../../shared/middleware/auth.js';
import { validate } from '../../shared/middleware/validate.js';
import { DashboardsController } from './dashboards.controller.js';
import { DashboardsRepository } from './dashboards.repository.js';
import { dashboardConfigSchema } from './dashboards.schema.js';
import { DashboardsService } from './dashboards.service.js';

const repository = new DashboardsRepository(pool);
const service = new DashboardsService(repository);
const controller = new DashboardsController(service);

export const dashboardsRouter = Router();

dashboardsRouter.get('/me', requireAccount, controller.getMine);
dashboardsRouter.put('/me', requireAccount, validate(dashboardConfigSchema), controller.saveMine);
