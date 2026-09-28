import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/projects/:projectId/activity', (_req, res) => {
  res.status(200).json({ success: true, data: [] });
});
router.get('/tasks/:taskId/activity', (_req, res) => {
  res.status(200).json({ success: true, data: [] });
});

export default router;
