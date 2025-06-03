import express from 'express';
import positionController from '../controllers/positionController.js';

const router = express.Router();

// GET all positions
router.get('/', positionController.getAllPositions);

// GET position by ID
router.get('/:id', positionController.getPositionById);

// POST create new position
router.post('/', positionController.createPosition);

// PUT update position
router.put('/:id', positionController.updatePosition);

// DELETE position
router.delete('/:id', positionController.deletePosition);

export default router;