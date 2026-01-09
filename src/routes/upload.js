import express from 'express';
import upload from '../middleware/upload.js';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/upload-image - Upload image to Cloudinary
// Protected route - requires valid token
router.post('/upload-image', authenticateToken, upload.single('image'), uploadImage);

export default router;
