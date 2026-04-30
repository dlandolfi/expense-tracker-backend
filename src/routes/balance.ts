import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import { calculateBalance } from '../utils/calculateBalance';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { month } = req.query;

  const where = month
    ? {
        date: {
          gte: new Date(`${month}-01`),
          lt: new Date(
            new Date(`${month}-01`).getFullYear(),
            new Date(`${month}-01`).getMonth() + 1,
            1
          ),
        },
      }
    : {};

  try {
    const expenses = await prisma.expense.findMany({
      where,
      include: { paidBy: true },
    });

    const result = calculateBalance(expenses);

    logger.info(`Fetched balance${month ? ` for ${month}` : ''}`);
    return res.json(result);
  } catch (_error) {
    next(new AppError('Failed to fetch balance', 500, _error));
  }
});

export default router;
