import 'dotenv/config';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


import categoryRoutes from './routes/categoryRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import repairRequestRoutes from './routes/repairRequestRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import damageLevelRoutes from './routes/damageLevelRoutes.js';
import lineRoutes from './routes/lineRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import contactInfoRoutes from './routes/contactInfoRoutes.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';
import './cron/notifySchedule.js';
import * as BorrowModel from './models/borrowModel.js';
import * as RepairRequest from './models/repairRequestModel.js';
import roomModel from './models/roomModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// ฟังก์ชัน broadcast badgeCountsUpdated
export function broadcastBadgeCounts(badges) {
  io.emit('badgeCountsUpdated', badges);
}

// ตัวอย่าง: เรียก broadcastBadgeCounts({ pendingCount: 1, carryCount: 2, borrowApprovalCount: 3, repairApprovalCount: 4 })
// ในจุดที่มีการเปลี่ยนแปลงข้อมูลที่เกี่ยวข้องกับ badge

io.on('connection', async (socket) => {
  console.log('Socket connected:', socket.id);
  // Query badge ปัจจุบัน
  try {
    const [pending, carry, pendingApproval] = await Promise.all([
      BorrowModel.getBorrowsByStatus(['pending']),
      BorrowModel.getBorrowsByStatus(['carry']),
      BorrowModel.getBorrowsByStatus(['pending_approval'])
    ]);
    const allRepairs = await RepairRequest.getAllRepairRequests();
    const repairApprovalCount = allRepairs.length;
    socket.emit('badgeCountsUpdated', {
      pendingCount: pending.length + pendingApproval.length,
      carryCount: carry.length,
      borrowApprovalCount: pendingApproval.length,
      repairApprovalCount
    });
  } catch (err) {
    console.error('Error sending initial badge counts:', err);
  }
});

// Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// LINE webhook route ต้องมาก่อน express.json()
app.use('/api/line', lineRoutes);

// ตัวนี้ค่อยใส่ทีหลัง
app.use(express.json());

// Serve static files from uploads directory with proper MIME types
// Apply CORS before static serving
app.use('/uploads', cors(), express.static(path.join(__dirname, '/uploads'), {
  setHeaders: (res, path) => {
    const ext = path.split('.').pop().toLowerCase();

    // Set proper MIME types for different file types
    switch (ext) {
      case 'pdf':
        res.setHeader('Content-Type', 'application/pdf');
        break;
      case 'txt':
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        break;
      case 'rtf':
        res.setHeader('Content-Type', 'application/rtf');
        break;
      case 'md':
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        break;
             case 'doc':
         res.setHeader('Content-Type', 'application/msword');
         res.setHeader('Content-Disposition', 'inline');
         break;
               case 'docx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'xls':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'ppt':
          res.setHeader('Content-Type', 'application/vnd.ms-powerpoint');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'pptx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
          res.setHeader('Content-Disposition', 'inline');
          break;
      case 'jpg':
      case 'jpeg':
        res.setHeader('Content-Type', 'image/jpeg');
        break;
      case 'png':
        res.setHeader('Content-Type', 'image/png');
        break;
      case 'gif':
        res.setHeader('Content-Type', 'image/gif');
        break;
      case 'webp':
        res.setHeader('Content-Type', 'image/webp');
        break;
      default:
        // Let Express handle other MIME types
        break;
    }
  }
}));

// Create nested router for user-related routes
const userRouter = express.Router();
userRouter.use('/', userRoutes);
userRouter.use('/positions', positionRoutes);
userRouter.use('/branches', branchRoutes);
userRouter.use('/roles', roleRoutes);
app.use('/api/users', userRouter);

// Route อื่นๆ ที่ต้องการอ่าน req.body
app.use('/api/borrows', borrowRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/repair-requests', repairRequestRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/damage-levels', damageLevelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('สวัสดี Express API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Error stack:', err.stack);

    // Handle multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'ขนาดไฟล์ใหญ่เกินไป',
      error: err.message
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      message: 'อัปโหลดไฟล์มากเกินไป',
      error: err.message
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message: 'ฟิลด์ไฟล์ไม่ถูกต้อง',
      error: err.message
    });
  }

  // Handle custom file format errors
  if (err.message && err.message.includes('รูปแบบไฟล์ไม่ได้รับอนุญาต')) {
    return res.status(400).json({
      message: err.message,
      error: err.message
    });
  }

  res.status(err.http_code || 500).json({
    message: 'เกิดข้อผิดพลาดในระบบ!',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for:', ['http://localhost:5173', 'http://127.0.0.1:5173']);
  console.log('Socket.IO server started');

  // Initialize database tables after server starts
  try {
    await roomModel.initialize();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.warn('⚠️ Database initialization failed:', error.message);
    console.warn('Some features may not work properly');
  }
});