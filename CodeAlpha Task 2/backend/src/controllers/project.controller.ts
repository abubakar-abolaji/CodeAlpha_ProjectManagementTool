import type { Response } from 'express';
import { Types } from 'mongoose';
import { Project } from '../models/Project.js';
import { ProjectMember } from '../models/ProjectMember.js';
import { Board } from '../models/Board.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const project = await Project.create({
      ...req.body,
      owner: req.user.id,
      members: [req.user.id],
    });

    await ProjectMember.create({
      project: project._id,
      user: req.user.id,
      role: 'owner',
    });

    await Board.create({
      project: project._id,
      name: 'Main Board',
      description: 'Default board',
      columns: [
        { id: 'todo', name: 'Todo', position: 0 },
        { id: 'in_progress', name: 'In Progress', position: 1 },
        { id: 'review', name: 'Review', position: 2 },
        { id: 'completed', name: 'Completed', position: 3 },
      ],
    });

    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Project creation failed';
    res.status(400).json({ success: false, message });
  }
};

export const listProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const query = {
      $or: [
        { owner: req.user.id },
        { members: req.user.id },
      ],
      ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
    };

    const [projects, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
    res.status(400).json({ success: false, message });
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project';
    res.status(400).json({ success: false, message });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found or not editable' });
      return;
    }

    Object.assign(project, req.body);
    await project.save();
    res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Project update failed';
    res.status(400).json({ success: false, message });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found or not deletable' });
      return;
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Project deletion failed';
    res.status(400).json({ success: false, message });
  }
};

export const addMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const { userId, role } = req.body as { userId: string; role?: string };
    const member = await ProjectMember.create({
      project: project._id,
      user: userId,
      role: role ?? 'member',
    });

    const nextMembers = [...new Set([...project.members.map((id) => id.toString()), userId])].map(
      (id) => new Types.ObjectId(id),
    );
    project.members = nextMembers;
    await project.save();

    res.status(201).json({ success: true, message: 'Member added successfully', data: member });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add member';
    res.status(400).json({ success: false, message });
  }
};

export const listMembers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const members = await ProjectMember.find({ project: req.params.id }).populate('user', 'name email avatar role');
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list members';
    res.status(400).json({ success: false, message });
  }
};
