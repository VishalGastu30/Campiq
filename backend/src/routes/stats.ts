import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [totalColleges, stateResult, placementResult, feesResult] = await Promise.all([
      prisma.college.count(),
      prisma.college.groupBy({ by: ['state'], _count: true }),
      prisma.college.aggregate({ _avg: { placementPercent: true }, where: { placementPercent: { not: null } } }),
      prisma.college.aggregate({ _min: { minFees: true }, where: { minFees: { not: null } } }),
    ]);

    res.json({
      success: true,
      data: {
        totalColleges,
        totalStreams: 10,
        totalStates: stateResult.length,
        avgPlacement: Math.round(placementResult._avg.placementPercent || 0),
        lowestFees: feesResult._min.minFees || 0,
      }
    });
  } catch (err) {
    next(err);
  }
});

export { router as statsRoutes };
