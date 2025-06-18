import express from 'express';
import * as repairRequestController from '../controllers/repairRequestController.js';

const router = express.Router();

// GET all repair requests
router.get('/', repairRequestController.getAllRepairRequests);

// GET repair request by ID
router.get('/:id', repairRequestController.getRepairRequestById);

// GET repair requests by user ID
router.get('/user/:user_id', repairRequestController.getRepairRequestsByUserId);

// GET repair requests by item ID
router.get('/item/:item_id', repairRequestController.getRepairRequestsByItemId);

// POST new repair request
router.post('/', repairRequestController.addRepairRequest);

// PUT update repair request
router.put('/:id', repairRequestController.updateRepairRequest);

// DELETE repair request
router.delete('/:id', repairRequestController.deleteRepairRequest);

export default router;