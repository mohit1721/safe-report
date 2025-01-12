import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Upload file (PDF/DOC) to Cloudinary from a buffer or file path
export const uploadFileToCloudinary = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const stream = fs.createReadStream(filePath);

      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detects file type
          folder: 'safereport', // Optional: Define folder for file organization
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading file to Cloudinary:', error);
            reject(new Error('File upload failed'));
          } else {
            resolve(result?.secure_url || '');
          }
        }
      );

      stream.pipe(cloudinary.uploader.upload_stream());
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      reject(new Error('File upload failed'));
    }
  });
};
