import {
  createTransaction,
  deleteTransaction,
  readAllTransactions,
  readTransaction,
  updateTransaction,
} from '@/controllers/transaction.controller';
import { requireAuth } from '@/middlewares/require-auth';
import { Router } from 'express';

const router = Router();

router.post('/', requireAuth, createTransaction);

router.get('/', requireAuth, readAllTransactions);

router.get('/:id', requireAuth, readTransaction);

router.put('/:id', requireAuth, updateTransaction);

router.delete('/:id', requireAuth, deleteTransaction);

export default router;
