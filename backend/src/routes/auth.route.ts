import {
  login,
  logout,
  refreshToken,
  register,
} from '@/controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;
