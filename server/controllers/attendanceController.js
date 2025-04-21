import { insertAttendance } from '../models/attendanceModel.js';

export const createAttendance = (req, res) => {
  const attendanceData = req.body;

  if (!Array.isArray(attendanceData)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  insertAttendance(attendanceData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Attendance saved successfully', result });
  });
};

export const getAttendance = (req, res) => {
    const attendanceData = req.body;
  
    if (!Array.isArray(attendanceData)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }
  
    insertAttendance(attendanceData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Attendance', result });
    });
  };
