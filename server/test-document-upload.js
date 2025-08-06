import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test function to upload a document file
async function testDocumentUpload() {
  try {
    console.log('🧪 ทดสอบการอัปโหลดไฟล์เอกสาร...');
    
    // สร้างไฟล์ทดสอบ (ไฟล์ข้อความ)
    const testContent = 'This is a test document file for testing Cloudinary upload with resource_type: raw';
    const testFilePath = path.join(process.cwd(), 'test-document.txt');
    
    // เขียนไฟล์ทดสอบ
    fs.writeFileSync(testFilePath, testContent);
    console.log(`📝 สร้างไฟล์ทดสอบ: ${testFilePath}`);
    
    // ทดสอบอัปโหลดด้วย resource_type: 'raw'
    console.log('📤 อัปโหลดไฟล์ด้วย resource_type: raw...');
    const result = await cloudinary.uploader.upload(testFilePath, {
      folder: 'e-borrow/test-documents',
      resource_type: 'raw',
      public_id: `test-document-${Date.now()}`
    });
    
    console.log('✅ อัปโหลดสำเร็จ!');
    console.log('📊 ผลลัพธ์:');
    console.log(`   - Public ID: ${result.public_id}`);
    console.log(`   - URL: ${result.secure_url}`);
    console.log(`   - Format: ${result.format}`);
    console.log(`   - Resource Type: ${result.resource_type}`);
    console.log(`   - Size: ${result.bytes} bytes`);
    
    // ลบไฟล์ทดสอบ
    fs.unlinkSync(testFilePath);
    console.log('🗑️ ลบไฟล์ทดสอบแล้ว');
    
    return result;
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    throw error;
  }
}

// Test function to upload with resource_type: 'auto' (for comparison)
async function testDocumentUploadAuto() {
  try {
    console.log('\n🧪 ทดสอบการอัปโหลดไฟล์เอกสารด้วย resource_type: auto...');
    
    // สร้างไฟล์ทดสอบ
    const testContent = 'This is a test document file for testing Cloudinary upload with resource_type: auto';
    const testFilePath = path.join(process.cwd(), 'test-document-auto.txt');
    
    // เขียนไฟล์ทดสอบ
    fs.writeFileSync(testFilePath, testContent);
    console.log(`📝 สร้างไฟล์ทดสอบ: ${testFilePath}`);
    
    // ทดสอบอัปโหลดด้วย resource_type: 'auto'
    console.log('📤 อัปโหลดไฟล์ด้วย resource_type: auto...');
    const result = await cloudinary.uploader.upload(testFilePath, {
      folder: 'e-borrow/test-documents',
      resource_type: 'auto',
      public_id: `test-document-auto-${Date.now()}`
    });
    
    console.log('✅ อัปโหลดสำเร็จ!');
    console.log('📊 ผลลัพธ์:');
    console.log(`   - Public ID: ${result.public_id}`);
    console.log(`   - URL: ${result.secure_url}`);
    console.log(`   - Format: ${result.format}`);
    console.log(`   - Resource Type: ${result.resource_type}`);
    console.log(`   - Size: ${result.bytes} bytes`);
    
    // ลบไฟล์ทดสอบ
    fs.unlinkSync(testFilePath);
    console.log('🗑️ ลบไฟล์ทดสอบแล้ว');
    
    return result;
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    throw error;
  }
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 เริ่มทดสอบการอัปโหลดไฟล์เอกสาร...\n');
    
    // ทดสอบ resource_type: 'raw'
    const rawResult = await testDocumentUpload();
    
    // ทดสอบ resource_type: 'auto'
    const autoResult = await testDocumentUploadAuto();
    
    console.log('\n📋 สรุปผลการทดสอบ:');
    console.log('='.repeat(50));
    console.log('Resource Type: raw');
    console.log(`   - Format: ${rawResult.format}`);
    console.log(`   - Resource Type: ${rawResult.resource_type}`);
    console.log(`   - URL: ${rawResult.secure_url}`);
    console.log('');
    console.log('Resource Type: auto');
    console.log(`   - Format: ${autoResult.format}`);
    console.log(`   - Resource Type: ${autoResult.resource_type}`);
    console.log(`   - URL: ${autoResult.secure_url}`);
    
    console.log('\n✅ การทดสอบเสร็จสิ้น!');
    
  } catch (error) {
    console.error('❌ การทดสอบล้มเหลว:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testDocumentUpload, testDocumentUploadAuto, runTests }; 