import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten();
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formatted.fieldErrors,
      });
      return;
    }

    res.status(500).json({ success: false, message: 'Validation error' });
  }
};
