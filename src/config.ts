import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().default('3001'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Missing required environment variables:');
  console.error(z.treeifyError(result.error));
  process.exit(1);
}

export const config = result.data;
