const User = require('../models/userModel');

exports.getUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  User.createUser(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'เพิ่มผู้ใช้เรียบร้อย', id: result.insertId });
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id;
  User.updateUser(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'อัปเดตข้อมูลสำเร็จ' });
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.deleteUser(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'ลบผู้ใช้สำเร็จ' });
  });
};
