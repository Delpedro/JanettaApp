import { Router } from 'express';
import db from '../../db/client.js';

const router = Router();

router.post('/', async (req, res) => {
  const { customer_name, customer_email, address_street, address_city, address_postal, items } = req.body;

  if (!customer_name || !customer_email || !address_street || !address_city || !address_postal
    || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ids = items.map(i => i.product_id);
  if (ids.some(id => !Number.isInteger(Number(id)))) {
    return res.status(400).json({ error: 'Invalid item' });
  }

  try {
    const placeholders = ids.map(() => '?').join(',');
    const { rows: products } = await db.execute({
      sql: `SELECT id, price, name_pl, name_en, in_stock, made_to_order, stock_qty FROM products WHERE id IN (${placeholders}) AND published = 1`,
      args: ids,
    });

    const productMap = Object.fromEntries(products.map(p => [String(p.id), p]));

    for (const item of items) {
      const p = productMap[String(item.product_id)];
      if (!p) return res.status(400).json({ error: `Product ${item.product_id} not found` });
      const qty = parseInt(item.qty);
      if (!Number.isFinite(qty) || qty < 1) return res.status(400).json({ error: 'Invalid quantity' });
      if (!p.made_to_order && p.stock_qty < qty) return res.status(409).json({ error: 'Insufficient stock' });
    }

    const total = items.reduce((sum, item) => {
      const p = productMap[String(item.product_id)];
      return sum + p.price * parseInt(item.qty);
    }, 0);

    const orderResult = await db.execute({
      sql: `INSERT INTO orders (customer_name, customer_email, address_street, address_city, address_postal, total)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [customer_name, customer_email, address_street, address_city, address_postal, total],
    });

    const orderId = orderResult.lastInsertRowid;

    const statements = [];
    for (const item of items) {
      const p = productMap[String(item.product_id)];
      const qty = parseInt(item.qty);
      statements.push({
        sql: `INSERT INTO order_items (order_id, product_id, qty, price_snapshot, name_pl, name_en)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [orderId, item.product_id, qty, p.price, p.name_pl, p.name_en],
      });
      statements.push({
        sql: `UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND made_to_order = 0 AND in_stock = 1`,
        args: [qty, item.product_id],
      });
    }

    await db.batch(statements, 'write');

    res.status(201).json({ orderId: Number(orderId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
