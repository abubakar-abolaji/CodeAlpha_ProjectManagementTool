import { Router } from 'express';
import { addComment, deleteComment, getTaskComments, updateComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/tasks/:taskId/comments', addComment);
router.get('/tasks/:taskId/comments', getTaskComments);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;
