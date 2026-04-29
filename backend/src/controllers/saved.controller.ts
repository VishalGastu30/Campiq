import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export class SavedController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const savedColleges = await prisma.savedCollege.findMany({
        where: { userId: req.userId },
        include: { 
          college: {
            include: { courses: true }
          }
        },
        orderBy: { savedAt: 'desc' }
      });
      res.json(savedColleges);
    } catch (error) {
      next(error);
    }
  }

  async save(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collegeId } = req.body;
      if (!collegeId) return res.status(400).json({ success: false, error: { message: 'collegeId is required' }});

      // verify college exists
      const college = await prisma.college.findUnique({ where: { id: collegeId }});
      if (!college) return res.status(404).json({ success: false, error: { message: 'College not found' }});

      const saved = await prisma.savedCollege.create({
        data: {
          userId: req.userId!,
          collegeId
        },
        include: {
          college: {
            include: { courses: true }
          }
        }
      });
      res.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collegeId } = req.params;
      
      await prisma.savedCollege.deleteMany({
        where: {
          userId: req.userId!,
          collegeId
        }
      });
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const savedController = new SavedController();
