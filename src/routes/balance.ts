import { Router, Request, Response, NextFunction } from 'express';

import prisma from '../prisma/client';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

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

    const totals: Record<number, number> = {};

    for (const expense of expenses) {
      const amount = Number(expense.amount);
      if (!totals[expense.paidById]) {
        totals[expense.paidById] = 0;
      }
      totals[expense.paidById] += amount;
    }

    const userIds = Object.keys(totals).map(Number);
    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
    const fairShare = grandTotal / 2;

    const balance = userIds.map((userId) => ({
      userId,
      paid: totals[userId],
      balance: totals[userId] - fairShare,
      status: totals[userId] - fairShare > 0 ? 'owed' : 'owes',
      amount: Math.abs(totals[userId] - fairShare),
    }));

    logger.info(`Fetched balance${month ? ` for ${month}` : ''}`);
    return res.json({ grandTotal, fairShare, balance });
  } catch (error) {
    next(new AppError('Failed to fetch balance', 500, error));
  }
});

export default router;
