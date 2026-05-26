import 'dotenv/config';
import db from './client.js';

await db.execute(`ALTER TABLE orders ADD COLUMN stripe_payment_intent_id TEXT`);
console.log('Migration complete: stripe_payment_intent_id added to orders');
