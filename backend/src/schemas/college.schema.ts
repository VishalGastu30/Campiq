import { z } from 'zod';

export const getCollegesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    state: z.string().optional(),
    type: z.string().optional(),
    minFees: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxFees: z.string().regex(/^\d+$/).transform(Number).optional(),
    course: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('12'),
    sortBy: z.enum(['rating', 'nirfRank', 'fees', 'placement']).optional(),
  })
});
