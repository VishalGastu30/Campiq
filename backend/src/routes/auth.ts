// src/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import rateLimit from 'express-rate-limit';

const router = Router();

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: { message: 'Too many auth attempts, please try again later.' } }
});

const signupSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  password: z.string().min(8).max(72), // bcrypt max is 72 chars
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

router.post('/signup', async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists' }
      });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    
    // Always compare hash even if user not found — prevents timing attacks
    const passwordMatch = user
      ? await bcrypt.compare(body.password, user.passwordHash)
      : await bcrypt.compare(body.password, '$2b$12$invalidhashpaddingtopreventimagtiming');
    
    if (!user || !passwordMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User no longer exists' }
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' }
      });
    }
    next(err);
  }
});

export { router as authRoutes };
