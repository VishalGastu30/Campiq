import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { Stream } from '@prisma/client';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const streams = Object.keys(Stream) as Stream[];
    const result = [];

    for (const stream of streams) {
      // For each stream, we need count, avgFees, and topCollege
      // Since arrays can't be used in standard groupBy with aggregations cleanly in Prisma,
      // we'll run a few queries. We can optimize this with Raw SQL for production,
      // but for this scale, running separate queries is fine.

      const collegesInStream = await prisma.college.findMany({
        where: { streams: { has: stream } },
        select: { 
          minFees: true, 
          name: true, 
          nirfRank: true,
          rating: true
        },
        orderBy: [
          { nirfRank: 'asc' },
          { rating: 'desc' }
        ]
      });

      if (collegesInStream.length === 0) continue;

      const count = collegesInStream.length;
      
      const validFees = collegesInStream.filter(c => c.minFees !== null).map(c => c.minFees as number);
      const avgFees = validFees.length > 0 
        ? Math.round(validFees.reduce((a, b) => a + b, 0) / validFees.length) 
        : 0;

      // Find the top college (first in the sorted list that has a valid rank/rating)
      let topCollege = collegesInStream[0]?.name;

      result.push({
        stream,
        count,
        avgFees,
        topCollege
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export { router as streamRoutes };
