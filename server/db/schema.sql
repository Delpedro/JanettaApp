CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_pl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_pl TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price INTEGER NOT NULL,
  in_stock INTEGER NOT NULL DEFAULT 1,
  made_to_order INTEGER NOT NULL DEFAULT 0,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  force_password_reset INTEGER NOT NULL DEFAULT 0,
  token_version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_postal TEXT NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  qty INTEGER NOT NULL,
  price_snapshot INTEGER NOT NULL,
  name_pl TEXT NOT NULL,
  name_en TEXT NOT NULL
);
