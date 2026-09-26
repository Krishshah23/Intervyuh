import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getInsights } from '../controllers/insightsController.js';

const router = Router();
router.use(protect);

router.get('/', getInsights);

export default router;
