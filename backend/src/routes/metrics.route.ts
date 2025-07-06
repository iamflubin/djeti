import { getSummary } from '@/controllers/metrics.controller';
import { requireAuth } from '@/middlewares/require-auth';
import { Router } from 'express';

const router = Router();

router.get('/summary', requireAuth, getSummary);

export default router;
