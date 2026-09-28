import type { Response } from 'express';
import { Task } from '../models/Task.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user?.id,
    });
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Task creation failed';
    res.status(400).json({ success: false, message });
  }
};

export const listTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const project = typeof req.query.project === 'string' ? req.query.project : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const priority = typeof req.query.priority === 'string' ? req.query.priority : undefined;

    const filter: Record<string, unknown> = {};
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.$text = { $search: search };

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load tasks';
    res.status(400).json({ success: false, message });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch task';
    res.status(400).json({ success: false, message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Task update failed';
    res.status(400).json({ success: false, message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Task deletion failed';
    res.status(400).json({ success: false, message });
  }
};

export const changeTaskStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Task status updated', data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Status update failed';
    res.status(400).json({ success: false, message });
  }
};

export const assignTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo: req.body.assignedTo }, { new: true });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Task assigned successfully', data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Assignment failed';
    res.status(400).json({ success: false, message });
  }
};

export const reorderTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { position: req.body.position, column: req.body.column }, { new: true });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Task reordered successfully', data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Task reorder failed';
    res.status(400).json({ success: false, message });
  }
};
