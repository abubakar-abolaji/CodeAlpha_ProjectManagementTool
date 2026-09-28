import type { Response } from 'express';
import { User } from '../models/User.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load user';
    res.status(400).json({ success: false, message });
  }
};

export const updateCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const updates = req.body as { name?: string; avatar?: string; bio?: string; email?: string };
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (updates.name) user.name = updates.name;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.email) user.email = updates.email.toLowerCase();

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: user.toJSON() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile update failed';
    res.status(400).json({ success: false, message });
  }
};

export const listUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').limit(50).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list users';
    res.status(400).json({ success: false, message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
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
