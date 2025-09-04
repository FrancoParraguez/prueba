import { Router } from 'express';
import { processImage, getVerificationHistory } from '../controllers/recognitionController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

router.options('*', (_req, res) => res.sendStatus(204)); // preflight rápido

router.post('/process', authenticate, upload.single('image'), processImage);
router.get('/history', authenticate, getVerificationHistory);

export default router;
