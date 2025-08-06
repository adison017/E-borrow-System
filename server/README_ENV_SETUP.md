# การตั้งค่า Environment Variables

## ไฟล์ .env ที่จำเป็น

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` ด้วยข้อมูลต่อไปนี้:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=e_borrow_system
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (สำหรับการอัปโหลดไฟล์)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# LINE Bot Configuration (ไม่บังคับ - ถ้าไม่มีเซิร์ฟเวอร์จะทำงานได้ปกติ)
# token=your_line_bot_channel_access_token
# secretcode=your_line_bot_channel_secret

# Email Configuration (ถ้าต้องการส่งอีเมล)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_email_password

# Other Configuration
# CORS_ORIGIN=http://localhost:5173
```

## คำอธิบาย

### ตัวแปรที่จำเป็น (Required)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: การตั้งค่าฐานข้อมูล MySQL
- `JWT_SECRET`: คีย์สำหรับการเข้ารหัส JWT tokens
- `CLOUDINARY_*`: การตั้งค่า Cloudinary สำหรับการอัปโหลดไฟล์

### ตัวแปรที่ไม่จำเป็น (Optional)
- `token`, `secretcode`: สำหรับ LINE Bot (ถ้าไม่มีเซิร์ฟเวอร์จะทำงานได้ปกติ)
- `EMAIL_*`: สำหรับการส่งอีเมล
- `CORS_ORIGIN`: สำหรับการตั้งค่า CORS

## หมายเหตุ

- ถ้าไม่มี LINE Bot configuration เซิร์ฟเวอร์จะแสดง warning แต่จะทำงานได้ปกติ
- ระบบจะใช้ fallback storage สำหรับการอัปโหลดไฟล์ถ้า Cloudinary ไม่ได้ตั้งค่า
- ตรวจสอบให้แน่ใจว่าฐานข้อมูล MySQL ทำงานและมีฐานข้อมูล `e_borrow_system`