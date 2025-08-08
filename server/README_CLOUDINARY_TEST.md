# คู่มือทดสอบ Cloudinary API

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
  "error": "Invalid API Key",
  "suggestion": "Please check your Cloudinary credentials and internet connection"
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
    "api_key": "***configured***",
    "is_configured": true
  }
}
```

---

## 4. ทดสอบการอัปโหลดเอกสารสำคัญ

### Request:
```
POST http://localhost:5000/api/borrows
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Body (form-data):
- important_documents: [Select File]
- other_form_data: ...
```

### Expected Response (Success):
```json
{
  "success": true,
  "message": "สร้างการยืมสำเร็จ",
  "data": {
    "borrow_id": 123,
    "important_documents": [
      {
        "url": "https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/e-borrow/important_documents/document.pdf",
        "public_id": "e-borrow/important_documents/document"
      }
    ]
  }
}
```

### Expected Response (File Format Error):
```json
{
  "success": false,
  "message": "รูปแบบไฟล์ไม่รองรับโดย Cloudinary",
  "error": "An unknown file format not allowed",
  "suggestion": "Cloudinary รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, ZIP, RAR, RTF, XML, JSON",
  "supportedFormats": [
    "PDF (.pdf)",
    "Microsoft Word (.doc, .docx)",
    "Microsoft Excel (.xls, .xlsx)",
    "Text files (.txt, .csv, .html)",
    "Images (.jpg, .jpeg, .png, .gif, .webp)",
    "Compressed files (.zip, .rar, .7z)",
    "Other (.rtf, .xml, .json)"
  ]
}
```

---

## 5. ลบไฟล์

### Request:
```
DELETE http://localhost:5000/api/cloudinary/delete/e-borrow/important_documents/document
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
3. **Upload Document** → ทดสอบอัปโหลดเอกสารสำคัญ
4. **Check Cloudinary Dashboard** → ดูไฟล์ที่อัปโหลดใน https://cloudinary.com/console
5. **Delete File** → ทดสอบลบไฟล์ (optional)

---

## การแก้ไขปัญหา

### ปัญหา: "An unknown file format not allowed"

**สาเหตุ:** Cloudinary ไม่รองรับรูปแบบไฟล์ที่อัปโหลด

**วิธีแก้:**
1. ตรวจสอบประเภทไฟล์ที่อัปโหลด
2. ใช้ไฟล์ประเภทที่รองรับ
3. ตรวจสอบการตั้งค่า Cloudinary

### ปัญหา: "Cloudinary is not configured"

**สาเหตุ:** ไม่ได้ตั้งค่า environment variables

**วิธีแก้:**
1. ตรวจสอบไฟล์ `.env`
2. เพิ่ม CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### ปัญหา: "Invalid API Key"

**สาเหตุ:** API Key ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ API Key ใน Cloudinary Dashboard
2. ตรวจสอบการตั้งค่าใน `.env`

---

## หมายเหตุ

- ไฟล์ที่อัปโหลดจะถูกเก็บในโฟลเดอร์ `e-borrow/important_documents` ใน Cloudinary
- ขนาดไฟล์สูงสุด: 10MB ต่อไฟล์
- จำนวนไฟล์สูงสุด: 5 ไฟล์ต่อครั้ง
- รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, ZIP, RAR, RTF, XML, JSON