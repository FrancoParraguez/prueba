import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Soporta "authorization" como string o string[]
    const hdr = req.headers['authorization'];
    let bearer = Array.isArray(hdr) ? hdr[0] : hdr;
    let token = bearer?.startsWith('Bearer ') ? bearer.slice(7).trim() : undefined;

    // Fallbacks aceptados
    if (!token) token = req.header('x-auth-token') ?? (req as any).cookies?.token;

    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Server misconfiguration: JWT secret missing.' });
      return;
    }

    const decoded = jwt.verify(token, secret) as { userId: number };

    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      res.status(401).json({ error: 'Token is not valid.' });
      return;
    }

    req.user = users[0];
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Access denied.' });
      return;
    }
    if (roles.length && !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
};
