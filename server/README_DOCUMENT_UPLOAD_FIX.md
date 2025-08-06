# การแก้ไขปัญหาไฟล์เอกสารที่อัปโหลดไป Cloudinary

## ปัญหา
เมื่ออัปโหลดไฟล์เอกสาร (เช่น .doc, .pdf, .xlsx) ไปยัง Cloudinary แล้ว ไฟล์ไม่ได้เป็นไฟล์รูปแบบเดิมที่ถูกต้อง แต่อาจจะกลายเป็นไฟล์อื่นหรือเสียหาย

## สาเหตุ
การใช้ `resource_type: 'auto'` ใน Cloudinary ทำให้ Cloudinary พยายามแปลงไฟล์เอกสารเป็นรูปแบบอื่น (เช่น แปลง .doc เป็นรูปภาพ) ซึ่งทำให้ไฟล์เสียหาย

## การแก้ไข

### 1. เปลี่ยน resource_type จาก 'auto' เป็น 'raw'

#### ใน `server/utils/cloudinaryUtils.js`:
```javascript
// เปลี่ยนจาก
resourceType = 'auto';

// เป็น
resourceType = 'raw';
```

#### ใน `server/utils/cloudinaryStorageConfig.js`:
```javascript
// เปลี่ยนจาก
resource_type: 'auto',

// เป็น
resource_type: 'raw',
```

### 2. ลบ transformation สำหรับไฟล์เอกสาร

#### ใน `server/utils/cloudinaryStorageConfig.js`:
```javascript
// ลบ transformation ออกเพื่อให้ไฟล์คงรูปแบบเดิม
// ไม่ใช้ transformation สำหรับไฟล์เอกสารเพื่อรักษารูปแบบเดิม
```

### 3. ปรับปรุงฟังก์ชัน uploadFile

#### ใน `server/utils/cloudinaryUtils.js`:
```javascript
// ตรวจสอบนามสกุลไฟล์เพื่อกำหนด resource_type
const fileExtension = path.extname(filePath).toLowerCase();
const isDocument = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'zip', 'rar', '7z', 'rtf', 'xml', 'json'].includes(fileExtension.substring(1));

const uploadOptions = {
  folder: folder,
  resource_type: isDocument ? 'raw' : 'auto',
  ...options
};
```

## ความแตกต่างระหว่าง resource_type

### resource_type: 'auto'
- Cloudinary จะพยายามแปลงไฟล์เป็นรูปแบบที่เหมาะสม
- สำหรับไฟล์เอกสาร อาจแปลงเป็นรูปภาพ
- เหมาะสำหรับรูปภาพและไฟล์ที่ต้องการการแปลง

### resource_type: 'raw'
- Cloudinary จะเก็บไฟล์ในรูปแบบเดิมโดยไม่แปลง
- รักษารูปแบบไฟล์และเนื้อหาตามต้นฉบับ
- เหมาะสำหรับไฟล์เอกสารที่ต้องการรักษารูปแบบเดิม

## การทดสอบ

### ใช้ไฟล์ทดสอบ:
```bash
npm run test-document-upload
```

### ผลลัพธ์ที่คาดหวัง:
- ไฟล์ .doc ควรยังคงเป็นไฟล์ .doc
- ไฟล์ .pdf ควรยังคงเป็นไฟล์ .pdf
- ไฟล์ .xlsx ควรยังคงเป็นไฟล์ .xlsx
- สามารถดาวน์โหลดและเปิดไฟล์ได้ตามปกติ

## ไฟล์ที่แก้ไข

1. `server/utils/cloudinaryUtils.js`
   - เปลี่ยน resource_type เป็น 'raw' สำหรับไฟล์เอกสาร
   - ปรับปรุงฟังก์ชัน uploadFile

2. `server/utils/cloudinaryStorageConfig.js`
   - เปลี่ยน resource_type เป็น 'raw'
   - ลบ transformation สำหรับไฟล์เอกสาร

3. `server/test-document-upload.js` (ใหม่)
   - ไฟล์ทดสอบการอัปโหลดไฟล์เอกสาร

4. `server/package.json`
   - เพิ่ม script สำหรับทดสอบ

## หมายเหตุ

- การใช้ `resource_type: 'raw'` จะทำให้ไฟล์มีขนาดเท่าเดิม (ไม่มีการบีบอัด)
- ไฟล์เอกสารจะไม่สามารถใช้ transformation ของ Cloudinary ได้
- ควรใช้เฉพาะกับไฟล์เอกสารที่ต้องการรักษารูปแบบเดิม
- สำหรับรูปภาพยังคงใช้ `resource_type: 'image'` หรือ `'auto'` ตามปกติ 