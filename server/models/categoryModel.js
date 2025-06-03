import connection from '../db.js';

export const getAllCategories = (callback) => {
  connection.query('SELECT * FROM category', callback);
};

export const getCategoryById = (category_id, callback) => {
  connection.query('SELECT * FROM category WHERE category_id = ?', [category_id], callback);
};

export const addCategory = (category, callback) => {
  const { category_code, name, created_at, updated_at } = category;
  connection.query(
    'INSERT INTO category (category_code, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
    [category_code, name, created_at, updated_at],
    callback
  );
};

export const updateCategory = (category_id, category, callback) => {
  const { name, updated_at } = category;
  connection.query(
    'UPDATE category SET name=?, updated_at=? WHERE category_id=?',
    [name, updated_at, category_id],
    callback
  );
};

export const deleteCategory = (category_id, callback) => {
  connection.query('DELETE FROM category WHERE category_id = ?', [category_id], callback);
}; 