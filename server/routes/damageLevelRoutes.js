import express from 'express';
import { getDamageLevels } from '../controllers/damageLevelController.js';

const router = express.Router();

router.get('/', getDamageLevels);

export default router;