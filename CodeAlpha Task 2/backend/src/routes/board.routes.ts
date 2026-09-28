import { Router } from 'express';
import {
  createBoard,
  deleteBoard,
  getBoardById,
  listBoards,
  updateBoard,
} from '../controllers/board.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/projects/:projectId/boards', createBoard);
router.get('/projects/:projectId/boards', listBoards);
router.get('/boards/:id', getBoardById);
router.put('/boards/:id', updateBoard);
router.delete('/boards/:id', deleteBoard);

export default router;
