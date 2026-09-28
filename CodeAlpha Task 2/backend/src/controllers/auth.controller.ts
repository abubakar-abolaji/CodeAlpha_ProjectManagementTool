import type { Response } from 'express';
import { z } from 'zod';
import { loginUser, registerUser } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      name: z.string().trim().min(2).max(80),
      email: z.string().email(),
      password: z.string().min(8).max(128),
    });

    const validated = schema.parse(req.body);
    const result = await registerUser(validated);
    res.status(201).json({ success: true, message: 'User registered successfully', data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ success: false, message });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(128),
    });

    const validated = schema.parse(req.body);
    const result = await loginUser(validated.email, validated.password);
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ success: false, message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { User } = await import('../models/User.js');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    res.status(400).json({ success: false, message });
  }
};

export const logout = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
