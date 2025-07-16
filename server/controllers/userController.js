import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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

      // ปรับโครงสร้างข้อมูลตำแหน่งและสาขาให้ frontend ใช้งานง่าย
      const userOut = {
        ...user,
        position: user.position_id ? { id: user.position_id, name: user.position_name } : null,
        branch: user.branch_id ? { id: user.branch_id, name: user.branch_name } : null
      };

      res.json(userOut);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        message: 'An error occurred while fetching user',
        error: err.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'กรุณากรอก username และ password' });
      }
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'ไม่พบผู้ใช้งานนี้' });
      }
      // ตรวจสอบรหัสผ่าน (hash)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }
      // กำหนด role string สำหรับ frontend
      let role = 'user';
      if (user.role_name && user.role_name.toLowerCase().includes('admin')) role = 'admin';
      else if (user.role_name && user.role_name.toLowerCase().includes('executive')) role = 'executive';
      // สร้าง JWT token
      const token = jwt.sign({ user_id: user.user_id, username: user.username, role }, JWT_SECRET, { expiresIn: '7d' });
      // ส่งข้อมูล user (ไม่รวม password) + token + เฉพาะ field ที่จำเป็น
      const { user_id, user_code, username: userUsername, Fullname, email, phone, avatar, street, parish, district, province, postal_no } = user;
      console.log('LOGIN RESPONSE:', {
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: {
          user_id,
          user_code,
          username: userUsername,
          Fullname,
          email,
          phone,
          avatar,
          street,
          parish,
          district,
          province,
          postal_no,
          role
        }
      });
      res.json({
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: {
          user_id,
          user_code,
          username: userUsername,
          Fullname,
          email,
          phone,
          avatar,
          street,
          parish,
          district,
          province,
          postal_no,
          role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const userData = req.body;
      console.log('Creating user with data:', userData);

      // hash password ก่อนบันทึก
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

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
      const userId = parseInt(req.params.id, 10);
      console.log('Updating user with ID:', userId);
      console.log('Request body:', req.body);

      // ตรวจสอบว่ามี ID หรือไม่
      if (!userId) {
        return res.status(400).json({
          message: 'Invalid user ID',
          error: 'User ID is required'
        });
      }

      // ตรวจสอบว่ามีข้อมูลที่จะอัพเดทหรือไม่
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: 'No data provided for update',
          error: 'Request body is empty'
        });
      }

      const result = await User.updateById(userId, req.body);
      console.log('Update result:', result);

      if (!result || result.affectedRows === 0) {
        return res.status(404).json({
          message: 'User not found or no changes made',
          error: 'Update operation did not affect any rows'
        });
      }

      // ดึงข้อมูลผู้ใช้ที่อัพเดทแล้ว
      const updatedUser = await User.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({
          message: 'Failed to fetch updated user data',
          error: 'User not found after update'
        });
      }

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).json({
        message: 'Error updating user',
        error: error.message || 'Unknown error occurred'
      });
    }
  },

  updateLineNotifyEnabled: async (req, res) => {
    const userId = req.params.id;
    const { line_notify_enabled } = req.body;
    try {
      if (typeof line_notify_enabled === 'undefined') {
        return res.status(400).json({ message: 'Missing line_notify_enabled' });
      }
      const result = await User.updateLineNotifyEnabled(userId, line_notify_enabled);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'อัปเดตสถานะแจ้งเตือน LINE สำเร็จ' });
    } catch (err) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
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