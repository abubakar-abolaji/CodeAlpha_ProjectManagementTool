import { Router } from 'express';
import {
  assignTask,
  changeTaskStatus,
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  reorderTask,
  updateTask,
} from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/', createTask);
router.get('/', listTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', changeTaskStatus);
router.patch('/:id/assign', assignTask);
router.patch('/:id/position', reorderTask);

export default router;
