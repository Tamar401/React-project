import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import * as usersController from '../controllers/usersController';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), usersController.list);
router.get('/:id', requireAuth, requireRole('admin'), usersController.getOne);
router.post('/', requireAuth, requireRole('admin'), usersController.create);

export default router;
