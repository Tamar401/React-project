import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as commentsController from '../controllers/commentsController';

const router = Router({ mergeParams: true });

router.get('/', requireAuth, commentsController.listByTicket);
router.post('/', requireAuth, commentsController.create);

export default router;
