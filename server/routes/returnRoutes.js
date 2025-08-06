import express from 'express';
import * as returnController from '../controllers/returnController.js';
import { getAllReturns_pay } from '../controllers/returnController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadPaySlip } from '../utils/cloudinaryUploadUtils.js';
import { createPaySlipUploadWithBorrowCode } from '../utils/cloudinaryUtils.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// กำหนด storage สำหรับสลิป
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/pay_slip'));
  },
  filename: function (req, file, cb) {
    // ใช้ borrow_code จาก req.body
    let ext = path.extname(file.originalname);
    let borrowCode = req.body.borrow_code || 'unknown';
    cb(null, borrowCode + '_slip' + ext);
  }
});
const upload = multer({ storage: storage });

// Protect all return routes
router.use(authMiddleware);

router.get('/', returnController.getAllReturns);
router.post('/', returnController.createReturn);
router.get('/success-borrows', returnController.getSuccessBorrows);
router.patch('/:return_id/pay', returnController.updatePayStatus);
router.get('/by-borrow/:borrow_id', returnController.getReturnsByBorrowId);

// route summary ใช้ controller โดยตรง
router.get('/summary', getAllReturns_pay);

// อัปโหลดสลิป
router.post('/upload-slip', async (req, res, next) => {
  try {
    // Use multer to parse the file
    const parseMulter = multer().single('slip');

    parseMulter(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get borrow_code from request body
      const { borrow_code } = req.body;
      if (!borrow_code) {
        return res.status(400).json({ message: 'borrow_code is required' });
      }

      try {
        // Convert file buffer to base64
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await uploadPaySlip(dataUri, borrow_code);

        if (result.success) {
          res.json({
            filename: result.public_id,
            url: result.url,
            public_id: result.public_id
          });
        } else {
          res.status(400).json({
            message: 'Failed to upload to Cloudinary',
            error: result.error
          });
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({
          message: 'Error uploading to Cloudinary',
          error: uploadError.message
        });
      }
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ยืนยันการจ่ายเงิน
router.post('/confirm-payment', returnController.confirmPayment);

// อัปโหลดสลิปไปยัง Cloudinary (ใหม่)
router.post('/upload-slip-cloudinary', async (req, res, next) => {
  try {
    // Get borrow_code from request body first
    const { borrow_code } = req.body;
    if (!borrow_code) {
      return res.status(400).json({ message: 'borrow_code is required' });
    }

    // Create upload middleware with borrow code
    const uploadMiddleware = createPaySlipUploadWithBorrowCode(borrow_code);

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
      }

      try {
        // Check if file was uploaded to Cloudinary or stored locally
        let responseData = {
          filename: req.file.filename,
          original_name: req.file.originalname,
          file_size: req.file.size,
          mime_type: req.file.mimetype
        };

        if (req.file.path && req.file.secure_url) {
          // Cloudinary upload
          responseData.cloudinary_url = req.file.secure_url;
          responseData.cloudinary_public_id = req.file.public_id;
          responseData.file_path = req.file.path;
          console.log(`✅ Slip uploaded to Cloudinary: ${req.file.originalname} -> ${req.file.filename}`);
        } else if (req.file.path) {
          // Local storage
          responseData.file_path = req.file.path;
          responseData.cloudinary_public_id = null;
          responseData.cloudinary_url = null;
          responseData.stored_locally = true;
          console.log(`📁 Slip stored locally: ${req.file.originalname} -> ${req.file.filename}`);
        } else {
          // Memory storage (fallback)
          console.warn('⚠️ Slip stored in memory - Cloudinary not configured');
          responseData.file_path = null;
          responseData.cloudinary_public_id = null;
          responseData.cloudinary_url = null;
          responseData.stored_in_memory = true;
        }

        res.json(responseData);
      } catch (uploadError) {
        console.error('File processing error:', uploadError);
        res.status(500).json({
          message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์',
          error: uploadError.message
        });
      }
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในระบบ',
      error: error.message
    });
  }
});

export default router;