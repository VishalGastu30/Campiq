// src/routes/colleges.ts
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import Groq from 'groq-sdk';

const router = Router();

// GET /api/colleges — Listing with filters, search, pagination
const collegeQuerySchema = z.object({
  search:   z.string().optional(),
  state:    z.string().optional(),
  type:     z.enum(['GOVERNMENT', 'PRIVATE', 'DEEMED', 'CENTRAL']).optional(),
  stream:   z.enum(['ENGINEERING', 'MANAGEMENT', 'MEDICAL', 'LAW', 'ARTS', 'SCIENCE', 'COMMERCE', 'DESIGN', 'PHARMACY', 'AGRICULTURE']).optional(),
  minFees:  z.coerce.number().optional(),
  maxFees:  z.coerce.number().optional(),
  sort:     z.enum(['nirfRank', 'fees', 'placement', 'name']).optional().default('nirfRank'),
  order:    z.enum(['asc', 'desc']).optional().default('asc'),
  page:     z.coerce.number().min(1).optional().default(1),
  limit:    z.coerce.number().min(1).max(50).optional().default(12),
});

router.get('/', async (req, res, next) => {
  try {
    const query = collegeQuerySchema.parse(req.query);
    
    const where: any = {};
    
    // Full-text search on name and city
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { shortName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    
    if (query.state)  where.state = { equals: query.state, mode: 'insensitive' };
    if (query.type)   where.type = query.type;
    if (query.stream) where.streams = { has: query.stream };
    
    if (query.minFees || query.maxFees) {
      where.minFees = {};
      if (query.minFees) where.minFees.gte = query.minFees;
      if (query.maxFees) where.minFees.lte = query.maxFees;
    }

    // Sort mapping
    const orderBy: any = {};
    switch (query.sort) {
      case 'nirfRank':
        // Null ranks go to the end
        orderBy.nirfRank = { sort: query.order, nulls: 'last' };
        break;
      case 'fees':
        orderBy.minFees = { sort: query.order, nulls: 'last' };
        break;
      case 'placement':
        orderBy.placementPercent = { sort: query.order, nulls: 'last' };
        break;
      case 'name':
        orderBy.name = query.order;
        break;
    }

    const skip = (query.page - 1) * query.limit;

    // Run count and data fetch in parallel — faster than sequential
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        select: {
          id: true, slug: true, name: true, shortName: true,
          city: true, state: true, type: true,
          nirfRank: true, naacGrade: true,
          minFees: true, maxFees: true,
          placementPercent: true, avgPackage: true,
          streams: true, examsAccepted: true,
          imageUrl: true, logoUrl: true,
          highlights: true,
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        colleges,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
          hasNext: query.page < Math.ceil(total / query.limit),
          hasPrev: query.page > 1,
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/colleges/meta/filters — Returns available filter options
router.get('/meta/filters', async (_req, res, next) => {
  try {
    const [states] = await Promise.all([
      prisma.college.findMany({
        distinct: ['state'],
        select: { state: true },
        orderBy: { state: 'asc' }
      }),
      // Streams come from enum, no DB query needed
      Promise.resolve(['ENGINEERING', 'MANAGEMENT', 'MEDICAL', 'LAW', 'ARTS', 'SCIENCE', 'COMMERCE', 'DESIGN', 'PHARMACY', 'AGRICULTURE'])
    ]);

    res.json({
      success: true,
      data: {
        states: states.map(s => s.state),
        streams: ['ENGINEERING', 'MANAGEMENT', 'MEDICAL', 'LAW', 'ARTS', 'SCIENCE', 'COMMERCE', 'DESIGN', 'PHARMACY', 'AGRICULTURE'],
        types: ['GOVERNMENT', 'PRIVATE', 'DEEMED', 'CENTRAL'],
        feeRanges: [
          { label: 'Under ₹1L/yr', min: 0, max: 100000 },
          { label: '₹1L – ₹3L/yr', min: 100000, max: 300000 },
          { label: '₹3L – ₹10L/yr', min: 300000, max: 1000000 },
          { label: 'Above ₹10L/yr', min: 1000000, max: null },
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/colleges/autocomplete?q=...
router.get('/autocomplete', async (req, res, next) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.json({ success: true, data: [] });

    const colleges = await prisma.college.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
          { shortName: { contains: q, mode: 'insensitive' } },
        ]
      },
      take: 4,
      select: {
        id: true, slug: true, name: true, city: true, state: true,
        nirfRank: true, logoUrl: true, type: true,
      },
      orderBy: [
        { nirfRank: { sort: 'asc', nulls: 'last' } },
      ]
    });

    res.json({ success: true, data: colleges });
  } catch (err) {
    next(err);
  }
});

// GET /api/colleges/:id/related
router.get('/:id/related', async (req, res, next) => {
  try {
    const { id } = req.params;
    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) return res.json({ success: true, data: [] });

    const related = await prisma.college.findMany({
      where: {
        AND: [
          { id: { not: college.id } },
          {
            OR: [
              { state: college.state },
              { type: college.type }
            ]
          }
        ]
      },
      orderBy: { rating: 'desc' },
      take: 4,
      select: {
        id: true, slug: true, name: true, city: true, state: true,
        type: true, minFees: true, placementPercent: true, rating: true,
        imageUrl: true, logoUrl: true,
      }
    });

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
});

// POST /api/colleges/:id/generate-summary
router.post('/:id/generate-summary', async (req, res, next) => {
  try {
    const { id } = req.params;
    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'College not found' } });
    }

    // Check if valid summary already exists (generated within last 30 days)
    if (college.aiSummary && college.aiSummaryAt) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (college.aiSummaryAt > thirtyDaysAgo) {
        return res.json({ success: true, data: { summary: college.aiSummary } });
      }
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `Write a 2-sentence college summary for Indian students in a helpful, factual tone.
College: ${college.name}
Location: ${college.city}, ${college.state}
Type: ${college.type}
NIRF Rank: ${college.nirfRank || 'Not ranked'}
NAAC Grade: ${college.naacGrade || 'Not graded'}
Annual Fees: ₹${(college.minFees || 100000) / 100000}L
Placement: ${college.placementPercent || 'N/A'}%
Avg Package: ₹${college.avgPackage || 'N/A'} LPA

Output ONLY the summary paragraph. No preamble. No quotes.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 150,
    });

    const summary = response.choices[0]?.message?.content?.trim() || 'Summary not available.';

    await prisma.college.update({
      where: { id },
      data: {
        aiSummary: summary,
        aiSummaryAt: new Date(),
      }
    });

    res.json({ success: true, data: { summary } });
  } catch (err) {
    next(err);
  }
});

// GET /api/colleges/:slug — Detail page
router.get('/:slug', async (req, res, next) => {
  try {
    const college = await prisma.college.findUnique({
      where: { slug: req.params.slug },
      include: {
        courses: {
          orderBy: { fees: 'asc' }
        },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { savedByUsers: true } }
      }
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'College not found' }
      });
    }

    res.json({ success: true, data: college });
  } catch (err) {
    next(err);
  }
});


export { router as collegeRoutes };
