import type { Response } from 'express';
import { Comment } from '../models/Comment.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.create({
      task: req.params.taskId,
      user: req.user?.id,
      content: req.body.content,
      mentions: req.body.mentions ?? [],
    });
    res.status(201).json({ success: true, message: 'Comment added successfully', data: comment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Comment creation failed';
    res.status(400).json({ success: false, message });
  }
};

export const getTaskComments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ task: req.params.taskId }).populate('user', 'name avatar email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch comments';
    res.status(400).json({ success: false, message });
  }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    if (comment.user.toString() !== req.user?.id) {
      res.status(403).json({ success: false, message: 'You can only edit your own comments' });
      return;
    }

    comment.content = req.body.content;
    await comment.save();
    res.status(200).json({ success: true, message: 'Comment updated successfully', data: comment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Comment update failed';
    res.status(400).json({ success: false, message });
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    if (comment.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Comment deletion failed';
    res.status(400).json({ success: false, message });
  }
};
