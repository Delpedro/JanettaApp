import express, { Router } from 'express';
import Stripe from 'stripe';
import db from '../../db/client.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    await handlePaymentSucceeded(pi.id);
  } else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await handlePaymentFailed(pi.id);
  }

  res.json({ received: true });
});

async function handlePaymentSucceeded(paymentIntentId) {
  const { rows } = await db.execute({
    sql: `SELECT id FROM orders WHERE stripe_payment_intent_id = ? AND status = 'payment_pending'`,
    args: [paymentIntentId],
  });
  if (rows.length === 0) return;

  const orderId = rows[0].id;

  const { rows: orderItems } = await db.execute({
    sql: `SELECT product_id, qty FROM order_items WHERE order_id = ?`,
    args: [orderId],
  });

  const statements = [
    {
      sql: `UPDATE orders SET status = 'paid' WHERE id = ?`,
      args: [orderId],
    },
    ...orderItems.map(item => ({
      sql: `UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND made_to_order = 0 AND in_stock = 1`,
      args: [item.qty, item.product_id],
    })),
  ];

  await db.batch(statements, 'write');
}

async function handlePaymentFailed(paymentIntentId) {
  await db.execute({
    sql: `UPDATE orders SET status = 'failed' WHERE stripe_payment_intent_id = ? AND status = 'payment_pending'`,
    args: [paymentIntentId],
  });
}

export default router;
