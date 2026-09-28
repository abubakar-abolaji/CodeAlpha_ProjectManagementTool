import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(1000).optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    color: z.string().optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
  }),
});

export const updateProjectSchema = createProjectSchema.partial();
