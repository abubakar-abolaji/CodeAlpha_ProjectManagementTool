import { Router } from 'express';
import { adminOnly } from '../middleware/admin.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', (_req, res) => {
  res.status(200).json({ success: true, data: { totalUsers: 0, activeUsers: 0, totalProjects: 0, activeProjects: 0, completedProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 } });
});
router.get('/users', (_req, res) => res.status(200).json({ success: true, data: [] }));
router.get('/projects', (_req, res) => res.status(200).json({ success: true, data: [] }));
router.get('/tasks', (_req, res) => res.status(200).json({ success: true, data: [] }));
router.get('/activity', (_req, res) => res.status(200).json({ success: true, data: [] }));
router.patch('/users/:id/status', (_req, res) => res.status(200).json({ success: true, message: 'User status updated' }));
router.patch('/users/:id/role', (_req, res) => res.status(200).json({ success: true, message: 'User role updated' }));
router.delete('/users/:id', (_req, res) => res.status(200).json({ success: true, message: 'User deleted' }));
router.delete('/projects/:id', (_req, res) => res.status(200).json({ success: true, message: 'Project deleted' }));

export default router;
