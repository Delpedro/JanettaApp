import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import db from '../../db/client.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email.trim().toLowerCase()],
    });

    const user = rows[0];
    const valid = user && (await bcrypt.compare(password, user.password_hash));

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tv: user.token_version },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('adminToken', token, COOKIE_OPTS);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        forcePasswordReset: Boolean(user.force_password_reset),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.execute({
      sql: 'SELECT id, email, role, force_password_reset FROM users WHERE id = ?',
      args: [req.user.id],
    });
    if (!rows.length) return res.status(401).json({ error: 'Unauthorized' });
    const u = rows[0];
    res.json({ id: u.id, email: u.email, role: u.role, forcePasswordReset: Boolean(u.force_password_reset) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('adminToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  res.json({ ok: true });
});

router.patch('/password', requireAuth, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const hash = await bcrypt.hash(newPassword, 12);
    await db.execute({
      sql: 'UPDATE users SET password_hash = ?, force_password_reset = 0, token_version = token_version + 1 WHERE id = ?',
      args: [hash, req.user.id],
    });
    const { rows } = await db.execute({ sql: 'SELECT token_version FROM users WHERE id = ?', args: [req.user.id] });
    const newToken = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role, tv: Number(rows[0].token_version) },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('adminToken', newToken, COOKIE_OPTS);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Password update failed' });
  }
});

router.get('/setup/status', async (_req, res) => {
  try {
    const { rows } = await db.execute('SELECT COUNT(*) as count FROM users');
    res.json({ setupRequired: Number(rows[0].count) === 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check setup status' });
  }
});

router.post('/setup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const { rows } = await db.execute('SELECT COUNT(*) as count FROM users');
    if (Number(rows[0].count) > 0) {
      return res.status(403).json({ error: 'Setup already complete' });
    }

    const hash = await bcrypt.hash(password, 12);
    await db.execute({
      sql: 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      args: [email.trim().toLowerCase(), hash, 'admin'],
    });

    res.status(201).json({ message: 'Admin account created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Setup failed' });
  }
});

export default router;
