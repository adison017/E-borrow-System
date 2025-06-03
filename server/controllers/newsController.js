import pool from '../db.js';

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new news
export const createNews = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO news (title, content, category) VALUES (?, ?, ?)',
      [title, content, category]
    );

    const [newNews] = await pool.query('SELECT * FROM news WHERE id = ?', [result.insertId]);
    res.status(201).json(newNews[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update news
export const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE news SET title = ?, content = ?, category = ? WHERE id = ?',
      [title, content, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบข่าวที่ต้องการแก้ไข' });
    }

    const [updatedNews] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    res.json(updatedNews[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete news
export const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM news WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบข่าวที่ต้องการลบ' });
    }

    res.json({ message: 'ลบข่าวเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single news
export const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข่าวที่ต้องการ' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};