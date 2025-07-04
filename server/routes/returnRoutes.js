import express from 'express';
import * as returnController from '../controllers/returnController.js';

const router = express.Router();

router.get('/', returnController.getAllReturns);
router.post('/', returnController.createReturn);
router.get('/success-borrows', returnController.getSuccessBorrows);
router.patch('/:return_id/pay', returnController.updatePayStatus);
router.get('/by-borrow/:borrow_id', returnController.getReturnsByBorrowId);

export default router;