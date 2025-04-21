import express from 'express';
import cors from 'cors';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/attendance', attendanceRoutes);


app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
