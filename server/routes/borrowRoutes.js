import express from 'express';
import * as borrowController from '../controllers/borrowController.js';

const router = express.Router();

router.post('/', borrowController.createBorrow);
router.get('/', borrowController.getAllBorrows);
router.get('/:id', borrowController.getBorrowById);
router.put('/:id', borrowController.updateBorrowStatus);
router.delete('/:id', borrowController.deleteBorrow);

export default router;