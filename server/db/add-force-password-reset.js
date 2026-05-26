import 'dotenv/config';
import db from './client.js';

await db.execute(
  'ALTER TABLE users ADD COLUMN force_password_reset INTEGER NOT NULL DEFAULT 0'
);
console.log('Done.');
