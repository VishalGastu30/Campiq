import { Router } from 'express';
import { savedController } from '../controllers/saved.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const savedRoutes = Router();

// All saved routes require auth
savedRoutes.use(authMiddleware);

savedRoutes.get('/', savedController.getAll);
savedRoutes.post('/', savedController.save);
savedRoutes.delete('/:collegeId', savedController.remove);
