import { Router } from 'express';
import db from '../../db/client.js';

const router = Router();

router.post('/', async (req, res) => {
  const { customer_name, customer_email, address_street, address_city, address_postal, total, items } = req.body;

  if (!customer_name || !customer_email || !address_street || !address_city || !address_postal || !total || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const orderResult = await db.execute({
      sql: `INSERT INTO orders (customer_name, customer_email, address_street, address_city, address_postal, total)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [customer_name, customer_email, address_street, address_city, address_postal, total],
    });

    const orderId = orderResult.lastInsertRowid;

    const statements = [];
    for (const item of items) {
      statements.push({
        sql: `INSERT INTO order_items (order_id, product_id, qty, price_snapshot, name_pl, name_en)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [orderId, item.product_id, item.qty, item.price_snapshot, item.name_pl, item.name_en],
      });
      statements.push({
        sql: `UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND made_to_order = 0 AND in_stock = 1`,
        args: [item.qty, item.product_id],
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
