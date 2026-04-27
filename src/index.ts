import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import expensesRoutes from './routes/expenses';
import balanceRoutes from './routes/balance';
import userRoutes from './routes/users';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later' },
});

app.use(
  cors({
    origin: false,
  })
);
app.use(helmet());
app.use(limiter);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/expenses', expensesRoutes);
app.use('/balance', balanceRoutes);
app.use('/users', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
