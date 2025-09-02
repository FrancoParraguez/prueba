import express from 'express';
import { processImage, getVerificationHistory } from '../controllers/recognitionController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/process', upload.single('image'), processImage);
router.get('/history', getVerificationHistory);

export default router;