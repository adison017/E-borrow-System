import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
// Apply CORS before static serving
app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

// Create nested router for user-related routes
const userRouter = express.Router();
userRouter.use('/', userRoutes);
userRouter.use('/positions', positionRoutes);
userRouter.use('/branches', branchRoutes);
userRouter.use('/roles', roleRoutes);
app.use('/users', userRouter);

// News routes
app.use('/api/news', newsRoutes);

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for:', ['http://localhost:5173', 'http://127.0.0.1:5173']);
});