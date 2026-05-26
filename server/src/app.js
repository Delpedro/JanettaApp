import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/adminProducts.js';
import paymentsRouter from './routes/payments.js';
import webhooksRouter from './routes/webhooks.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Webhook route must receive raw body — mount before express.json()
app.use('/api/webhooks', webhooksRouter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentsRouter);

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
