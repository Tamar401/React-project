import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as user from '../controllers/usersController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', user.create);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.me);

export default router;
