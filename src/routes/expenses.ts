import { Router, Request, Response } from "express";
import prisma from "../prisma/client";
import logger from "../utils/logger";

const router = Router();

// Get all expenses
router.get("/", async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: { paidBy: true },
      orderBy: { date: "desc" },
    });

    logger.info("Fetched all expenses");

    return res.json(expenses);
  } catch (error) {
    logger.error(`Failed to fetch expenses: ${error}`);

    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Add a new expense
router.post("/", async (req: Request, res: Response) => {
  const { description, amount, paidById } = req.body;
  try {
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        paidById,
      },
      include: { paidBy: true },
    });

    logger.info(
      `Created expense: ${description} for $${amount} by user ${paidById}`
    );

    return res.status(201).json(expense);
  } catch (error) {
    logger.error(`Failed to create expense: ${error}`);

    return res.status(500).json({ error: "Failed to create expense" });
  }
});

// Delete an expense
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.expense.delete({
      where: { id: Number(id) },
    });

    logger.info(`Deleted expense with id: ${id}`);

    return res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete expense: ${error}`);

    return res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
