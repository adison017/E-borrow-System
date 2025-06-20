import connection from '../db.js';

export const getAllEquipment = async () => {
  try {
    const [rows] = await connection.query('SELECT *, purchaseDate, price, location FROM equipment');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getEquipmentById = async (item_id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipment WHERE item_id = ?', [item_id]);
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

export const updateEquipment = async (item_id, equipment) => {
  try {
    const { name, category, description, quantity, unit, status, pic, purchaseDate, price, location } = equipment;
    const [result] = await connection.query(
      'UPDATE equipment SET name=?, category=?, description=?, quantity=?, unit=?, status=?, pic=? WHERE item_id=?',
      [name, category, description, quantity, unit, status, pic, item_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteEquipment = async (item_id) => {
  try {
    const [result] = await connection.query('DELETE FROM equipment WHERE item_id = ?', [item_id]);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getEquipmentByCode = async (item_code) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipment WHERE item_code = ?', [item_code]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateEquipmentStatus = async (item_id, status) => {
  try {
    const [result] = await connection.query(
      'UPDATE equipment SET status=? WHERE item_id=?',
      [status, item_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};