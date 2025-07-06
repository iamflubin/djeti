import { Router } from 'express';
import authRoutes from './auth.route';
import metricsRoutes from './metrics.route';
const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/metrics', metricsRoutes);

export default router;
