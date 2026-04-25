import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  status: number;
  originalError: unknown;

  constructor(message: string, status: number, originalError?: unknown) {
    super(message);
    this.status = status;
    this.originalError = originalError;
  }
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';

  logger.error(
    `${status} - ${message}${err.originalError ? `: ${err.originalError}` : ''}`
  );

  return res.status(status).json({ error: message });
}
