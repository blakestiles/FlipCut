import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  if (!cloudName || !apiKey || !apiSecret || 
      cloudName === 'your_cloud_name' || 
      apiKey === 'your_api_key' || 
      apiSecret === 'your_api_secret') {
    console.warn('⚠️  Cloudinary not configured. Image uploads will fail.');
    console.warn('   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
    console.warn('   Get free credentials at: https://cloudinary.com/users/register/free');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export { cloudinary };
