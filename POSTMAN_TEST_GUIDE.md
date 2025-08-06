# คู่มือทดสอบ Cloudinary API ด้วย Postman

## 1. Login เพื่อรับ JWT Token

### Request:
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

### Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "email": "admin@example.com"
  }
}
```

**คัดลอก token ไปใช้ในขั้นตอนต่อไป**

---

## 2. ทดสอบการเชื่อมต่อ Cloudinary

### Request:
```
GET http://localhost:5000/api/cloudinary/test-connection
Authorization: Bearer YOUR_TOKEN_HERE
```

### Expected Response (Success):
```json
{
  "success": true,
  "message": "เชื่อมต่อ Cloudinary สำเร็จ",
  "data": {
    "status": "ok"
  }
}
```

### Expected Response (Failed):
```json
{
  "success": false,
  "message": "ไม่สามารถเชื่อมต่อ Cloudinary ได้",
  "error": "Invalid API Key"
}
```

---

## 3. ดูการตั้งค่า Cloudinary

### Request:
```
GET http://localhost:5000/api/cloudinary/config
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response:
```json
{
  "success": true,
  "data": {
    "cloud_name": "your_cloud_name",
    "api_key": "123456789012345",
    "is_configured": true
  }
}
```

---

## 4. อัปโหลดรูปภาพ

### Request:
```
POST http://localhost:5000/api/cloudinary/upload
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Body (form-data):
- file: [Select Image File]
- folder: e-borrow/test
```

### Response:
```json
{
  "success": true,
  "message": "อัปโหลดไฟล์สำเร็จ",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/e-borrow/test/abc123.jpg",
    "public_id": "e-borrow/test/abc123",
    "format": "jpg",
    "size": 123456,
    "width": 1920,
    "height": 1080
  }
}
```

---

## 5. อัปโหลดรูปครุภัณฑ์ (ใช้ item_code เป็นชื่อไฟล์)

### Request:
```
POST http://localhost:5000/api/equipment/upload
Content-Type: multipart/form-data

Body (form-data):
- image: [Select Image File]
- item_code: EQ-001
```

### Response:
```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/e-borrow/equipment/EQ-001.jpg",
  "public_id": "e-borrow/equipment/EQ-001",
  "item_code": "EQ-001"
}
```

**หมายเหตุ:** ไฟล์จะถูกตั้งชื่อเป็น `EQ-001` แทนที่จะเป็นชื่อไฟล์เดิม

---

## 6. ลบไฟล์

### Request:
```
DELETE http://localhost:5000/api/cloudinary/delete/e-borrow/test/abc123
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** ใช้ public_id ที่ได้จากการ upload

### Response:
```json
{
  "success": true,
  "message": "ลบไฟล์สำเร็จ",
  "data": {
    "result": "ok"
  }
}
```

---

## Quick Test Steps:

1. **Login** → คัดลอก token
2. **Test Connection** → ตรวจสอบว่าเชื่อมต่อ Cloudinary ได้
3. **Upload File** → ทดสอบอัปโหลดรูปภาพ
4. **Check Cloudinary Dashboard** → ดูรูปที่อัปโหลดใน https://cloudinary.com/console
5. **Delete File** → ทดสอบลบไฟล์ (optional)