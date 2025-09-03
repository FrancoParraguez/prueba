import { Request, Response } from 'express';
import { query } from '../config/database';
import plateRecognizer from '../utils/plateRecognizer';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const processImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    // Simular reconocimiento de patente (o usar la API real)
    const mockPlates = ['ABC123', 'XYZ789', 'JKL456', 'MNO123'];
    const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    const confidence = Math.random() * 30 + 70; // 70-100% confidence

    // Buscar la placa en la base de datos MySQL
    const plates = await query(
      'SELECT * FROM plates WHERE plate_number = ? AND is_active = TRUE',
      [randomPlate]
    );

    const isMatch = plates.length > 0;
    const plateInfo = plates[0] || null;
    
    // Guardar la verificación en la base de datos
    const result = await query(
      `INSERT INTO verifications 
       (plate_number, recognized_plate, confidence, image_url, is_match, verified_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [randomPlate, randomPlate, confidence, `/uploads/${req.file.originalname}`, isMatch, req.user.id]
    );

    // Preparar respuesta
    const response = {
      recognizedPlate: randomPlate,
      confidence: confidence,
      isMatch,
      plateInfo: plateInfo,
      vehicle: {
        type: plateInfo?.vehicle_type || 'car',
        color: plateInfo?.color || 'blue',
        make: 'Unknown',
        model: plateInfo?.vehicle_model || 'Unknown'
      },
      timestamp: new Date()
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getVerificationHistory = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const verifications = await query(
      `SELECT v.*, u.name as verified_by_name, u.email as verified_by_email
       FROM verifications v
       LEFT JOIN users u ON v.verified_by = u.id
       ORDER BY v.timestamp DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM verifications'
    );

    const total = countResult[0].total;

    res.status(200).json({
      verifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVerifications: total
    });
  } catch (error) {
    logger.error('Error fetching verification history:', error);
    res.status(200).json({
      verifications: [],
      currentPage: page,
      totalPages: 0,
      totalVerifications: 0
    });
  }
};