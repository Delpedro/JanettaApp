import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../../db/client.js';
import { requireAuth } from '../middleware/auth.js';
import { generateUploadSignature } from '../lib/cloudinary.js';
import { translateToEnglish } from '../lib/translate.js';

const router = Router();

function normalize(row) {
  return {
    id: row.id,
    name_pl: row.name_pl,
    name_en: row.name_en,
    price: row.price,
    image: row.image,
    inStock: Boolean(row.in_stock),
    madeToOrder: Boolean(row.made_to_order),
    stockQty: row.stock_qty,
    published: Boolean(row.published),
  };
}

router.get('/products', requireAuth, async (_req, res) => {
  try {
    const { rows } = await db.execute('SELECT * FROM products ORDER BY id');
    res.json(rows.map(normalize));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/upload-signature', requireAuth, (_req, res) => {
  try {
    res.json(generateUploadSignature());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

router.post('/products', requireAuth, async (req, res) => {
  const { name_pl, description_pl, price, made_to_order, stock_qty, image, published } = req.body;

  if (!name_pl || !description_pl || !price) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const priceInt = Math.round(Number(price));
  if (!Number.isFinite(priceInt) || priceInt < 1) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  let name_en, description_en;
  try {
    ({ name_en, description_en } = await translateToEnglish(name_pl.trim(), description_pl.trim()));
  } catch (err) {
    console.error('Translation failed:', err);
    return res.status(500).json({ error: 'Translation failed' });
  }

  const mto = made_to_order ? 1 : 0;
  const inStock = mto ? 0 : 1;
  const qty = mto ? 0 : Math.max(0, parseInt(stock_qty) || 0);
  const pub = published ? 1 : 0;

  try {
    const result = await db.execute({
      sql: `INSERT INTO products (name_pl, name_en, description_pl, description_en, price, made_to_order, in_stock, stock_qty, image, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [name_pl.trim(), name_en, description_pl.trim(), description_en, priceInt, mto, inStock, qty, image || null, pub],
    });
    res.status(201).json({ id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.patch('/products/:id', requireAuth, async (req, res) => {
  const { published } = req.body;
  if (published === undefined) return res.status(400).json({ error: 'published required' });
  try {
    await db.execute({
      sql: 'UPDATE products SET published = ? WHERE id = ?',
      args: [published ? 1 : 0, req.params.id],
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.post('/users', requireAuth, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const { rows } = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email.trim().toLowerCase()],
    });
    if (rows.length) return res.status(409).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(password, 12);
    await db.execute({
      sql: 'INSERT INTO users (email, password_hash, role, force_password_reset) VALUES (?, ?, ?, 1)',
      args: [email.trim().toLowerCase(), hash, 'admin'],
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;
