import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb',
});

connection.connect((err) => {
  if (err) {
    console.error('เชื่อมต่อฐานข้อมูลล้มเหลว: ', err);
  } else {
    console.log('✅ Connection Successful!');
  }
});

// ส่งออก connection ด้วย ES module
export default connection;
