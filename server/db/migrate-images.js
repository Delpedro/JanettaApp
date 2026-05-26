import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import db from './client.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const images = [
  { id: 4, file: 'product4.JPEG' },
  { id: 5, file: 'product5.JPEG' },
  { id: 6, file: 'product6.JPEG' },
];

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'janetta/products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

const MAX_BYTES = 10 * 1024 * 1024;

async function prepareBuffer(rawBuffer) {
  if (rawBuffer.length <= MAX_BYTES) return rawBuffer;
  return sharp(rawBuffer).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
}

for (const { id, file } of images) {
  const filePath = resolve(__dirname, '../../client/public/images', file);
  const raw = readFileSync(filePath);
  const buffer = await prepareBuffer(raw);
  const url = await uploadBuffer(buffer);
  await db.execute({
    sql: 'UPDATE products SET image = ? WHERE id = ?',
    args: [url, id],
  });
  console.log(`product ${id} → ${url}`);
}

console.log('Done.');
