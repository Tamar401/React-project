import { Router } from 'express';
import * as statusesController from '../controllers/statusesController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = Router();

router.get('/', requireAuth, statusesController.list);
router.post('/', requireAuth, requireRole('admin'), statusesController.create);

export default router;
