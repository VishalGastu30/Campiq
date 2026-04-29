import { prisma } from '../lib/prisma';
import { Prisma, CollegeType } from '@prisma/client';

interface GetCollegesParams {
  search?: string;
  state?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  course?: string;
  page: number;
  limit: number;
  sortBy?: 'rating' | 'nirfRank' | 'fees' | 'placement';
}

export class CollegeService {
  async getColleges(params: GetCollegesParams) {
    const { search, state, type, minFees, maxFees, course, page, limit, sortBy } = params;

    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { courses: { some: { name: { contains: search, mode: 'insensitive' } } } }
      ];
    }
    
    if (state) where.state = state;
    if (type && type !== 'All') where.type = type as CollegeType;
    
    if (minFees !== undefined || maxFees !== undefined) {
      const parsedMin = minFees !== undefined ? parseInt(String(minFees), 10) : undefined;
      const parsedMax = maxFees !== undefined ? parseInt(String(maxFees), 10) : undefined;
      
      if (parsedMin !== undefined && !isNaN(parsedMin)) {
        where.minFees = { gte: parsedMin };
      }
      if (parsedMax !== undefined && !isNaN(parsedMax)) {
        where.maxFees = { lte: parsedMax };
      }
    }

    if (course) {
      where.courses = { some: { category: course } };
    }

    let orderBy: Prisma.CollegeOrderByWithRelationInput | Prisma.CollegeOrderByWithRelationInput[] = { rating: 'desc' };
    if (sortBy === 'nirfRank') {
      // Postgres supports NULLS LAST via Prisma 5.x sort options, but simpler is asc
      orderBy = { nirfRank: { sort: 'asc', nulls: 'last' } };
    } else if (sortBy === 'fees') {
      orderBy = { minFees: 'asc' };
    } else if (sortBy === 'placement') {
      orderBy = { placementPercent: 'desc' };
    }

    const parsedPage = parseInt(String(page), 10) || 1;
    const parsedLimit = parseInt(String(limit), 10) || 12;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        include: { courses: true }
      }),
      prisma.college.count({ where })
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return {
      data: colleges,
      total,
      page: parsedPage,
      totalPages,
      hasNext: parsedPage < totalPages,
      hasPrev: parsedPage > 1
    };
  }

  async getByIdOrSlug(idOrSlug: string) {
    // Try slug first (most common from frontend navigation)
    let college = await prisma.college.findUnique({
      where: { slug: idOrSlug },
      include: { courses: true }
    });

    // If not found by slug, try by id (for API consumers or compare links)
    if (!college) {
      try {
        college = await prisma.college.findUnique({
          where: { id: idOrSlug },
          include: { courses: true }
        });
      } catch {
        // id format mismatch — ignore and fall through to 404
      }
    }

    if (!college) {
      throw { statusCode: 404, message: 'College not found' };
    }
    return college;
  }

  async getCompare(ids: string[]) {
    return prisma.college.findMany({
      where: { id: { in: ids } },
      include: { courses: true }
    });
  }

  async getFilterMeta() {
    const [states, courseCategories, types] = await Promise.all([
      prisma.college.findMany({ select: { state: true }, distinct: ['state'], orderBy: { state: 'asc' } }),
      prisma.course.findMany({ select: { category: true }, distinct: ['category'], orderBy: { category: 'asc' } }),
      prisma.college.findMany({ select: { type: true }, distinct: ['type'] })
    ]);

    return {
      states: states.map(s => s.state),
      courseCategories: courseCategories.map(c => c.category),
      types: types.map(t => t.type)
    };
  }
}

export const collegeService = new CollegeService();
