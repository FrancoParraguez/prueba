// backend/src/controllers/recognitionController.ts
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

// POST /api/recognition/process
export const processImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    // Simulación de reconocimiento (reemplázalo por tu LPR real)
    const mockPlates = ['ABC123', 'XYZ789', 'JKL456', 'MNO123'];
    const recognizedPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    const confidence = Math.random() * 30 + 70; // 70–100

    // ¿Existe placa activa?
    const plates: any[] = await query(
      'SELECT * FROM plates WHERE plate_number = ? AND is_active = TRUE',
      [recognizedPlate]
    );
    const isMatch = plates.length > 0;
    const plateInfo = plates[0] || null;

    // Detectar columnas reales de verifications
    const cols = await getTableColumns('verifications');

    const insertCols: string[] = [];
    const insertVals: any[] = [];

    if (cols.has('plate_number'))     { insertCols.push('plate_number');     insertVals.push(recognizedPlate); }
    if (cols.has('recognized_plate')) { insertCols.push('recognized_plate'); insertVals.push(recognizedPlate); }
    if (cols.has('confidence'))       { insertCols.push('confidence');       insertVals.push(confidence); }
    if (cols.has('image_url'))        { insertCols.push('image_url');        insertVals.push(`/uploads/${req.file.originalname}`); }
    if (cols.has('is_match'))         { insertCols.push('is_match');         insertVals.push(isMatch ? 1 : 0); }
    if (cols.has('verified_by'))      { insertCols.push('verified_by');      insertVals.push(req.user?.id ?? null); }

    if (insertCols.length > 0) {
      const placeholders = insertVals.map(() => '?').join(', ');
      const sql = `INSERT INTO verifications (${insertCols.join(', ')}) VALUES (${placeholders})`;
      await query(sql, insertVals);
    } else {
      logger?.warn?.('No insertable columns found on verifications.');
    }

    res.status(201).json({
      recognized_plate: recognizedPlate,
      confidence,
      is_match: isMatch,
      plateInfo,
      vehicle: {
        type:  plateInfo?.vehicle_type  || 'car',
        color: plateInfo?.color         || 'blue',
        make:  'Unknown',
        model: plateInfo?.vehicle_model || 'Unknown',
      },
      timestamp: new Date().toISOString(),
      verified_by_name: req.user?.name ?? 'Sistema',
    });
  } catch (error) {
    logger?.error?.('Error processing image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/recognition/history?page=1&limit=20
export const getVerificationHistory = async (req: Request, res: Response): Promise<void> => {
  try {
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

    // Columnas existentes
    const cols = await getTableColumns('verifications');
    const has  = (c: string) => cols.has(c);

    // Expresiones tolerantes
    const plateExpr = has('recognized_plate') ? 'v.recognized_plate'
                    : has('plate_number')     ? 'v.plate_number'
                    : 'NULL';

    const confExpr  = has('confidence') ? 'v.confidence' : '0';

    const tsCandidate = ['created_at', 'timestamp', 'registered_at', 'updated_at'].find(c => has(c));
    const tsExpr      = tsCandidate ? `v.${tsCandidate}` : 'NOW()';

    let isMatchExpr = has('is_match') ? 'v.is_match' : '0';
    if (!has('is_match')) {
      if (has('plate_number')) {
        isMatchExpr = `EXISTS(SELECT 1 FROM plates p WHERE p.plate_number = v.plate_number AND p.is_active = TRUE)`;
      } else if (has('recognized_plate')) {
        isMatchExpr = `EXISTS(SELECT 1 FROM plates p WHERE p.plate_number = v.recognized_plate AND p.is_active = TRUE)`;
      }
    }

    const doJoinUsers = has('verified_by');
    const verifiedByNameExpr = doJoinUsers ? `COALESCE(u.name, 'Sistema')` : `'Sistema'`;
    const imageExpr = has('image_url') ? ', v.image_url' : '';

    // Incrustar LIMIT/OFFSET ya sanitizados (evita ER_WRONG_ARGUMENTS 1210)
    const selectSql = `
      SELECT
        v.id,
        ${plateExpr} AS recognized_plate,
        ${confExpr}  AS confidence,
        ${isMatchExpr} AS is_match,
        ${tsExpr}   AS ts,
        ${verifiedByNameExpr} AS verified_by_name
        ${imageExpr}
      FROM verifications v
      ${doJoinUsers ? 'LEFT JOIN users u ON u.id = v.verified_by' : ''}
      ORDER BY ts DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Total
    const totalRows: any[] = await query('SELECT COUNT(*) AS total FROM verifications', []);
    const total = Number(totalRows?.[0]?.total ?? 0);

    // Ejecutar
    const rows: any[] = await query(selectSql, []);

    const data = rows.map(r => ({
      id: String(r.id),
      recognized_plate: r.recognized_plate ?? '',
      confidence: Number(r.confidence ?? 0),
      is_match: !!(r.is_match ?? 0),
      // 👇 aquí estaba el typo: toISOString()
      timestamp: r.ts ? new Date(r.ts).toISOString() : new Date(0).toISOString(),
      verified_by_name: r.verified_by_name ?? 'Sistema',
      ...(has('image_url') ? { image_url: r.image_url ?? undefined } : {}),
    }));

    res.json({ data, page, limit, total });
  } catch (error: any) {
    logger?.error?.('Error fetching verification history:', error);
    res.status(500).json({
      error: 'Could not fetch verification history',
      detail: error.code || error.message,
    });
  }
};
