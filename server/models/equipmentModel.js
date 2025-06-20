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
    // mapping item_id -> id
    const id = equipment.item_id || equipment.id;
    const { name, category, description, quantity, unit, status, pic, price, purchaseDate, location } = equipment;
    const [result] = await connection.query(
      'INSERT INTO equipment (id, name, category, description, quantity, unit, status, pic, created_at, price, purchaseDate, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?)',
      [id, name, category, description, quantity, unit, status, pic, price, purchaseDate, location]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateEquipment = async (item_id, equipment) => {
  try {
    // mapping item_id -> id
    const id = equipment.item_id || equipment.id || item_id;
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
    const [result] = await connection.query('DELETE FROM equipment WHERE id = ?', [item_id]);
    console.log('Delete result:', result); // เพิ่ม log
    return result;
  } catch (error) {
    console.error('Delete equipment error:', error);
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