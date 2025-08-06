# Cloudinary Folder Structure สำหรับ E-Borrow System

## ภาพรวม
ระบบ E-Borrow ได้ถูกออกแบบให้ใช้ Cloudinary สำหรับการจัดเก็บรูปภาพและไฟล์ต่างๆ โดยมีการจัดระเบียบ folder structure ที่สอดคล้องกับโครงสร้างการใช้งานในระบบ

## โครงสร้าง Folder ใน Cloudinary

### 1. โครงสร้างหลัก
```
e-borrow/
├── equipment/           # รูปภาพครุภัณฑ์
├── user/               # รูปโปรไฟล์ผู้ใช้
├── repair/             # รูปภาพการซ่อมแซม
├── handover_photo/     # รูปภาพการส่งมอบ
├── pay_slip/          # ใบเสร็จการชำระเงิน
├── roomimg/           # รูปภาพห้อง
├── signature/         # ลายเซ็น
├── important_documents/ # เอกสารสำคัญ
├── logo/              # โลโก้ระบบ
└── general/           # ไฟล์ทั่วไป
```

### 2. รายละเอียดแต่ละ Folder

#### `e-borrow/equipment/`
- **วัตถุประสงค์**: เก็บรูปภาพครุภัณฑ์
- **รูปแบบไฟล์**: JPG, JPEG, PNG, GIF, WEBP
- **ขนาดไฟล์**: สูงสุด 5MB
- **การตั้งชื่อ**: ใช้ `item_code` ของครุภัณฑ์เป็นชื่อไฟล์
- **ตัวอย่าง**: `EQ-001.jpg`, `EQ-002.png`

#### `e-borrow/user/`
- **วัตถุประสงค์**: เก็บรูปโปรไฟล์ผู้ใช้
- **รูปแบบไฟล์**: JPG, JPEG, PNG
- **ขนาดไฟล์**: สูงสุด 2MB
- **การตั้งชื่อ**: ใช้ `user_code` เป็นชื่อไฟล์
- **ตัวอย่าง**: `00466666.jpg`, `0052123.png`

#### `e-borrow/repair/`
- **วัตถุประสงค์**: เก็บรูปภาพการซ่อมแซม
- **รูปแบบไฟล์**: JPG, JPEG, PNG, GIF, WEBP
- **ขนาดไฟล์**: สูงสุด 5MB ต่อไฟล์ (สูงสุด 10 ไฟล์)
- **การตั้งชื่อ**: `{repair_code}_{index}.{ext}`
- **ตัวอย่าง**: `RP-12345_1.jpg`, `RP-12345_2.png`

#### `e-borrow/handover_photo/`
- **วัตถุประสงค์**: เก็บรูปภาพการส่งมอบครุภัณฑ์
- **รูปแบบไฟล์**: JPG, JPEG, PNG
- **ขนาดไฟล์**: สูงสุด 5MB
- **การตั้งชื่อ**: `handover-{borrow_code}.{ext}`
- **ตัวอย่าง**: `handover-BR-1234.jpg`

#### `e-borrow/pay_slip/`
- **วัตถุประสงค์**: เก็บใบเสร็จการชำระเงิน
- **รูปแบบไฟล์**: JPG, JPEG, PNG
- **ขนาดไฟล์**: สูงสุด 5MB
- **การตั้งชื่อ**: `{borrow_code}_slip.{ext}`
- **ตัวอย่าง**: `BR-1234_slip.jpg`

#### `e-borrow/roomimg/`
- **วัตถุประสงค์**: เก็บรูปภาพห้อง
- **รูปแบบไฟล์**: JPG, JPEG, PNG, GIF, WEBP
- **ขนาดไฟล์**: สูงสุด 5MB ต่อไฟล์ (สูงสุด 5 ไฟล์)
- **การตั้งชื่อ**: `room_{timestamp}_{random}.{ext}`
- **ตัวอย่าง**: `room_1754385989022_445.png`

#### `e-borrow/signature/`
- **วัตถุประสงค์**: เก็บลายเซ็นดิจิทัล
- **รูปแบบไฟล์**: JPG, JPEG, PNG
- **ขนาดไฟล์**: สูงสุด 2MB
- **การตั้งชื่อ**: `signature_{timestamp}.{ext}`
- **ตัวอย่าง**: `signature_1751296143488.png`

