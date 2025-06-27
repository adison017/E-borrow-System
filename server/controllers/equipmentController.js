import fs from 'fs';
import path from 'path';
import * as Equipment from '../models/equipmentModel.js';
import { getPicUrl } from '../utils/imageUtils.js';

export const getAllEquipment = async (req, res) => {
  try {
    const results = await Equipment.getAllEquipment();
    const mapped = results.map(item => ({
      ...item,
      pic: getPicUrl(item.pic)
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Use item_code as canonical identifier for all CRUD
export const getEquipmentByCode = async (req, res) => {
  try {
    const results = await Equipment.getEquipmentByCode(req.params.item_code);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    const item = results[0];
    const mapped = {
      ...item,
      pic: getPicUrl(item.pic)
    };
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEquipment = async (req, res) => {
  try {
    const data = req.body;
    // Generate item_code อัตโนมัติ
    let lastCode = await Equipment.getLastItemCode();
    let nextNumber = 1;
    if (lastCode) {
      const match = lastCode.match(/EQ-(\d{3})/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const newItemCode = `EQ-${String(nextNumber).padStart(3, '0')}`;
    // ตรวจสอบซ้ำอีกชั้น
    const exist = await Equipment.getEquipmentByCode(newItemCode);
    if (exist && exist.length > 0) {
      return res.status(400).json({ error: 'item_code ซ้ำในระบบ' });
    }
    data.item_code = newItemCode;
    if (data.pic && typeof data.pic === 'string') {
      if (!data.pic.startsWith('http')) {
        data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
      }
    }
    data.purchaseDate = data.purchaseDate || null;
    data.price = data.price || null;
    data.location = data.location || null;
    await Equipment.addEquipment(data);
    res.status(201).json({ message: 'Equipment added', item_code: data.item_code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const data = req.body;
    // Ensure item_code is always present and used
    const item_code = req.params.item_code || data.item_code || data.id || data.item_id;
    if (!item_code) return res.status(400).json({ error: 'item_code is required' });
    if (data.pic && typeof data.pic === 'string') {
      if (!data.pic.startsWith('http')) {
        data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
      }
    }
    data.purchaseDate = data.purchaseDate || null;
    data.price = data.price || null;
    data.location = data.location || null;
    // ดึงข้อมูลเดิมก่อนอัปเดต
    const results = await Equipment.getEquipmentByCode(item_code);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    const oldPic = results[0].pic;
    // ถ้าเปลี่ยนรูปใหม่ และรูปเดิมไม่ใช่ default ให้ลบไฟล์เก่า
    if (
      oldPic &&
      oldPic !== data.pic &&
      oldPic !== 'https://cdn-icons-png.flaticon.com/512/3474/3474360.png'
    ) {
      let filename = oldPic;
      if (filename.startsWith('http')) {
        filename = filename.replace(/^https?:\/\/[^/]+\/uploads\//, '');
      } else if (filename.startsWith('/uploads/')) {
        filename = filename.replace(/^\/uploads\//, '');
      }
      const filePath = path.join(process.cwd(), 'server', 'uploads', filename);
      fs.unlink(filePath, (err) => {});
    }
    // อัปเดตข้อมูล
    await Equipment.updateEquipment(item_code, data);
    res.json({ message: 'Equipment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    // ดึงข้อมูลเดิมก่อนอัปเดต
    const results = await Equipment.getEquipmentByCode(req.params.item_code);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    // อัปเดตเฉพาะสถานะ
    await Equipment.updateEquipmentStatus(req.params.item_code, status);
    res.json({ message: 'Equipment status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    // ดึงข้อมูลก่อนลบ เพื่อรู้ชื่อไฟล์
    const results = await Equipment.getEquipmentByCode(req.params.item_code);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    const picUrl = results[0].pic;
    // ตัดให้เหลือแค่ชื่อไฟล์
    let filename = picUrl;
    if (typeof filename === 'string' && filename.startsWith('http')) {
      filename = filename.replace(/^https?:\/\/[^/]+\/uploads\//, '');
    } else if (typeof filename === 'string' && filename.startsWith('/uploads/')) {
      filename = filename.replace(/^\/uploads\//, '');
    }

    // ลบไฟล์ (ถ้าไม่ใช่ default)
    if (
      filename &&
      filename !== 'https://cdn-icons-png.flaticon.com/512/3474/3474360.png'
    ) {
      const filePath = path.join(process.cwd(), 'server', 'uploads', filename);
      fs.unlink(filePath, (err) => {});
    }

    // สมมติ filename ไม่มีนามสกุล ลองเติม .png หรือ .jpg ตรวจสอบก่อนลบ
    const tryExtensions = ['', '.png', '.jpg', '.jpeg', '.webp'];
    let found = false;
    for (const ext of tryExtensions) {
      const tryPath = path.join(process.cwd(), 'server', 'uploads', filename + ext);
      if (fs.existsSync(tryPath)) {
        fs.unlink(tryPath, (err) => {
          if (err) console.error('ลบไฟล์ไม่สำเร็จ:', tryPath, err.message);
        });
        found = true;
        break;
      }
    }
    // ลบข้อมูลใน DB
    await Equipment.deleteEquipment(req.params.item_code);
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};