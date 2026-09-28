import type { Response } from 'express';
import { Board } from '../models/Board.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const board = await Board.create({
      project: req.params.projectId,
      ...req.body,
    });
    res.status(201).json({ success: true, message: 'Board created successfully', data: board });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Board creation failed';
    res.status(400).json({ success: false, message });
  }
};

export const listBoards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const boards = await Board.find({ project: req.params.projectId });
    res.status(200).json({ success: true, data: boards });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load boards';
    res.status(400).json({ success: false, message });
  }
};

export const getBoardById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404).json({ success: false, message: 'Board not found' });
      return;
    }
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch board';
    res.status(400).json({ success: false, message });
  }
};

export const updateBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!board) {
      res.status(404).json({ success: false, message: 'Board not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Board updated successfully', data: board });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Board update failed';
    res.status(400).json({ success: false, message });
  }
};

export const deleteBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      res.status(404).json({ success: false, message: 'Board not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Board deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Board deletion failed';
    res.status(400).json({ success: false, message });
  }
};
