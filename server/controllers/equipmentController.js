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

export const getAllEquipment = (req, res) => {
  Equipment.getAllEquipment((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const mapped = results.map(item => ({
      ...item,
      pic: getPicUrl(item.pic)
    }));
    res.json(mapped);
  });
};

export const getEquipmentById = (req, res) => {
  Equipment.getEquipmentById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    const item = results[0];
    const mapped = {
      ...item,
      pic: getPicUrl(item.pic)
    };
    res.json(mapped);
  });
};

export const addEquipment = (req, res) => {
  const data = req.body;
  if (data.pic && typeof data.pic === 'string') {
    if (!data.pic.startsWith('http')) {
      // ถ้าเป็นชื่อไฟล์หรือ /uploads/xxx.png ให้แปลงเป็น URL เต็ม
      data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
    }
  }
  Equipment.addEquipment(data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Equipment added', id: data.id });
  });
};

export const updateEquipment = (req, res) => {
  const data = req.body;
  if (data.pic && typeof data.pic === 'string') {
    if (!data.pic.startsWith('http')) {
      data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
    }
  }

  // ดึงข้อมูลเดิมก่อนอัปเดต
  Equipment.getEquipmentById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
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
    Equipment.updateEquipment(req.params.id, data, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Equipment updated' });
    });
  });
};

export const deleteEquipment = (req, res) => {
  // ดึงข้อมูลก่อนลบ เพื่อรู้ชื่อไฟล์
  Equipment.getEquipmentById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
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
      fs.unlink(filePath, (err) => {
        // ไม่ต้อง return error ถ้าไฟล์ไม่มี
      });
    }

    // ลบข้อมูลใน DB
    Equipment.deleteEquipment(req.params.id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Equipment deleted' });
    });
  });
};