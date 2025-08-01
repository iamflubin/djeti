import { Router } from 'express';
import authRoutes from './auth.route';
import dashboardRoutes from './dashboard.route';
import transactionRoutes from './transaction.route';

const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/transactions', transactionRoutes);
router.use('/v1/dashboard', dashboardRoutes);

export default router;
