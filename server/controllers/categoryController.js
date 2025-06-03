import * as Category from '../models/categoryModel.js';

export const getAllCategories = (req, res) => {
  Category.getAllCategories((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getCategoryById = (req, res) => {
  Category.getCategoryById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
};

export const addCategory = (req, res) => {
  Category.addCategory(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Category added' });
  });
};

export const updateCategory = (req, res) => {
  Category.updateCategory(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category updated' });
  });
};

export const deleteCategory = (req, res) => {
  Category.deleteCategory(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category deleted' });
  });
}; 