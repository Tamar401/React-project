import { Router } from 'express';
import * as prioritiesController from '../controllers/prioritiesController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = Router();

router.get('/', requireAuth, prioritiesController.list);
router.post('/', requireAuth, requireRole('admin'), prioritiesController.create);

export default router;
