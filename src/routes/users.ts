import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import logger from '../utils/logger';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    logger.info('Fetched all users');
    return res.json(users);
  } catch (error) {
    logger.error(`Failed to fetch users: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
