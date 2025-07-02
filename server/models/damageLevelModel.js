import db from '../db.js';

export const getAllDamageLevels = async () => {
  const [rows] = await db.query('SELECT * FROM damage_levels');
  return rows;
};