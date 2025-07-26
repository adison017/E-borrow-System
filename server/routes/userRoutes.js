import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// CORS middleware
router.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Origin');

  // Allow credentials
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(204).end();
  }

  next();
});

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save to uploads/user
    const uploadDir = path.join(__dirname, '../uploads/user');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use user_code as filename, keep extension
    const userCode = req.body.user_code;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, userCode ? `${userCode}${ext}` : file.originalname);
  }
});

// File filter for image upload
const fileFilter = (req, file, cb) => {
  console.log('File filter checking file:', {
    originalname: file.originalname,
    mimetype: file.mimetype
  });
  // Accept only jpg and png
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg and .png files are allowed!'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
}).single('avatar');

// Image upload route
router.post('/upload-image', authMiddleware, (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ filename: req.file.filename, url: `/uploads/user/${req.file.filename}` });
  });
});

// Get all positions
router.get('/positions', async (req, res) => {
  try {
    const [positions] = await db.query('SELECT * FROM positions ORDER BY position_name');
    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({
      message: 'Error fetching positions',
      error: error.message
    });
  }
});

// Get all branches
router.get('/branches', async (req, res) => {
  try {
    const [branches] = await db.query('SELECT * FROM branches ORDER BY branch_name');
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      message: 'Error fetching branches',
      error: error.message
    });
  }
});

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles ORDER BY role_name');
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      message: 'Error fetching roles',
      error: error.message
    });
  }
});

// User routes
// Protect sensitive user routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/username/:username', userController.getUserByUsername);
router.get('/id/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/id/:id', authMiddleware, userController.updateUser);
router.patch('/id/:id', authMiddleware, userController.updateUser);
router.patch('/:id/line-notify', userController.updateLineNotifyEnabled);
router.delete('/id/:id', authMiddleware, async (req, res) => {
  try {
    // Get user info first
    const [userRows] = await db.query('SELECT avatar, user_code FROM users WHERE user_id = ?', [req.params.id]);
    const user = userRows[0];
    // Delete user from DB
    await userController.deleteUser(req, res);
    // Remove avatar file if exists
    if (user && user.avatar) {
      const avatarFilename = user.avatar.split('/').pop();
      const avatarPath = path.join(__dirname, '../uploads/user', avatarFilename);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
        console.log('Deleted user avatar:', avatarPath);
      }
    }
  } catch (error) {
    console.error('Error deleting user and avatar:', error);
    res.status(500).json({ message: 'Error deleting user or avatar', error: error.message });
  }
});
router.get('/role/:role', authMiddleware, userController.getUsersByRole);

// เพิ่ม login route
router.post('/login', userController.login);

// เพิ่ม endpoint สำหรับ verify token
router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Debug route to test server
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working' });
});

export default router;