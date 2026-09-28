import { Router } from 'express';
import { getCurrentUser, getUserById, listUsers, updateCurrentUser } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/me', getCurrentUser);
router.put('/me', updateCurrentUser);
router.get('/', listUsers);
router.get('/:id', getUserById);

export default router;
