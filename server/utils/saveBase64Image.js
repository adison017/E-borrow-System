import fs from 'fs/promises';
import path from 'path';

export const saveBase64Image = async (base64String, folder = 'uploads/signature', filename = null, borrowCode = null) => {
  console.log('=== saveBase64Image Debug ===');
  console.log('folder:', folder);
  console.log('filename:', filename);
  console.log('borrowCode:', borrowCode);
  console.log('base64String length:', base64String ? base64String.length : 0);

  // Create folder if not exists
  await fs.mkdir(folder, { recursive: true });
  console.log('Folder created/verified:', folder);

  // Generate unique filename
  if (!filename) {
    if (borrowCode) {
      // ใช้ borrow_code ในการตั้งชื่อไฟล์ และใช้สกุลไฟล์เดียวกัน (.jpg)
      filename = folder.includes('handover_photo') ?
        `handover-${borrowCode}.jpg` :
        `signature-${borrowCode}.jpg`;
    } else {
      // fallback ใช้ timestamp ถ้าไม่มี borrow_code และใช้สกุลไฟล์เดียวกัน (.jpg)
      const timestamp = Date.now();
      filename = folder.includes('handover_photo') ? `handover_${timestamp}.jpg` : `signature_${timestamp}.jpg`;
    }
  }
  console.log('Final filename:', filename);

  const filePath = path.join(folder, filename);
  console.log('Full file path:', filePath);

  // Remove base64 header if present
  const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, '');
  console.log('Base64 data length after cleanup:', base64Data.length);

  await fs.writeFile(filePath, base64Data, 'base64');
  console.log('File written successfully');

  const relativePath = `${folder.replace('uploads/', '')}/${filename}`;
  console.log('Returning relative path:', relativePath);
  return relativePath; // return relative path for DB
};
