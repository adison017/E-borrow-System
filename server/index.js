import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import attendanceRoutes from './routes/attendanceRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/attendance', attendanceRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/category', categoryRoutes);

// เสิร์ฟไฟล์ static จาก uploads (ใช้ absolute path)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
