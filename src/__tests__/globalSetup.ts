import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

export default async function globalSetup() {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
}
