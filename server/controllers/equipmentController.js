import fs from 'fs';
import path from 'path';
import * as Equipment from '../models/equipmentModel.js';

const getPicUrl = (pic) => {
  if (!pic) return 'https://cdn-icons-png.flaticon.com/512/3474/3474360.png';
  // ถ้าเป็น URL เต็มหรือ /uploads แล้ว ให้คืนเลย
  if (pic.startsWith('http')) return pic;
  if (pic.startsWith('/uploads')) return `http://localhost:5000${pic}`;
  // ถ้าเป็นชื่อไฟล์ ให้เติม URL เต็ม
  return `http://localhost:5000/uploads/${pic}`;
};

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

export const getEquipmentById = async (req, res) => {
  try {
    const results = await Equipment.getEquipmentById(req.params.id);
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
    if (data.pic && typeof data.pic === 'string') {
      if (!data.pic.startsWith('http')) {
        // ถ้าเป็นชื่อไฟล์หรือ /uploads/xxx.png ให้แปลงเป็น URL เต็ม
        data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
      }
    }
    // รองรับ field ใหม่
    data.purchaseDate = data.purchaseDate || null;
    data.price = data.price || null;
    data.location = data.location || null;
    await Equipment.addEquipment(data);
    res.status(201).json({ message: 'Equipment added', id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const data = req.body;
    if (data.pic && typeof data.pic === 'string') {
      if (!data.pic.startsWith('http')) {
        data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
      }
    }
    // รองรับ field ใหม่
    data.purchaseDate = data.purchaseDate || null;
    data.price = data.price || null;
    data.location = data.location || null;
    // ดึงข้อมูลเดิมก่อนอัปเดต
    const results = await Equipment.getEquipmentById(req.params.id);
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
    await Equipment.updateEquipment(req.params.id, data);
    res.json({ message: 'Equipment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    // ดึงข้อมูลก่อนลบ เพื่อรู้ชื่อไฟล์
    const results = await Equipment.getEquipmentById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    const picUrl = results[0].pic;
    // ตัดให้เหลือแค่ชื่อไฟล์
    let filename = picUrl;
    if (typeof filename === 'string' && filename.startsWith('http')) {
      filename = filename.replace(/^https?:\/\/[^/]+\/uploads\//, '');
    } else if (typeof filename === 'string' && filename.startsWith('/uploads/')) {
      filename = filename.replace(/^\/uploads\//, '');
    }

    console.log('picUrl:', picUrl);
    console.log('filename:', filename);

    // ลบไฟล์ (ถ้าไม่ใช่ default)
    if (
      filename &&
      filename !== 'https://cdn-icons-png.flaticon.com/512/3474/3474360.png'
    ) {
      const filePath = path.join(process.cwd(), 'server', 'uploads', filename);
      console.log('filePath:', filePath);
      fs.unlink(filePath, (err) => {
        // ไม่ต้อง return error ถ้าไฟล์ไม่มี
      });
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
    if (!found) {
      console.log('ไม่พบไฟล์ที่จะลบ:', filename);
    }

    // ลบข้อมูลใน DB
    await Equipment.deleteEquipment(req.params.id);
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};