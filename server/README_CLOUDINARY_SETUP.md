# การตั้งค่า Cloudinary สำหรับ E-Borrow System

## ภาพรวม

Cloudinary เป็นบริการ cloud storage สำหรับไฟล์ที่ใช้ในการอัปโหลดและจัดการไฟล์ในระบบ E-Borrow

## ขั้นตอนการตั้งค่า

### 1. สร้างบัญชี Cloudinary

1. ไปที่ [cloudinary.com](https://cloudinary.com)
2. สมัครบัญชีใหม่ (มีฟรี tier)
3. เข้าสู่ระบบและไปที่ Dashboard

### 2. รับข้อมูลการเชื่อมต่อ

ใน Dashboard ของ Cloudinary คุณจะพบข้อมูลต่อไปนี้:
- **Cloud Name**: ชื่อ cloud ของคุณ
- **API Key**: คีย์สำหรับการเข้าถึง API
- **API Secret**: รหัสลับสำหรับการเข้าถึง API

### 3. ตั้งค่า Environment Variables

เพิ่มข้อมูลต่อไปนี้ในไฟล์ `.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. ตรวจสอบการตั้งค่า

รันเซิร์ฟเวอร์และตรวจสอบ console logs:
- ✅ ถ้าเห็น "Using Cloudinary storage" = ตั้งค่าสำเร็จ
- ⚠️ ถ้าเห็น "Cloudinary is not configured" = ต้องตรวจสอบการตั้งค่า

## ประเภทไฟล์ที่รองรับ

Cloudinary รองรับไฟล์ประเภทต่อไปนี้:

### เอกสาร
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Microsoft PowerPoint (.ppt, .pptx)
- Text files (.txt, .csv, .html)
- Rich Text Format (.rtf)
- XML (.xml)
- JSON (.json)

### รูปภาพ
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### ไฟล์บีบอัด
- ZIP (.zip)
- RAR (.rar)
- 7-Zip (.7z)

## การจัดการไฟล์

### โฟลเดอร์ใน Cloudinary

ระบบจะสร้างโฟลเดอร์ต่อไปนี้ใน Cloudinary:
- `e-borrow/equipment` - รูปภาพครุภัณฑ์
- `e-borrow/user` - รูปโปรไฟล์ผู้ใช้
- `e-borrow/repair` - รูปภาพการซ่อมแซม
- `e-borrow/handover_photo` - รูปภาพการส่งมอบ
- `e-borrow/pay_slip` - ใบเสร็จเงินเดือน
- `e-borrow/roomimg` - รูปภาพห้อง
- `e-borrow/signature` - ลายเซ็น
- `e-borrow/important_documents` - เอกสารสำคัญ
- `e-borrow/logo` - โลโก้

### การสร้างโฟลเดอร์อัตโนมัติ

ระบบจะสร้างโฟลเดอร์อัตโนมัติเมื่อมีการอัปโหลดไฟล์ครั้งแรก

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **"Cloudinary is not configured"**
   - ตรวจสอบไฟล์ `.env`
   - ตรวจสอบ environment variables

2. **"An unknown file format not allowed"**
   - ตรวจสอบประเภทไฟล์ที่อัปโหลด
   - ใช้ไฟล์ประเภทที่รองรับ

3. **"Upload failed"**
   - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
   - ตรวจสอบ Cloudinary account status

### การตรวจสอบสถานะ

```javascript
// ตรวจสอบการเชื่อมต่อ Cloudinary
const { cloudinaryUtils } = require('./utils/cloudinaryUtils');

cloudinaryUtils.getAccountInfo()
  .then(result => {
    if (result.success) {
      console.log('✅ Cloudinary connection successful');
    } else {
      console.log('❌ Cloudinary connection failed:', result.error);
    }
  });
```

## ข้อจำกัด

### Free Tier
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

### การอัปเกรด
หากต้องการพื้นที่เพิ่มเติม สามารถอัปเกรดเป็น paid plan ได้

## ความปลอดภัย

- API Secret ต้องเก็บเป็นความลับ
- อย่าเปิดเผย API Secret ในโค้ด
- ใช้ environment variables เสมอ
- ตรวจสอบ Cloudinary security settings

## การสำรองข้อมูล

Cloudinary มีระบบสำรองข้อมูลอัตโนมัติ แต่แนะนำให้:
- สำรองข้อมูลสำคัญในที่อื่นด้วย
- ตรวจสอบ backup settings ใน Cloudinary dashboard