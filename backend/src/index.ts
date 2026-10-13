import { Router } from 'express';
import { servicesRouter } from './modules/services/services.routes.js';
import analyticsRouter from './modules/analytics/analytics.routes.js';

const router = Router();
router.use('/service', servicesRouter);
router.use('/service', analyticsRouter);
export default router;
