import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import logger from '../utils/logger';

const router = Router();

// Get all expenses
router.get('/', async (req: Request, res: Response) => {
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
      orderBy: { date: 'desc' },
    });
    logger.info(`Fetched expenses${month ? ` for ${month}` : ''}`);
    return res.json(expenses);
  } catch (error) {
    logger.error(`Failed to fetch expenses: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add a new expense
router.post('/', async (req: Request, res: Response) => {
  const { description, amount, paidById, category, date } = req.body;
  try {
    const expense = await prisma.expense.create({
      data: { description, amount, paidById, category, date },
      include: { paidBy: true },
    });
    logger.info(
      `Created expense: ${category} for $${amount} by user ${paidById}`
    );
    return res.status(201).json(expense);
  } catch (error) {
    logger.error(`Failed to create expense: ${error}`);
    return res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Delete an expense
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.expense.delete({
      where: { id: Number(id) },
    });
    logger.info(`Deleted expense with id: ${id}`);
    return res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete expense: ${error}`);
    return res.status(500).json({ error: 'Failed to delete expense' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, amount, paidById, category, date } = req.body;
  try {
    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: { description, amount, paidById, category, date },
      include: { paidBy: true },
    });
    logger.info(
      `Updated expense ${id}: ${category} for $${amount} by user ${paidById}`
    );
    return res.json(expense);
  } catch (err) {
    logger.error(`Failed to update expense: ${err}`);
    return res.status(500).json({ error: 'Failed to update expense' });
  }
});

export default router;
