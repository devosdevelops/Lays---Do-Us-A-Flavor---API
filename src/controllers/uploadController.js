import cloudinary from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

export const uploadImage = async (req, res) => {
  try {
    // Validate file presence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload to Cloudinary from buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'designs',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image to Cloudinary',
          });
        }

        res.status(200).json({
          success: true,
          message: 'Image uploaded successfully',
          data: {
            secure_url: result.secure_url,
            public_id: result.public_id,
            url: result.url,
          },
        });
      }
    );

    // Pipe the file buffer to the upload stream
    uploadStream.end(req.file.buffer);
  } catch (error) {
    logger.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during image upload',
    });
  }
};
