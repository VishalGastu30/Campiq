// src/routes/saved.ts
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware to extract user ID and ensure auth
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' }
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' }
    });
  }
};

router.use(authMiddleware);

router.get('/', async (req: any, res, next) => {
  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.userId },
      include: {
        college: {
          select: {
            id: true, slug: true, name: true, city: true, state: true, type: true,
            nirfRank: true, naacGrade: true,
            minFees: true, maxFees: true,
            placementPercent: true, avgPackage: true,
            imageUrl: true, logoUrl: true
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
});

const saveSchema = z.object({
  collegeId: z.string()
});

router.post('/', async (req: any, res, next) => {
  try {
    const body = saveSchema.parse(req.body);
    
    // Upsert prevents duplicate saves via the @@unique constraint
    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: req.userId,
          collegeId: body.collegeId
        }
      },
      update: {},
      create: {
        userId: req.userId,
        collegeId: body.collegeId
      },
      include: {
        college: true
      }
    });

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
});

router.delete('/:collegeId', async (req: any, res, next) => {
  try {
    const { collegeId } = req.params;
    
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: req.userId,
          collegeId
        }
      }
    }).catch(() => {
      // Ignore if it doesn't exist
    });

    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    next(err);
  }
});

export { router as savedRoutes };
