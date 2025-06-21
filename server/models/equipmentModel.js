import connection from '../db.js';

export const getAllEquipment = async () => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipment');
    return rows;
  } catch (error) {
    throw error;
  }
};

// Use item_code as canonical identifier
export const getEquipmentByCode = async (item_code) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipment WHERE item_code = ?', [item_code]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const addEquipment = async (equipment) => {
  try {
    // Always use item_code as canonical code
    const item_code = equipment.item_code || equipment.id || equipment.item_id;
    const { name, category, description, quantity, unit, status, pic, price, purchaseDate, location } = equipment;
    const [result] = await connection.query(
      'INSERT INTO equipment (item_code, name, category, description, quantity, unit, status, pic, created_at, price, purchaseDate, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?)',
      [item_code, name, category, description, quantity, unit, status, pic, price, purchaseDate, location]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateEquipment = async (item_code, equipment) => {
  try {
    // Always use item_code as canonical code
    const { name, category, description, quantity, unit, status, pic, purchaseDate, price, location } = equipment;
    const [result] = await connection.query(
      'UPDATE equipment SET name=?, category=?, description=?, quantity=?, unit=?, status=?, pic=?, purchaseDate=?, price=?, location=? WHERE item_code=?',
      [name, category, description, quantity, unit, status, pic, purchaseDate, price, location, item_code]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteEquipment = async (item_code) => {
  try {
    const [result] = await connection.query('DELETE FROM equipment WHERE item_code = ?', [item_code]);
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Delete equipment error:', error);
    throw error;
  }
};

export const updateEquipmentStatus = async (item_code, status) => {
  try {
    const [result] = await connection.query(
      'UPDATE equipment SET status=? WHERE item_code=?',
      [status, item_code]
    );
    return result;
  } catch (error) {
    throw error;
  }
};