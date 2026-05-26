import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function generateUploadSignature() {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: 'janetta/products', timestamp };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  return {
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  };
}
