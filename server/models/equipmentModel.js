import connection from '../db.js';

export const getAllEquipment = async () => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipment');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getEquipmentById = async (id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipment WHERE id = ?', [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const addEquipment = async (equipment) => {
  try {
    const { id, name, category, description, quantity, unit, status, pic, created_at } = equipment;
    const [result] = await connection.query(
      'INSERT INTO equipment (id, name, category, description, quantity, unit, status, pic, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, category, description, quantity, unit, status, pic, created_at]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateEquipment = async (id, equipment) => {
  try {
    const { name, category, description, quantity, unit, status, pic } = equipment;
    const [result] = await connection.query(
      'UPDATE equipment SET name=?, category=?, description=?, quantity=?, unit=?, status=?, pic=? WHERE id=?',
      [name, category, description, quantity, unit, status, pic, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const [result] = await connection.query('DELETE FROM equipment WHERE id = ?', [id]);
    return result;
  } catch (error) {
    throw error;
  }
};