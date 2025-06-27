import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as equipmentController from '../controllers/equipmentController.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/equipment');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์สุ่มก่อน (timestamp + originalname)
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const { item_code } = req.body;
  const ext = path.extname(req.file.originalname) || path.extname(req.file.filename);
  const uploadPath = path.join(__dirname, '../uploads/equipment');
  const oldPath = path.join(uploadPath, req.file.filename);
  let newFilename;
  let newPath;
  console.log('[UPLOAD] รับไฟล์:', req.file.filename, 'item_code:', item_code);
  if (!item_code) {
    // ถ้าไม่มี item_code ให้ลบไฟล์นี้ทิ้ง
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
      console.log('[UPLOAD] ลบไฟล์ที่ไม่มี item_code:', req.file.filename);
    }
    return res.status(400).json({ error: 'item_code is required' });
  }
  newFilename = `${item_code}${ext}`;
  newPath = path.join(uploadPath, newFilename);
  // ถ้ามีไฟล์ชื่อเดียวกันอยู่แล้ว ให้ลบทิ้งก่อน
  if (fs.existsSync(newPath)) {
    fs.unlinkSync(newPath);
    console.log('[UPLOAD] ลบไฟล์เก่า:', newFilename);
  }
  fs.renameSync(oldPath, newPath);
  console.log('[UPLOAD] เปลี่ยนชื่อไฟล์เป็น:', newFilename);
  // ลบไฟล์สุ่ม (ชื่อเดิม) ถ้ายังเหลือ (ป้องกันกรณี rename ไม่สมบูรณ์)
  if (fs.existsSync(oldPath) && oldPath !== newPath) {
    fs.unlinkSync(oldPath);
    console.log('[UPLOAD] ลบไฟล์สุ่มเดิม:', req.file.filename);
  }
  // คืน path ใหม่
  res.json({ url: `/uploads/equipment/${newFilename}` });
});

// Use item_code as canonical identifier for all CRUD routes
router.get('/', equipmentController.getAllEquipment);
router.get('/:item_code', equipmentController.getEquipmentByCode);
router.post('/', equipmentController.addEquipment);
router.put('/:item_code', equipmentController.updateEquipment);
router.put('/:item_code/status', equipmentController.updateEquipmentStatus);
router.delete('/:item_code', equipmentController.deleteEquipment);

export default router;