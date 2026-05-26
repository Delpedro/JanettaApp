import 'dotenv/config';
import db from './client.js';

const fixes = [
  {
    id: 1,
    name_pl: 'Makatka szydełkowa',
    name_en: 'Crochet Wall Hanging',
    description_pl: 'Ręcznie robiona makatka szydełkowa w kształcie koła. Elegancka dekoracja ścienna wykonana ze śnieżnobiałej przędzy — każda niepowtarzalna.',
    description_en: 'Handmade circular crochet wall hanging. Elegant wall decoration crafted from snow-white yarn — each one unique.',
    made_to_order: 1,
    in_stock: 0,
    stock_qty: 0,
  },
  {
    id: 2,
    name_pl: 'Serce "Klucz do serca"',
    name_en: '"Key to My Heart" Keepsake',
    description_pl: 'Dekoracyjne serce wykonane techniką decoupage na tle zabytkowych nut. Z kluczykiem i wstążką — wyjątkowy, romantyczny prezent.',
    description_en: 'Decorative heart made using the decoupage technique on a vintage sheet music background. With a small key and ribbon — a unique, romantic gift.',
    made_to_order: 0,
    in_stock: 1,
    stock_qty: 2,
  },
  {
    id: 3,
    name_pl: 'Obrazek wielkanocny w ramce',
    name_en: 'Framed Easter Picture',
    description_pl: 'Oprawiony obrazek wielkanocny z ręcznie robionym kokardą z tkaniny. Urocza dekoracja na Wielkanoc.',
    description_en: 'Framed Easter picture with a handmade fabric bow. A charming Easter decoration.',
    made_to_order: 0,
    in_stock: 1,
    stock_qty: 3,
  },
  {
    id: 4,
    name_pl: 'Deska dekoracyjna wielkanocna',
    name_en: 'Easter Decoupage Board',
    description_pl: 'Drewniana deska ozdobiona techniką decoupage z motywem wielkanocnym — zajączek, pisanki, koronkowe wstążki.',
    description_en: 'Wooden board decorated with the decoupage technique featuring an Easter motif — bunny, Easter eggs, lace ribbons.',
    made_to_order: 0,
    in_stock: 1,
    stock_qty: 2,
  },
  {
    id: 5,
    name_pl: 'Serduszka z tkaniny (zestaw 3 szt.)',
    name_en: 'Fabric Hearts — Set of 3',
    description_pl: 'Zestaw trzech ręcznie robionych serduszek z tkaniny w czerwono-białym wzorze. Różne rozmiary, piękna dekoracja domu lub prezent.',
    description_en: 'Set of three handmade fabric hearts in a red and white pattern. Different sizes, perfect as home decoration or a gift.',
    made_to_order: 0,
    in_stock: 1,
    stock_qty: 4,
  },
  {
    id: 6,
    name_pl: 'Krasnal ręcznie robiony',
    name_en: 'Handmade Gnome',
    description_pl: 'Ręcznie robiony krasnal w szarej czapce i czerwonym stroju w kratę. Puszysta broda i uroczy nosek — wyjątkowa dekoracja do domu.',
    description_en: 'Handmade gnome with a grey pointed hat and red plaid outfit. Fluffy beard and a cute nose — a unique home decoration.',
    made_to_order: 0,
    in_stock: 1,
    stock_qty: 5,
  },
];

for (const p of fixes) {
  await db.execute({
    sql: `UPDATE products
          SET name_pl = ?, name_en = ?, description_pl = ?, description_en = ?,
              made_to_order = ?, in_stock = ?, stock_qty = ?
          WHERE id = ?`,
    args: [p.name_pl, p.name_en, p.description_pl, p.description_en, p.made_to_order, p.in_stock, p.stock_qty, p.id],
  });
  console.log(`Updated product ${p.id}: ${p.name_en}`);
}

console.log('Done.');
