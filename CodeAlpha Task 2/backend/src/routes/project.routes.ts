import { Router } from 'express';
import {
  addMember,
  createProject,
  deleteProject,
  getProjectById,
  listMembers,
  listProjects,
  updateProject,
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/', createProject);
router.get('/', listProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMember);
router.get('/:id/members', listMembers);

export default router;
