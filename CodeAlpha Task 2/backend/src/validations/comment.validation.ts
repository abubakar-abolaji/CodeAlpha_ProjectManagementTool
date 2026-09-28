import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(2000),
    mentions: z.array(z.string()).optional(),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(2000),
  }),
});
