import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import * as ticketsController from '../controllers/ticketsController';

const router = Router();

router.get('/', requireAuth, ticketsController.list);
router.get('/:id', requireAuth, ticketsController.getOne);
router.post('/', requireAuth, requireRole('customer'), ticketsController.create);
router.patch('/:id', requireAuth, requireRole('agent', 'admin'), ticketsController.update);
router.delete('/:id', requireAuth, requireRole('admin'), ticketsController.remove);

export default router;
