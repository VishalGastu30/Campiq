import { Request, Response, NextFunction } from 'express';
import { collegeService } from '../services/college.service';

export class CollegeController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // params are already validated/transformed by zod middleware
      const data = await collegeService.getColleges(req.query as any);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getFilterMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await collegeService.getFilterMeta();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCompare(req: Request, res: Response, next: NextFunction) {
    try {
      const idsStr = req.query.ids as string;
      if (!idsStr) {
        return res.status(400).json({ success: false, error: { message: 'Missing ids query param' }});
      }
      const ids = idsStr.split(',').slice(0, 3); // Max 3
      const colleges = await collegeService.getCompare(ids);
      res.json(colleges);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const college = await collegeService.getByIdOrSlug(id);
      res.json(college);
    } catch (error) {
      next(error);
    }
  }
}

export const collegeController = new CollegeController();
