import express from 'express';
import * as borrowController from '../controllers/borrowController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all borrow routes
router.use(authMiddleware);

router.post('/', borrowController.createBorrow);
router.get('/', borrowController.getAllBorrows);
router.get('/:id', borrowController.getBorrowById);
router.put('/:id', borrowController.updateBorrowStatus);
router.delete('/:id', borrowController.deleteBorrow);

export default router;