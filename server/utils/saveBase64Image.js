import fs from 'fs/promises';
import path from 'path';

export const saveBase64Image = async (base64String, folder = 'uploads/signature') => {
  // Create folder if not exists
  await fs.mkdir(folder, { recursive: true });
  // Generate unique filename
  const filename = `signature_${Date.now()}.png`;
  const filePath = path.join(folder, filename);
  // Remove base64 header if present
  const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, '');
  await fs.writeFile(filePath, base64Data, 'base64');
  return `signature/${filename}`; // return relative path for DB
};
