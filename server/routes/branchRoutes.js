import express from 'express';
import branchController from '../controllers/branchController.js';

const router = express.Router();

// GET all branches
router.get('/', branchController.getAllBranches);

// GET branch by ID
router.get('/:id', branchController.getBranchById);

// POST create new branch
router.post('/', branchController.createBranch);

// PUT update branch
router.put('/:id', branchController.updateBranch);

// DELETE branch
router.delete('/:id', branchController.deleteBranch);

export default router;