#### `e-borrow/important_documents/`
- **วัตถุประสงค์**: เก็บเอกสารสำคัญ
- **รูปแบบไฟล์**: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
- **ขนาดไฟล์**: สูงสุด 10MB ต่อไฟล์ (สูงสุด 5 ไฟล์)
- **การตั้งชื่อ**: `{borrow_code}_important_documents.{ext}`
- **ตัวอย่าง**: `BR-1234_important_documents.pdf`

#### `e-borrow/logo/`
- **วัตถุประสงค์**: เก็บโลโก้ระบบ
- **รูปแบบไฟล์**: JPG, JPEG, PNG, GIF, WEBP
- **ขนาดไฟล์**: สูงสุด 5MB
- **การตั้งชื่อ**: ตามชื่อไฟล์เดิม
- **ตัวอย่าง**: `logo_w.png`

#### `e-borrow/general/`
- **วัตถุประสงค์**: เก็บไฟล์ทั่วไป
- **รูปแบบไฟล์**: ทุกประเภท
- **ขนาดไฟล์**: สูงสุด 10MB
- **การตั้งชื่อ**: ตามชื่อไฟล์เดิม
- **ตัวอย่าง**: `document.pdf`

## การใช้งาน

### 1. สร้าง Folder Structure
```bash
# ใช้ script ที่สร้างไว้
node server/scripts/create-cloudinary-folders.js

# หรือใช้ API endpoint
POST /api/cloudinary/create-folders
```

### 2. ดูรายการ Folder
```bash
# ใช้ API endpoint
GET /api/cloudinary/list-folders
```

### 3. อัปโหลดไฟล์
```javascript
// ตัวอย่างการอัปโหลดรูปภาพครุภัณฑ์
const uploadImage = async (file, item_code) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`/api/equipment/upload?item_code=${item_code}`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};
```

## การตั้งค่า

### 1. Environment Variables
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. การตั้งค่าใน Frontend
```javascript
// ตรวจสอบการตั้งค่า
const config = await getCloudinaryConfig();

// ทดสอบการเชื่อมต่อ
const test = await testCloudinaryConnection();

// สร้าง folder structure
const create = await createCloudinaryFolders();
```

## ข้อดีของการใช้ Cloudinary

1. **ประสิทธิภาพ**: การแปลงรูปภาพอัตโนมัติ
2. **ความปลอดภัย**: ไฟล์ถูกจัดเก็บในระบบ Cloud ที่ปลอดภัย
3. **ความเร็ว**: CDN สำหรับการส่งมอบไฟล์ที่รวดเร็ว
4. **การจัดการ**: ระบบจัดการไฟล์ที่ครบครัน
5. **การปรับขนาด**: ปรับขนาดรูปภาพอัตโนมัติตามความต้องการ

## การบำรุงรักษา

### 1. การลบไฟล์ที่ไม่ใช้
```javascript
// ลบไฟล์จาก Cloudinary
const deleteFile = async (publicId) => {
  const response = await fetch(`/api/cloudinary/delete/${publicId}`, {
    method: "DELETE",
  });
  return response.json();
};
```

### 2. การตรวจสอบการใช้งาน
```javascript
// ดูสถิติการใช้งาน
const stats = await getCloudinaryUsageStats();
```

### 3. การย้ายไฟล์จาก Local Storage
```javascript
// ฟีเจอร์ที่จะเปิดให้ใช้งานเร็วๆ นี้
const migrate = await fetch('/api/cloudinary/migrate-files', {
  method: "POST",
});
```

## หมายเหตุสำคัญ

1. **การตั้งชื่อไฟล์**: ใช้ระบบการตั้งชื่อที่เป็นมาตรฐานเพื่อความสะดวกในการจัดการ
2. **ขนาดไฟล์**: กำหนดขนาดไฟล์ที่เหมาะสมเพื่อประหยัดพื้นที่จัดเก็บ
3. **รูปแบบไฟล์**: รองรับเฉพาะรูปแบบไฟล์ที่จำเป็น
4. **การสำรองข้อมูล**: Cloudinary มีระบบสำรองข้อมูลอัตโนมัติ
5. **การเข้าถึง**: ไฟล์สามารถเข้าถึงได้ผ่าน URL ที่ปลอดภัย