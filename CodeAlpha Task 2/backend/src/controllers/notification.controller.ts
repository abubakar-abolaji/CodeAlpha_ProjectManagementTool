import type { Response } from 'express';
import { Notification } from '../models/Notification.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
    res.status(400).json({ success: false, message });
  }
};

export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { isRead: true }, { new: true });
    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update notification';
    res.status(400).json({ success: false, message });
  }
};

export const markAllNotificationsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await Notification.updateMany({ user: req.user.id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to mark notifications read';
    res.status(400).json({ success: false, message });
  }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete notification';
    res.status(400).json({ success: false, message });
  }
};
