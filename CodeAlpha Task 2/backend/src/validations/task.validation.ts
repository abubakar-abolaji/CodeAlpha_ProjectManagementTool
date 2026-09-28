import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(150),
    description: z.string().trim().max(3000).optional(),
    project: z.string().min(1),
    board: z.string().optional(),
    column: z.string().min(1),
    assignedTo: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    status: z.enum(['todo', 'in_progress', 'review', 'completed']).optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
    labels: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional(),
    position: z.number().optional(),
  }),
});

export const updateTaskSchema = createTaskSchema.partial();
