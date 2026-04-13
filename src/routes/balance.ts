import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import logger from '../utils/logger';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
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

    logger.info('Fetched balance');
    return res.json({
      grandTotal,
      fairShare,
      balance,
    });
  } catch (error) {
    logger.error(`Failed to calculate balance: ${error}`);
    return res.status(500).json({ error: 'Failed to calculate balance' });
  }
});

export default router;
