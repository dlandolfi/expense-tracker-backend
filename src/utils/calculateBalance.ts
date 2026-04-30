import { Decimal } from '@prisma/client/runtime/library';

type Expense = {
  paidById: number;
  amount: string | number | Decimal;
};

type BalanceEntry = {
  userId: number;
  paid: number;
  balance: number;
  status: 'owed' | 'owes';
  amount: number;
};

type BalanceResult = {
  grandTotal: number;
  fairShare: number;
  balance: BalanceEntry[];
};

export function calculateBalance(expenses: Expense[]): BalanceResult {
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
    status: (totals[userId] - fairShare > 0 ? 'owed' : 'owes') as
      | 'owed'
      | 'owes',
    amount: Math.abs(totals[userId] - fairShare),
  }));

  return { grandTotal, fairShare, balance };
}
