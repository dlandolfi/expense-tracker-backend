import { PrismaClient } from '@prisma/client';

export default async function globalTeardown() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });

  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
}
