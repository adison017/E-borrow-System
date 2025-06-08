import User from '../models/userModel.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  // ในส่วน filename function ของ userController.js
// เปลี่ยนจากโค้ดเดิม:
filename: function (req, file, cb) {
  // Get user_code from request body
  const userCode = req.body.user_code;
  console.log('Received user_code:', userCode); // Debug log
  if (!userCode) {
    return cb(new Error('User code is required'));
  }
  // Use user_code as filename with original extension
  const extension = path.extname(file.originalname);
  const filename = `${userCode}${extension}`;
  console.log('Generated filename:', filename); // Debug log
  cb(null, filename);
}
,
// เป็น:
filename: function (req, file, cb) {
  // Get user_code from request body
  const userCode = req.body.user_code;
  console.log('Received user_code:', userCode); // Debug log
  if (!userCode) {
    return cb(new Error('User code is required'));
  }
  // Always save as .jpg regardless of original extension
  const filename = `${userCode}.jpg`;
  console.log('Generated filename:', filename); // Debug log
  cb(null, filename);
}
});

// File filter for image upload
const fileFilter = (req, file, cb) => {
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

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({
        message: 'An error occurred while fetching users',
        error: err.message
      });
    }
  },

  getUserByUsername: async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findByUsername(username);
      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        message: 'An error occurred while fetching user',
        error: err.message
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          error: 'No user found with the provided ID'
        });
      }

      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        message: 'An error occurred while fetching user',
        error: err.message
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const userData = req.body;
      console.log('Creating user with data:', userData);

      // Create the user
      const createdUser = await User.create(userData);

      if (!createdUser) {
        return res.status(500).json({
          message: 'ไม่สามารถสร้างผู้ใช้งานได้',
          error: 'Failed to create user'
        });
      }

      // Return the created user data
      res.status(201).json({
        message: 'สร้างผู้ใช้งานสำเร็จ',
        user: createdUser
      });

    } catch (error) {
      console.error('Error creating user:', error);

      // Handle duplicate email error
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')) {
        return res.status(400).json({
          message: 'อีเมลนี้ถูกใช้งานแล้ว',
          error: 'Email already exists'
        });
      }

      // Handle other errors
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน',
        error: error.message
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log('Updating user with ID:', userId);
      console.log('Update data:', req.body);
      console.log('Parish value:', req.body.parish); // เพิ่ม log สำหรับ parish

      const result = await User.updateById(userId, req.body);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'User not found',
          error: 'No user found with the provided ID'
        });
      }

      // Get the updated user data
      const updatedUser = await User.findById(userId);
      console.log('Updated user data:', updatedUser);
      console.log('Updated parish value:', updatedUser.parish); // เพิ่ม log สำหรับ updated parish

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูลผู้ใช้',
        error: error.message
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await User.delete(userId);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'User not found',
          error: 'No user found with the provided ID'
        });
      }

      res.json({
        message: 'User deleted successfully',
        affectedRows: result.affectedRows
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({
        message: 'An error occurred while deleting user',
        error: err.message
      });
    }
  },

  uploadImage: (req, res) => {
    console.log('Received request body:', req.body); // Debug log
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'ขนาดไฟล์ต้องไม่เกิน 2MB',
            error: err.message
          });
        }
        return res.status(400).json({
          message: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์',
          error: err.message
        });
      } else if (err) {
        // An unknown error occurred
        console.error('Upload error:', err);
        return res.status(500).json({
          message: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์',
          error: err.message
        });
      }

      // Everything went fine
      if (!req.file) {
        return res.status(400).json({
          message: 'ไม่พบไฟล์ที่อัพโหลด',
          error: 'กรุณาเลือกไฟล์ที่ต้องการอัพโหลด'
        });
      }

      try {
        // Get the filename from multer
        const filename = req.file.filename;
        console.log('Uploaded filename:', filename); // Debug log

        // สร้าง URL สำหรับรูปภาพ
        const imageUrl = `http://localhost:5000/uploads/${filename}`;

        // ส่งข้อมูลกลับไป
        res.json({
          message: 'อัพโหลดรูปภาพสำเร็จ',
          filename: filename,
          imageUrl: imageUrl
        });
      } catch (error) {
        console.error('Error processing upload response:', error);
        res.status(500).json({
          message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์',
          error: error.message
        });
      }
    });
  },

  // Get users by role
  getUsersByRole: async (req, res) => {
    try {
      const results = await User.getUsersByRole(req.params.role);

      // Return empty array instead of 404 if no results found
      const mapped = results.map(user => ({
        ...user,
        avatar: user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : null
      }));

      res.json(mapped);
    } catch (err) {
      console.error('Error in getUsersByRole:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default userController;