import jwt from 'jsonwebtoken';
import db from '../../db/client.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.adminToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await db.execute({
      sql: 'SELECT token_version FROM users WHERE id = ?',
      args: [payload.id],
    });
    if (!rows.length || rows[0].token_version !== payload.tv) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
