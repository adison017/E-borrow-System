
import express from 'express';
import * as repairRequestController from '../controllers/repairRequestController.js';
import db from '../db.js';
import { processRepairImages, uploadRepairImages } from '../utils/imageUtils.js';

const router = express.Router();
// GET /api/repair-requests/history (approved, completed, incomplete)
router.use((req, res, next) => {
  req.db = db;
  next();
});
router.get('/history', repairRequestController.getHistoryRequests);
// GET all repair requests
router.get('/', repairRequestController.getAllRepairRequests);

// GET repair request by ID
router.get('/:id', repairRequestController.getRepairRequestById);

// GET repair request images
router.get('/:id/images', repairRequestController.getRepairRequestImages);

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

// POST upload repair images with repair code
router.post('/upload-images', (req, res, next) => {
  // Create a custom multer instance that can access repair_code
  const upload = uploadRepairImages.array('images', 10);

  upload(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }

    // Extract repair code from the uploaded files or request
    let repairCode = null;

    // Try to get repair code from request body (if available)
    if (req.body && req.body.repair_code) {
      repairCode = req.body.repair_code;
    }

    // If not in body, try to extract from filename pattern
    if (!repairCode && req.files && req.files.length > 0) {
      const firstFile = req.files[0];
      const filename = firstFile.filename;
      // Extract repair code from filename (format: REPAIR_CODE_INDEX.ext)
      const match = filename.match(/^([A-Z0-9]+)_\d+/);
      if (match) {
        repairCode = match[1];
      }
    }

    // If still no repair code, generate one
    if (!repairCode) {
      repairCode = `RP${Date.now()}`;
    }

    try {
      const images = processRepairImages(req.files, repairCode);
      res.json({
        message: 'Images uploaded successfully',
        images: images,
        repair_code: repairCode
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

export default router;