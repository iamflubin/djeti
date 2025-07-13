import { Router } from 'express';
import authRoutes from './auth.route';
import transactionRoutes from './transaction.route';
const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/transactions', transactionRoutes);

export default router;
