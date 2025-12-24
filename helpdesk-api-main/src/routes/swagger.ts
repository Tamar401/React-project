import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import openapi from '../swagger/openapi.json';

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openapi as any));

export default router;
