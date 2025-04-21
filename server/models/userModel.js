const db = require('../db');

// ดึงผู้ใช้ทั้งหมด
exports.getAllUsers = (callback) => {
  db.query('SELECT * FROM users', callback);
};

// เพิ่มผู้ใช้ใหม่
exports.createUser = (userData, callback) => {
  const { name, email } = userData;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], callback);
};

// อัปเดตผู้ใช้
exports.updateUser = (id, userData, callback) => {
  const { name, email } = userData;
  db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], callback);
};

// ลบผู้ใช้
exports.deleteUser = (id, callback) => {
  db.query('DELETE FROM users WHERE id = ?', [id], callback);
};
