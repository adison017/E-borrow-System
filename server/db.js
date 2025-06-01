import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '',         
  database: 'e-borrow', 
});

connection.connect((err) => {
  if (err) {
    console.error('เชื่อมต่อฐานข้อมูลล้มเหลว: ', err);
  } else {
    console.log('✅ Connection Successful!');
  }
});

export default connection;