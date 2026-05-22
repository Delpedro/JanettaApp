import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../db/client.js';

const router = Router();

router.post('/login', async (req, res) => {
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
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
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
