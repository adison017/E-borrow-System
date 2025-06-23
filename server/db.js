import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const connection = await mysql.createConnection('mysql://root:IrzGeAlNqVZZMPPYFQmtKLRKEkWQItUT@turntable.proxy.rlwy.net:34775/e-borrow');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connection Successful!');
    connection.release();
  } catch (err) {
    console.error('เชื่อมต่อฐานข้อมูลล้มเหลว: ', err);
  }
};

testConnection();

export default pool;

