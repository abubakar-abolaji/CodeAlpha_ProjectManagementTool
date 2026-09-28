import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return;
  }

  next();
};
