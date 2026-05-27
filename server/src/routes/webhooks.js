import express, { Router } from 'express';
import Stripe from 'stripe';
import db from '../../db/client.js';
import { sendOrderConfirmation, sendOrderNotificationToAdmin } from '../lib/email.js';

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
    sql: `SELECT id, customer_name, customer_email, address_street, address_city, address_postal, total
          FROM orders WHERE stripe_payment_intent_id = ? AND status = 'payment_pending'`,
    args: [paymentIntentId],
  });
  if (rows.length === 0) return;

  const order = rows[0];

  const { rows: orderItems } = await db.execute({
    sql: `SELECT product_id, qty, price_snapshot, name_pl FROM order_items WHERE order_id = ?`,
    args: [order.id],
  });

  const statements = [
    {
      sql: `UPDATE orders SET status = 'paid' WHERE id = ?`,
      args: [order.id],
    },
    ...orderItems.map(item => ({
      sql: `UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND made_to_order = 0 AND in_stock = 1`,
      args: [item.qty, item.product_id],
    })),
  ];

  await db.batch(statements, 'write');

  try {
    await sendOrderConfirmation({
      to: order.customer_email,
      customerName: order.customer_name,
      orderId: order.id,
      items: orderItems,
      total: order.total,
      address: {
        street: order.address_street,
        city: order.address_city,
        postal: order.address_postal,
      },
    });
  } catch (err) {
    console.error('Order confirmation email failed:', err.message);
  }

  try {
    await sendOrderNotificationToAdmin({
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      items: orderItems,
      total: order.total,
      address: {
        street: order.address_street,
        city: order.address_city,
        postal: order.address_postal,
      },
    });
  } catch (err) {
    console.error('Admin notification email failed:', err.message);
  }
}

async function handlePaymentFailed(paymentIntentId) {
  await db.execute({
    sql: `UPDATE orders SET status = 'failed' WHERE stripe_payment_intent_id = ? AND status = 'payment_pending'`,
    args: [paymentIntentId],
  });
}

export default router;
