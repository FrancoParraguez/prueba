import { Request, Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

// Helper: columnas existentes en una tabla
async function getTableColumns(table: string): Promise<Set<string>> {
  const rows: any[] = await query(
    `SELECT COLUMN_NAME
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?`,
    [table]
  );
  return new Set(rows.map(r => String(r.COLUMN_NAME)));
}

// GET /api/plates?page=&limit=
export const getPlates = async (req: Request, res: Response): Promise<void> => {
  // Sanitizar paginación
  const pageRaw  = Array.isArray(req.query.page)  ? req.query.page[0]  : req.query.page;
  const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

  let page  = Number(pageRaw  ?? 1);
  let limit = Number(limitRaw ?? 10);

  if (!Number.isFinite(page)  || page  < 1) page  = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  page  = Math.floor(page);
  limit = Math.floor(limit);
  const offset = Math.max(0, (page - 1) * limit);

  try {
    // Elegir columna de orden de forma tolerante
    const cols = await getTableColumns('plates');
    const orderCol = cols.has('created_at')
      ? 'created_at'
      : (cols.has('timestamp') ? 'timestamp' : 'id');

    // IMPORTANTE: incrustar enteros sanitizados (evita ER_WRONG_ARGUMENTS 1210)
    const listSql = `
      SELECT *
      FROM plates
      ORDER BY ${orderCol} DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Obtener placas + total
    const [plates, countResult]: [any[], any[]] = await Promise.all([
      query(listSql, []),
      query('SELECT COUNT(*) AS total FROM plates', []),
    ]);

    const total = Number(countResult?.[0]?.total ?? 0);

    res.json({
      plates,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPlates: total,
    });
  } catch (error) {
    logger?.error?.('Get plates error:', error);
    res.status(500).json({
      error: 'Could not fetch plates',
      plates: [],
      currentPage: page,
      totalPages: 0,
      totalPlates: 0,
    });
  }
};

export const getPlateStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats: any[] = await query(
      `
      SELECT COUNT(*) AS total,
             SUM(CASE WHEN is_active = TRUE  THEN 1 ELSE 0 END) AS active,
             SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) AS inactive
      FROM plates
      `
    );
    res.json(stats?.[0] ?? { total: 0, active: 0, inactive: 0 });
  } catch (error) {
    logger?.error?.('Get plate stats error:', error);
    res.status(500).json({ total: 0, active: 0, inactive: 0 });
  }
};

export const getPlate = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows: any[] = await query('SELECT * FROM plates WHERE id = ?', [req.params.id]);

    if (!rows?.length) {
      res.status(404).json({ error: 'Plate not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    logger?.error?.('Get plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPlate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plateNumber, owner, vehicleType, vehicleModel, color, isActive = true } = req.body;

    if (!plateNumber || typeof plateNumber !== 'string') {
      res.status(400).json({ error: 'plateNumber is required' });
      return;
    }

    const normalized = plateNumber.toUpperCase().trim();

    // Verificar si la placa ya existe
    const existing: any[] = await query(
      'SELECT id FROM plates WHERE plate_number = ?',
      [normalized]
    );

    if (existing?.length) {
      res.status(400).json({ error: 'Plate already exists' });
      return;
    }

    // Crear nueva placa
    const result: any = await query(
      `INSERT INTO plates (plate_number, owner, vehicle_type, vehicle_model, color, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [normalized, owner ?? null, vehicleType ?? null, vehicleModel ?? null, color ?? null, !!isActive]
    );

    // Obtener la placa creada
    const created: any[] = await query('SELECT * FROM plates WHERE id = ?', [result.insertId]);

    res.status(201).json(created?.[0] ?? { id: result.insertId, plate_number: normalized });
  } catch (error) {
    logger?.error?.('Create plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePlate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { owner, vehicleType, vehicleModel, color, isActive } = req.body;

    // Verificar si la placa existe
    const existing: any[] = await query('SELECT id FROM plates WHERE id = ?', [req.params.id]);
    if (!existing?.length) {
      res.status(404).json({ error: 'Plate not found' });
      return;
    }

    // Actualizar placa (COALESCE mantiene el valor si se pasa null/undefined)
    await query(
      `UPDATE plates SET
         owner        = COALESCE(?, owner),
         vehicle_type = COALESCE(?, vehicle_type),
         vehicle_model= COALESCE(?, vehicle_model),
         color        = COALESCE(?, color),
         is_active    = COALESCE(?, is_active),
         updated_at   = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        owner ?? null,
        vehicleType ?? null,
        vehicleModel ?? null,
        color ?? null,
        typeof isActive === 'boolean' ? isActive : null,
        req.params.id
      ]
    );

    // Obtener la placa actualizada
    const rows: any[] = await query('SELECT * FROM plates WHERE id = ?', [req.params.id]);
    res.json(rows?.[0] ?? { id: req.params.id });
  } catch (error) {
    logger?.error?.('Update plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePlate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verificar si la placa existe
    const existing: any[] = await query('SELECT id FROM plates WHERE id = ?', [req.params.id]);
    if (!existing?.length) {
      res.status(404).json({ error: 'Plate not found' });
      return;
    }

    // Soft delete: marcar como inactiva
    await query('UPDATE plates SET is_active = FALSE WHERE id = ?', [req.params.id]);

    res.json({ message: 'Plate deleted successfully' });
  } catch (error) {
    logger?.error?.('Delete plate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
