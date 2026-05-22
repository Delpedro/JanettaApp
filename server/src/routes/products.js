import { Router } from 'express';
import db from '../../db/client.js';

const router = Router();

function normalize(row) {
  return {
    id: row.id,
    name_pl: row.name_pl,
    name_en: row.name_en,
    description_pl: row.description_pl,
    description_en: row.description_en,
    price: row.price,
    image: row.image,
    inStock: Boolean(row.in_stock),
    madeToOrder: Boolean(row.made_to_order),
    stockQty: row.stock_qty,
  };
}

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.execute('SELECT * FROM products WHERE published = 1');
    res.json(rows.map(normalize));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ? AND published = 1',
      args: [req.params.id],
    });
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(normalize(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
