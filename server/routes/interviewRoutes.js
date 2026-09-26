import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  listInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
} from '../controllers/interviewController.js';

const router = Router();
router.use(protect);

router.get('/', listInterviews);
router.post('/', createInterview);
router.get('/:id', getInterview);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
