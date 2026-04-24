import { z } from 'zod';

export const expenseCategories = [
  'GROCERIES',
  'HOUSEHOLD',
  'UTILITIES',
  'SUBSCRIPTIONS',
  'DINING',
  'COFFEE',
  'TRANSPORT',
  'ENTERTAINMENT',
  'OTHER',
] as const;

export const createExpenseSchema = z.object({
  description: z.string().default(''),
  amount: z.number().positive(),
  paidById: z.number().int().positive(),
  category: z.enum(expenseCategories).default('OTHER'),
  date: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  description: z.string().default(''),
  amount: z.number().positive().optional(),
  paidById: z.number().int().positive().optional(),
  category: z.enum(expenseCategories).optional(),
  date: z.string().optional(),
});
