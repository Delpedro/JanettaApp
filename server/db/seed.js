import 'dotenv/config';
import db from './client.js';

const products = [
  {
    name_pl: 'Serce dekoracyjne',
    name_en: 'Decorative Heart',
    description_pl: 'Ręcznie robione serce z tkaniny i wypełnieniem. Idealne jako prezent lub dekoracja domu.',
    description_en: 'Handmade fabric heart with filling. Perfect as a gift or home decoration.',
    price: 45,
    image: '/images/product1.JPEG',
    in_stock: 1,
    made_to_order: 0,
    stock_qty: 3,
  },
  {
    name_pl: 'Krasnal ręcznie robiony',
    name_en: 'Handmade Gnome',
    description_pl: 'Krasnal wykonany z filcu i naturalnych materiałów. Każdy jest niepowtarzalny.',
    description_en: 'Gnome made from felt and natural materials. Each one is unique.',
    price: 65,
    image: '/images/product2.JPEG',
    in_stock: 1,
    made_to_order: 0,
    stock_qty: 5,
  },
  {
    name_pl: 'Pisanka decoupage',
    name_en: 'Decoupage Easter Egg',
    description_pl: 'Pisanka wielkanocna zdobiona techniką decoupage. Wykonywana na zamówienie.',
    description_en: 'Easter egg decorated with the decoupage technique. Made to order.',
    price: 30,
    image: '/images/product3.JPEG',
    in_stock: 0,
    made_to_order: 1,
    stock_qty: 0,
  },
  {
    name_pl: 'Serduszko z tkaniny',
    name_en: 'Fabric Heart Keepsake',
    description_pl: 'Dekoracyjne serduszko z recyklingowanych tkanin. Każde niepowtarzalne.',
    description_en: 'Decorative heart made from upcycled fabrics. Each one is unique.',
    price: 35,
    image: '/images/product4.JPEG',
    in_stock: 1,
    made_to_order: 0,
    stock_qty: 2,
  },
  {
    name_pl: 'Dekoracja wielkanocna',
    name_en: 'Easter Decoration',
    description_pl: 'Ręcznie robiona dekoracja wielkanocna z naturalnych materiałów.',
    description_en: 'Handmade Easter decoration from natural materials.',
    price: 50,
    image: '/images/product5.JPEG',
    in_stock: 1,
    made_to_order: 0,
    stock_qty: 4,
  },
  {
    name_pl: 'Makatka szydełkowa',
    name_en: 'Crochet Wall Art',
    description_pl: 'Ręcznie robiona makatka szydełkowa. Wykonywana na zamówienie.',
    description_en: 'Handmade crochet wall hanging. Made to order.',
    price: 120,
    image: '/images/product6.JPEG',
    in_stock: 0,
    made_to_order: 1,
    stock_qty: 0,
  },
];

const { rows } = await db.execute('SELECT COUNT(*) as count FROM products');
if (rows[0].count > 0) {
  console.log('Products table already has data — skipping seed.');
  process.exit(0);
}

for (const p of products) {
  await db.execute({
    sql: `INSERT INTO products (name_pl, name_en, description_pl, description_en, price, image, in_stock, made_to_order, stock_qty)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [p.name_pl, p.name_en, p.description_pl, p.description_en, p.price, p.image, p.in_stock, p.made_to_order, p.stock_qty],
  });
}

console.log(`Seeded ${products.length} products.`);
