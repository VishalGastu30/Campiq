import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const data = await authService.signup(name, email, hashedPassword);
      
      res.status(201).json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      
      res.json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.userId!);
      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
