import { Request, Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getPlates = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // Obtener placas con paginación
    const plates = await query(
      `SELECT * FROM plates WHERE is_active = TRUE
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Obtener conteo total
    const countResult = await query(
      'SELECT COUNT(*) as total FROM plates WHERE is_active = TRUE'
    );

    const total = countResult[0].total;

    res.json({
      plates,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPlates: total
    });
  } catch (error) {
    logger.error('Get plates error:', error);
    res.status(200).json({
      plates: [],
      currentPage: page,
      totalPages: 0,
      totalPlates: 0
    });
  }
};

export const getPlateStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) AS active,
              SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) AS inactive
       FROM plates`
    );
    res.json(stats[0]);
  } catch (error) {
    logger.error('Get plate stats error:', error);
    res.status(500).json({ total: 0, active: 0, inactive: 0 });
  }
};

export const getPlate = async (req: Request, res: Response): Promise<void> => {
  try {
    const plates = await query(
      'SELECT * FROM plates WHERE id = ? AND is_active = TRUE',
      [req.params.id]
    );

    if (plates.length === 0) {
      res.status(404).json({ error: 'Plate not found' });
      return;
    }

    res.json(plates[0]);
  } catch (error) {
    logger.error('Get plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPlate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plateNumber, owner, vehicleType, vehicleModel, color, isActive = true } = req.body;

    // Verificar si la placa ya existe
    const existingPlates = await query(
      'SELECT id FROM plates WHERE plate_number = ?',
      [plateNumber.toUpperCase()]
    );

    if (existingPlates.length > 0) {
      res.status(400).json({ error: 'Plate already exists' });
      return;
    }

    // Crear nueva placa
    const result = await query(
      `INSERT INTO plates (plate_number, owner, vehicle_type, vehicle_model, color, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [plateNumber.toUpperCase(), owner, vehicleType, vehicleModel, color, isActive]
    );

    // Obtener la placa creada
    const newPlates = await query(
      'SELECT * FROM plates WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newPlates[0]);
  } catch (error) {
    logger.error('Create plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePlate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { owner, vehicleType, vehicleModel, color, isActive } = req.body;

    // Verificar si la placa existe
    const existingPlates = await query(
      'SELECT id FROM plates WHERE id = ?',
      [req.params.id]
    );

    if (existingPlates.length === 0) {
      res.status(404).json({ error: 'Plate not found' });
      return;
    }

    // Actualizar placa
    await query(
      `UPDATE plates SET owner = ?, vehicle_type = ?, vehicle_model = ?, 
       color = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [owner, vehicleType, vehicleModel, color, isActive, req.params.id]
    );

    // Obtener la placa actualizada
    const updatedPlates = await query(
      'SELECT * FROM plates WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedPlates[0]);
  } catch (error) {
    logger.error('Update plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePlate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verificar si la placa existe
    const existingPlates = await query(
      'SELECT id FROM plates WHERE id = ?',
      [req.params.id]
    );

    if (existingPlates.length === 0) {
      res.status(404).json({ error: 'Plate not found' });
      return;
    }

    // Eliminar placa (o marcar como inactiva)
    await query(
      'UPDATE plates SET is_active = FALSE WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Plate deleted successfully' });
  } catch (error) {
    logger.error('Delete plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
