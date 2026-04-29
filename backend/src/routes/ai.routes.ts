import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const aiRoutes = Router();

aiRoutes.post('/recommend', authMiddleware, aiController.getRecommendations);
