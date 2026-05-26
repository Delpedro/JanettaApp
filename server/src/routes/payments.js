import { Router } from 'express';
import Stripe from 'stripe';
import db from '../../db/client.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-intent', async (req, res) => {
  const { customer_name, customer_email, address_street, address_city, address_postal, items } = req.body;

  if (!customer_name || !customer_email || !address_street || !address_city || !address_postal
    || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (customer_name.length > 200) return res.status(400).json({ error: 'Name too long' });
  if (customer_email.length > 254) return res.status(400).json({ error: 'Email too long' });
  if (address_street.length > 200) return res.status(400).json({ error: 'Street too long' });
  if (address_city.length > 100) return res.status(400).json({ error: 'City too long' });
  if (address_postal.length > 20) return res.status(400).json({ error: 'Postal code too long' });
  if (items.length > 50) return res.status(400).json({ error: 'Too many items' });

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

    // Create Stripe PaymentIntent — amount in grosz (PLN × 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'pln',
      receipt_email: customer_email,
      metadata: { customer_name, customer_email },
    });

    // Insert draft order — stock NOT decremented yet (happens in webhook on payment_intent.succeeded)
    const orderResult = await db.execute({
      sql: `INSERT INTO orders (customer_name, customer_email, address_street, address_city, address_postal, total, status, stripe_payment_intent_id)
            VALUES (?, ?, ?, ?, ?, ?, 'payment_pending', ?)`,
      args: [customer_name, customer_email, address_street, address_city, address_postal, total, paymentIntent.id],
    });

    const orderId = Number(orderResult.lastInsertRowid);

    const itemStatements = items.map(item => {
      const p = productMap[String(item.product_id)];
      const qty = parseInt(item.qty);
      return {
        sql: `INSERT INTO order_items (order_id, product_id, qty, price_snapshot, name_pl, name_en)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [orderId, item.product_id, qty, p.price, p.name_pl, p.name_en],
      };
    });

    await db.batch(itemStatements, 'write');

    res.json({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

export default router;
