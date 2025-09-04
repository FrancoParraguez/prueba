import express from 'express';
import { body } from 'express-validator';
import { getPlates, getPlate, createPlate, updatePlate, deletePlate, getPlateStats } from '../controllers/plateController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getPlates);
router.get('/stats', authorize('admin'), getPlateStats);
router.get('/:id', getPlate);

// Only admins can modify plates
router.post('/', [
  authorize('admin'),
  body('plateNumber').notEmpty().withMessage('Plate number is required'),
  body('owner').notEmpty().withMessage('Owner is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('vehicleModel').notEmpty().withMessage('Vehicle model is required'),
  body('color').notEmpty().withMessage('Color is required'),
  body('isActive').optional().isBoolean().withMessage('Active status must be boolean'),
  handleValidationErrors
], createPlate);

router.put('/:id', [
  authorize('admin'),
  body('owner').notEmpty().withMessage('Owner is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('vehicleModel').notEmpty().withMessage('Vehicle model is required'),
  body('color').notEmpty().withMessage('Color is required'),
  body('isActive').isBoolean().withMessage('Active status is required'),
  handleValidationErrors
], updatePlate);

router.delete('/:id', authorize('admin'), deletePlate);

export default router;
