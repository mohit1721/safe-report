import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnect = (): void => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME as string,
      api_key: process.env.API_KEY as string,
      api_secret: process.env.API_SECRET as string,
    });
  } catch (error) {
    console.error('Error configuring Cloudinary:', error);
  }
};