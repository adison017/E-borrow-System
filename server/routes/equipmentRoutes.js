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
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // รับ item_id จาก body (ต้องส่ง item_id มาด้วยตอนอัปโหลด)
  const { item_id } = req.body;
  if (!item_id) {
    // ถ้าไม่มี item_id ให้ใช้ชื่อไฟล์เดิม
    return res.json({ url: `/uploads/${req.file.filename}` });
  }

  // หานามสกุลไฟล์
  const ext = path.extname(req.file.originalname) || path.extname(req.file.filename);
  const newFilename = `${item_id}${ext}`;
  const uploadPath = path.join(__dirname, '..', 'uploads');
  const oldPath = path.join(uploadPath, req.file.filename);
  const newPath = path.join(uploadPath, newFilename);

  // เปลี่ยนชื่อไฟล์
  fs.renameSync(oldPath, newPath);

  // คืน path ใหม่
  res.json({ url: `/uploads/${newFilename}` });
});

router.get('/', equipmentController.getAllEquipment);
router.get('/:item_id', equipmentController.getEquipmentById);
router.get('/code/:item_code', equipmentController.getEquipmentByCode);
router.post('/', equipmentController.addEquipment);
router.put('/:item_id', equipmentController.updateEquipment);
router.put('/:item_id/status', equipmentController.updateEquipmentStatus);
router.delete('/:item_id', equipmentController.deleteEquipment);

export default router;