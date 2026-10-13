import { Router } from 'express';
import { servicesRouter } from './modules/services/services.routes.js';

const router = Router();
router.use('/service', servicesRouter);
export default router;
