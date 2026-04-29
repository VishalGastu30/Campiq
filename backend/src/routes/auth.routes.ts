import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { signupSchema, loginSchema } from '../schemas/auth.schema';
import { authMiddleware } from '../middleware/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), authController.signup);
authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.get('/me', authMiddleware, authController.getMe);
