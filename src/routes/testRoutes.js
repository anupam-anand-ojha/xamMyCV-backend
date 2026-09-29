import express from 'express';
import { generateTest, getTest, submitTest } from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate/:resumeId', protect, generateTest);
router.get('/:id', protect, getTest);
router.post('/:id/submit', protect, submitTest);

export default router;