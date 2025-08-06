import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test the filename generation functions
const testFilenameGeneration = () => {
  console.log('🧪 ทดสอบการสร้างชื่อไฟล์สำหรับ Cloudinary\n');

  // Mock file objects for testing
  const testFiles = [
    { originalname: 'document.pdf', fieldname: 'important_documents' },
    { originalname: 'report.docx', fieldname: 'important_documents' },
    { originalname: 'data.xlsx', fieldname: 'important_documents' },
    { originalname: 'image.jpg', fieldname: 'important_documents' },
    { originalname: 'ไฟล์ภาษาไทย.pdf', fieldname: 'important_documents' },
    { originalname: 'file with spaces.doc', fieldname: 'important_documents' }
  ];

  const borrowCode = 'BR-1234';

  console.log('📄 ทดสอบ generateCloudinaryFilename จาก cloudinaryStorageConfig.js:');
  
  // Import the function from cloudinaryStorageConfig.js
  try {
    const { generateCloudinaryFilename } = await import('./utils/cloudinaryStorageConfig.js');
    
    testFiles.forEach(file => {
      const filename = generateCloudinaryFilename({}, file, borrowCode);
      console.log(`  ${file.originalname} → ${filename}`);
    });
  } catch (error) {
    console.log('  ❌ ไม่สามารถ import generateCloudinaryFilename ได้:', error.message);
  }

  console.log('\n📄 ทดสอบ filename generation ใน cloudinaryUtils.js:');
  
  // Test the logic from cloudinaryUtils.js
  testFiles.forEach(file => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);

    // แปลงชื่อไฟล์เป็น slug (ตัวอักษรอังกฤษล้วน)
    let slug = originalName.toLowerCase()
      .replace(/[^\w\s-]/g, '') // ลบอักขระพิเศษ
      .replace(/[ก-๙]/g, '') // ลบตัวอักษรไทย
      .replace(/[^\x00-\x7F]/g, '') // ลบอักขระที่ไม่ใช่ ASCII
      .replace(/[\s_-]+/g, '-') // แทนที่ช่องว่าง, ขีดล่าง, ขีดกลาง ด้วยขีดกลาง
      .replace(/^-+|-+$/g, ''); // ลบขีดกลางที่อยู่หน้าและท้าย

    // ถ้า slug ว่างเปล่า ให้ใช้ชื่อไฟล์เริ่มต้น
    if (!slug) {
      slug = 'document';
    }

    // จำกัดความยาวไม่เกิน 50 ตัวอักษร
    if (slug.length > 50) {
      slug = slug.substring(0, 50);
    }

    // ตรวจสอบว่าเป็นเอกสารหรือรูปภาพ
    const isDocument = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'zip', 'rar', '7z', 'rtf', 'xml', 'json'].includes(extension.substring(1));
    const resourceType = isDocument ? 'raw' : 'image';

    // สร้างชื่อไฟล์ตาม resource_type
    let customFilename;
    if (resourceType === 'raw') {
      customFilename = `${borrowCode}_${slug}_${uniqueSuffix}${extension}`;
    } else {
      customFilename = `${borrowCode}_${slug}_${uniqueSuffix}`;
    }

    console.log(`  ${file.originalname} (${resourceType}) → ${customFilename}`);
  });

  console.log('\n✅ การทดสอบเสร็จสิ้น');
  console.log('\n📋 สรุปการแก้ไข:');
  console.log('  1. สำหรับ resource_type: "raw" (ไฟล์เอกสาร) → ใส่นามสกุลไฟล์ในชื่อไฟล์');
  console.log('  2. สำหรับ resource_type: "image" (รูปภาพ) → ไม่ใส่นามสกุลไฟล์ (Cloudinary จะเพิ่มให้อัตโนมัติ)');
  console.log('  3. ตรวจสอบว่าไฟล์ .pdf, .doc, .docx, .xlsx ฯลฯ จะมีนามสกุลในชื่อไฟล์');
};

// Run the test
testFilenameGeneration(); 