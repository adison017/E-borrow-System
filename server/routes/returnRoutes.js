import express from 'express';
import * as returnController from '../controllers/returnController.js';
import { getAllReturns_pay } from '../controllers/returnController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

router.get('/', returnController.getAllReturns);
router.post('/', returnController.createReturn);
router.get('/success-borrows', returnController.getSuccessBorrows);
router.patch('/:return_id/pay', returnController.updatePayStatus);
router.get('/by-borrow/:borrow_id', returnController.getReturnsByBorrowId);

// route summary ใช้ controller โดยตรง
router.get('/summary', getAllReturns_pay);

// อัปโหลดสลิป
router.post('/upload-slip', upload.fields([{ name: 'slip', maxCount: 1 }]), returnController.uploadSlip);

// ยืนยันการจ่ายเงิน
router.post('/confirm-payment', returnController.confirmPayment);

export default router;