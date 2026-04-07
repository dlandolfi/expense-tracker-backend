import { Router, Request, Response } from "express";
import prisma from "../prisma/client";

const router = Router();

// Get all expenses
router.get("/", async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: { paidBy: true },
      orderBy: { date: "desc" },
    });
    return res.json(expenses);
  } catch (error) {
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
    return res.status(201).json(expense);
  } catch (error) {
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
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
