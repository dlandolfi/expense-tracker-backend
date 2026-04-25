import { Router, Request, Response, NextFunction } from 'express';

import prisma from '../prisma/client';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    logger.info('Fetched all users');
    return res.json(users);
  } catch (error) {
    next(new AppError('Failed to fetch users', 500, error));
  }
});

export default router;
