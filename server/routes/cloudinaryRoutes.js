import express from 'express';
import { cloudinaryUtils } from '../utils/cloudinaryUtils.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Test Cloudinary connection
router.get('/test-connection', authMiddleware, async (req, res) => {
  try {
    const result = await cloudinaryUtils.testConnection();

    if (result.success) {
      res.json({
        success: true,
        message: 'เชื่อมต่อ Cloudinary สำเร็จ',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'ไม่สามารถเชื่อมต่อ Cloudinary ได้',
        error: result.error,
        suggestion: result.suggestion
      });
    }
  } catch (error) {
    console.error('Cloudinary test connection error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการทดสอบการเชื่อมต่อ',
      error: error.message
    });
  }
});

// Get Cloudinary configuration status
router.get('/config', authMiddleware, (req, res) => {
  const isConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

  res.json({
    success: true,
    data: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || null,
      api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : null,
      is_configured: isConfigured
    }
  });
});

// Upload file to Cloudinary (for testing)
router.post('/upload', authMiddleware, async (req, res) => {
  try {
    // This is a placeholder for direct file upload testing
    // In practice, you would use multer middleware here
    res.json({
      success: false,
      message: 'Please use the appropriate upload endpoint for your file type'
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      error: error.message
    });
  }
});

// Delete file from Cloudinary
router.delete('/delete/:publicId', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinaryUtils.deleteFile(publicId);

    if (result.success) {
      res.json({
        success: true,
        message: 'ลบไฟล์สำเร็จ',
        data: result.result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'ไม่สามารถลบไฟล์ได้',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบไฟล์',
      error: error.message
    });
  }
});

export default router;