import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

let userId: number;

beforeEach(async () => {
  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: { name: 'Test User', email: 'test@example.com' },
  });
  userId = user.id;
});

afterEach(async () => {
  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /expenses', () => {
  it('should return an empty array when no expenses exist', async () => {
    const res = await request(app).get('/expenses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all expenses', async () => {
    await prisma.expense.create({
      data: {
        description: 'Test expense',
        amount: 50,
        paidById: userId,
        category: 'GROCERIES',
      },
    });
    const res = await request(app).get('/expenses');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toBe('Test expense');
  });
});

describe('POST /expenses', () => {
  it('should create a new expense', async () => {
    const res = await request(app).post('/expenses').send({
      description: 'Groceries',
      amount: 85,
      paidById: userId,
      category: 'GROCERIES',
    });
    expect(res.status).toBe(201);
    expect(res.body.description).toBe('Groceries');
    expect(res.body.paidBy.name).toBe('Test User');
  });

  it('should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ description: 'Missing amount and paidById' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /expenses/:id', () => {
  it('should delete an expense', async () => {
    const expense = await prisma.expense.create({
      data: {
        description: 'To delete',
        amount: 50,
        paidById: userId,
        category: 'OTHER',
      },
    });
    const res = await request(app).delete(`/expenses/${expense.id}`);
    expect(res.status).toBe(204);
  });
});
