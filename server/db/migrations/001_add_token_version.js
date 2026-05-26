import db from '../client.js';

const { rows } = await db.execute("PRAGMA table_info(users)");
const hasColumn = rows.some(r => r.name === 'token_version');

if (hasColumn) {
  console.log('token_version already exists — skipping');
} else {
  await db.execute('ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 1');
  console.log('Added token_version column to users');
}
