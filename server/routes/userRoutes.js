import express from 'express';
import userController from '../controllers/userController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from '../models/userModel.js';
import db from '../db.js';

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
    const uploadDir = path.join(__dirname, '../uploads');
    console.log('Upload directory:', uploadDir);
    // Create directory if it doesn't exist
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created upload directory:', uploadDir);
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    // Get user_code from request body
    const userCode = req.body.user_code;
    console.log('Received user_code:', userCode); // Debug log
    if (!userCode) {
      return cb(new Error('User code is required'));
    }
    // Always save as .jpg regardless of original extension
    const filename = `${userCode}.jpg`;
    console.log('Generated filename:', filename);
    cb(null, filename);
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
router.post('/upload-image', async (req, res, next) => {
  console.log('=== Starting Image Upload ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size cannot exceed 2MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: err.message });
    }

    const userCode = req.body.user_code;
    console.log('=== Image Upload Process ===');
    console.log('1. Received user_code:', userCode);

    if (!userCode) {
      return res.status(400).json({ message: 'User code is required' });
    }

    try {
      // Get the current user's avatar path
      const user = await User.findByUserCode(userCode);
      if (!user) {
        console.log('2. User not found in database');
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('2. Found user in database:', {
        user_id: user.user_id,
        user_code: user.user_code,
        current_avatar: user.avatar
      });

      let newAvatarPath;
      let newFilename;

      if (req.file) {
        // If file was uploaded, use it
        console.log('3. Using uploaded file:', {
          originalname: req.file.originalname,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        });
        newAvatarPath = path.join(__dirname, '../uploads', req.file.filename);
        newFilename = req.file.filename;
      } else {
        // If no file was uploaded, create a default image
        console.log('3. No file uploaded, creating default image');
        newFilename = `${userCode}.jpg`;
        newAvatarPath = path.join(__dirname, '../uploads', newFilename);

        // Check if default image already exists
        if (!fs.existsSync(newAvatarPath)) {
          // Copy default image from public folder
          const defaultImagePath = path.join(__dirname, '../public/logo_it.png');
          if (fs.existsSync(defaultImagePath)) {
            fs.copyFileSync(defaultImagePath, newAvatarPath);
            console.log('4. Created default image from logo_it.png');
          } else {
            // If default image doesn't exist, create a blank image
            const { createCanvas } = await import('canvas');
            const canvas = createCanvas(200, 200);
            const ctx = canvas.getContext('2d');

            // Fill with light gray background
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 200, 200);

            // Add text
            ctx.fillStyle = '#666666';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(userCode, 100, 100);

            // Save as JPEG
            const buffer = canvas.toBuffer('image/jpeg');
            fs.writeFileSync(newAvatarPath, buffer);
            console.log('4. Created blank default image with user code');
          }
        } else {
          console.log('4. Default image already exists');
        }
      }

      // Ensure the new file exists
      if (!fs.existsSync(newAvatarPath)) {
        console.error('5. New avatar file not found:', newAvatarPath);
        return res.status(500).json({ message: 'Failed to save avatar file' });
      }
      console.log('5. New avatar file exists:', newAvatarPath);

      // Update user's avatar path in database
      const result = await User.updateByUserCode(userCode, {
        avatar: newFilename
      });

      console.log('6. Database update result:', {
        affectedRows: result.affectedRows,
        new_avatar: newFilename
      });

      if (result.affectedRows === 0) {
        // If database update fails, delete the new file
        try {
          fs.unlinkSync(newAvatarPath);
          console.log('7. Deleted new avatar file due to database update failure');
        } catch (error) {
          console.error('Error deleting new avatar file:', error);
        }
        console.log('8. Failed to update user avatar in database');
        return res.status(404).json({ message: 'Failed to update user avatar' });
      }

      // Only delete old avatar after successful database update
      if (user.avatar && user.avatar !== newFilename) {
        const oldAvatarPath = path.join(__dirname, '../uploads', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          try {
            fs.unlinkSync(oldAvatarPath);
            console.log('9. Deleted old avatar:', oldAvatarPath);
          } catch (error) {
            console.error('Error deleting old avatar:', error);
          }
        }
      }

      console.log('10. Image upload and database update completed successfully');
      res.json({
        message: 'File uploaded successfully',
        filename: newFilename,
        path: `/uploads/${newFilename}`
      });
    } catch (error) {
      console.error('Database update error:', error);
      console.error('Error stack:', error.stack);

      // If there's an error, try to delete the new file
      try {
        if (req.file) {
          const newAvatarPath = path.join(__dirname, '../uploads', req.file.filename);
          if (fs.existsSync(newAvatarPath)) {
            fs.unlinkSync(newAvatarPath);
            console.log('Error recovery: Deleted new avatar file');
          }
        }
      } catch (deleteError) {
        console.error('Error deleting new avatar file during error recovery:', deleteError);
      }

      res.status(500).json({
        message: 'Error updating user avatar in database',
        error: error.message
      });
    }
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
router.get('/', userController.getAllUsers);
router.get('/username/:username', userController.getUserByUsername);
router.get('/id/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/id/:id', userController.updateUser);
router.patch('/id/:id', userController.updateUser);
router.delete('/id/:id', userController.deleteUser);
router.get('/role/:role', userController.getUsersByRole);

// Debug route to test server
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working' });
});

export default router;