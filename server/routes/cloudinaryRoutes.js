import express from 'express';
import cloudinaryController from '../controllers/cloudinaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  handleCloudinaryUpload
} from '../utils/cloudinaryUtils.js';
import multer from 'multer';

const router = express.Router();

// Protect all cloudinary routes
router.use(authMiddleware);

// Get Cloudinary configuration
router.get('/config', cloudinaryController.getConfig);

// Test Cloudinary connection
router.get('/test-connection', cloudinaryController.testConnection);

// Simple multer upload for general files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Upload single file - support multiple field names
router.post('/upload', handleCloudinaryUpload(upload.single('file')), cloudinaryController.uploadFile);
router.post('/upload-image', handleCloudinaryUpload(upload.single('image')), cloudinaryController.uploadFile);
router.post('/upload-photo', handleCloudinaryUpload(upload.single('photo')), cloudinaryController.uploadFile);

// Upload multiple files
router.post('/upload-multiple', handleCloudinaryUpload(upload.array('files', 10)), cloudinaryController.uploadMultipleFiles);

// Delete file
router.delete('/delete/:public_id', cloudinaryController.deleteFile);

// Get file info
router.get('/file-info/:public_id', cloudinaryController.getFileInfo);

// Generate upload URL for client-side upload
router.post('/generate-upload-url', cloudinaryController.generateUploadUrl);

// Transform image URL
router.post('/transform-image', cloudinaryController.transformImage);

// Get usage statistics
router.get('/usage-stats', cloudinaryController.getUsageStats);

// Migrate existing files (placeholder)
router.post('/migrate-files', cloudinaryController.migrateFiles);

// Create folder structure in Cloudinary
router.post('/create-folders', cloudinaryController.createFolders);

// List folders in Cloudinary
router.get('/list-folders', cloudinaryController.listFolders);

export default router;