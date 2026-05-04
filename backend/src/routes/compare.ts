// src/routes/compare.ts
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const compareQuerySchema = z.object({
  ids: z.string().min(1, 'IDs are required')
});

router.get('/', async (req, res, next) => {
  try {
    const query = compareQuerySchema.parse(req.query);
    const ids = query.ids.split(',').map(id => id.trim()).filter(Boolean).slice(0, 3); // Max 3

    if (ids.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      select: {
        id: true, slug: true, name: true, city: true, state: true, type: true,
        nirfRank: true, naacGrade: true,
        minFees: true, maxFees: true,
        placementPercent: true, avgPackage: true,
        highestPackage: true,
        imageUrl: true, logoUrl: true
      }
    });

    res.json({ success: true, data: colleges });
  } catch (err) {
    next(err);
  }
});

export { router as compareRoutes };
