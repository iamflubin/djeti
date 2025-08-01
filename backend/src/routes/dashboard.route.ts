import {
  getBudget,
  getExpensesDistribution,
  getSummary,
} from '@/controllers/dashboard.controller';
import { requireAuth } from '@/middlewares/require-auth';
import { Router } from 'express';

const route = Router();

route.get('/summary', requireAuth, getSummary);
route.get('/budget', requireAuth, getBudget);
route.get('/expenses-distribution', requireAuth, getExpensesDistribution);

export default route;
