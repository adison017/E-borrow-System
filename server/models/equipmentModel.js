import connection from '../db.js';

export const getAllEquipment = (callback) => {
  connection.query('SELECT * FROM equipment', callback);
};

export const getEquipmentById = (id, callback) => {
  connection.query('SELECT * FROM equipment WHERE id = ?', [id], callback);
};

export const addEquipment = (equipment, callback) => {
  const { id, name, category, description, quantity, unit, status, pic, created_at } = equipment;
  connection.query(
    'INSERT INTO equipment (id, name, category, description, quantity, unit, status, pic, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, category, description, quantity, unit, status, pic, created_at],
    callback
  );
};

export const updateEquipment = (id, equipment, callback) => {
  const { name, category, description, quantity, unit, status, pic } = equipment;
  connection.query(
    'UPDATE equipment SET name=?, category=?, description=?, quantity=?, unit=?, status=?, pic=? WHERE id=?',
    [name, category, description, quantity, unit, status, pic, id],
    callback
  );
};

export const deleteEquipment = (id, callback) => {
  connection.query('DELETE FROM equipment WHERE id = ?', [id], callback);
}; 