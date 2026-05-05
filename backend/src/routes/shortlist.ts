import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const createShortlistSchema = z.object({
  collegeIds: z.array(z.string()).min(1).max(20),
});

// POST /api/shortlist — Create a new shareable shortlist
router.post('/', async (req, res, next) => {
  try {
    const { collegeIds } = createShortlistSchema.parse(req.body);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    // req.user might be set by authMiddleware if logged in, but we allow anonymous
    const userId = (req as any).user?.userId || null;

    const shortlist = await prisma.shortlist.create({
      data: {
        collegeIds,
        userId,
        expiresAt
      }
    });

    res.json({
      success: true,
      data: { token: shortlist.token }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/shortlist/:token — Retrieve a shortlist
router.get('/:token', async (req, res, next) => {
  try {
    const { token } = req.params;

    const shortlist = await prisma.shortlist.findUnique({
      where: { token }
    });

    if (!shortlist) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Shortlist not found or expired' }
      });
    }

    if (new Date() > shortlist.expiresAt) {
       return res.status(410).json({
        success: false,
        error: { code: 'EXPIRED', message: 'Shortlist has expired' }
      });
    }

    // Fetch the colleges
    const colleges = await prisma.college.findMany({
      where: { id: { in: shortlist.collegeIds } },
      select: {
        id: true, slug: true, name: true, city: true, state: true,
        type: true, nirfRank: true, minFees: true, placementPercent: true,
        imageUrl: true, logoUrl: true, rating: true,
      }
    });

    // Reorder colleges to match the original array order
    const orderedColleges = shortlist.collegeIds
      .map(id => colleges.find(c => c.id === id))
      .filter(Boolean);

    res.json({
      success: true,
      data: {
        token: shortlist.token,
        createdAt: shortlist.createdAt,
        expiresAt: shortlist.expiresAt,
        colleges: orderedColleges
      }
    });
  } catch (err) {
    next(err);
  }
});

export { router as shortlistRoutes };
