import { calculateBalance } from '../utils/calculateBalance';

describe('calculateBalance', () => {
  it('should return empty balance for no expenses', () => {
    const result = calculateBalance([]);
    expect(result.grandTotal).toBe(0);
    expect(result.fairShare).toBe(0);
    expect(result.balance).toEqual([]);
  });

  it('should calculate grand total and fair share correctly', () => {
    const expenses = [
      { paidById: 1, amount: 100 },
      { paidById: 2, amount: 100 },
    ];
    const result = calculateBalance(expenses);
    expect(result.grandTotal).toBe(200);
    expect(result.fairShare).toBe(100);
  });

  it('should return owed status when user paid more than fair share', () => {
    const expenses = [
      { paidById: 1, amount: 150 },
      { paidById: 2, amount: 50 },
    ];
    const result = calculateBalance(expenses);
    const user1 = result.balance.find((b) => b.userId === 1);
    expect(user1?.status).toBe('owed');
    expect(user1?.amount).toBe(50);
  });

  it('should return owes status when user paid less than fair share', () => {
    const expenses = [
      { paidById: 1, amount: 150 },
      { paidById: 2, amount: 50 },
    ];
    const result = calculateBalance(expenses);
    const user2 = result.balance.find((b) => b.userId === 2);
    expect(user2?.status).toBe('owes');
    expect(user2?.amount).toBe(50);
  });

  it('should handle all expenses paid by one user', () => {
    const expenses = [
      { paidById: 1, amount: 100 },
      { paidById: 1, amount: 50 },
    ];
    const result = calculateBalance(expenses);
    expect(result.grandTotal).toBe(150);
    expect(result.fairShare).toBe(75);
    const user1 = result.balance.find((b) => b.userId === 1);
    expect(user1?.status).toBe('owed');
    expect(user1?.amount).toBe(75);
  });
});
