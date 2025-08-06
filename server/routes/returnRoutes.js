import express from 'express';
import * as returnController from '../controllers/returnController.js';
import { getAllReturns_pay } from '../controllers/returnController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadPaySlip } from '../utils/cloudinaryUploadUtils.js';

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

export default router;