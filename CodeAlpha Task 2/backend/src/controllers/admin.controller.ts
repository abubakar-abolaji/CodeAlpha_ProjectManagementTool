import type { Response } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Activity } from '../models/Activity.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getAdminStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, activeUsers, totalProjects, activeProjects, completedProjects, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Project.countDocuments({ status: 'completed' }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ status: { $ne: 'completed' } }),
      Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'completed' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Admin stats unavailable';
    res.status(400).json({ success: false, message });
  }
};

export const getAdminUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    res.status(400).json({ success: false, message });
  }
};

export const getAdminProjects = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
    res.status(400).json({ success: false, message });
  }
};

export const getAdminTasks = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    res.status(400).json({ success: false, message });
  }
};

export const getAdminActivity = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const activity = await Activity.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch activity';
    res.status(400).json({ success: false, message });
  }
};
