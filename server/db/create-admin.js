import 'dotenv/config';
import readline from 'readline';
import bcrypt from 'bcryptjs';
import db from './client.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

const email = (await ask('Admin email: ')).trim().toLowerCase();
const password = await ask('Password (input visible — save it somewhere safe): ');
rl.close();

if (!email || !password) {
  console.error('Email and password are required.');
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(password, 12);
  await db.execute({
    sql: 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    args: [email, hash, 'admin'],
  });
  console.log(`Admin created: ${email}`);
} catch (err) {
  if (err.message?.includes('UNIQUE')) {
    console.log(`Admin already exists: ${email}`);
  } else {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}
