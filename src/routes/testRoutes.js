import express from 'express';
import { generateTest, getTest } from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate/:resumeId', protect, generateTest);
router.get('/:id', protect, getTest);

export default router;