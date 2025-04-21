import db from '../db.js';

export const insertAttendance = (data, callback) => {
  const sql = 'INSERT INTO Attendance (student_id, schedule_id, date, status) VALUES ?';
  const values = data.map(item => [item.student_id, item.schedule_id, item.date, item.status]);
  db.query(sql, [values], callback);
};

export const getAttendance = (data, callback) => {
  const sql = 'SELECT * FROM Attendance ';
  const values = data.map(item => [item.student_id, item.schedule_id, item.date, item.status]);
  db.query(sql, [values], callback);
};