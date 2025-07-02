import { Router } from 'express';
import authRoutes from './auth.route';

const router = Router();

router.use('/v1/auth', authRoutes);

export default router;
