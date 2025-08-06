import cors from 'cors';
import 'dotenv/config';

import path from 'path';
import { fileURLToPath } from 'url';
import branchRoutes from './routes/branchRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


import './cron/notifySchedule.js';
import * as BorrowModel from './models/borrowModel.js';
import * as RepairRequest from './models/repairRequestModel.js';
import borrowRoutes from './routes/borrowRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import damageLevelRoutes from './routes/damageLevelRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import lineRoutes from './routes/lineRoutes.js';
import repairRequestRoutes from './routes/repairRequestRoutes.js';
import returnRoutes from './routes/returnRoutes.js';


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

// Serve static files from uploads directory
// Apply CORS before static serving
app.use('/uploads', cors(), express.static(path.join(__dirname, '/uploads')));

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

// Executive dashboard analytics endpoints
import dashboardRoutes from './routes/dashboardRoutes.js';
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('สวัสดี Express API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for:', ['http://localhost:5173', 'http://127.0.0.1:5173']);
  console.log('Socket.IO server started');
});