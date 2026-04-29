import { Router } from 'express';
import { collegeController } from '../controllers/college.controller';
import { validate } from '../middleware/validate.middleware';
import { getCollegesSchema } from '../schemas/college.schema';

export const collegeRoutes = Router();

collegeRoutes.get('/', validate(getCollegesSchema), collegeController.getAll);
collegeRoutes.get('/filters/meta', collegeController.getFilterMeta);
collegeRoutes.get('/compare', collegeController.getCompare);
// Important: Param routes must come after static routes
collegeRoutes.get('/:id', collegeController.getById);
