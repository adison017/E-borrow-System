import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for single file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'server', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer for multiple files upload with repair code
const repairImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use correct path: server/uploads/repair
    const uploadDir = path.join(process.cwd(), 'uploads', 'repair');
    console.log('[MULTER] UploadDir:', uploadDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('[MULTER] Created directory:', uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Get repair code from request body or generate one
    let repairCode = req.body.repair_code;

    // If no repair code in body, try to get from request object
    if (!repairCode && req.repair_code) {
      repairCode = req.repair_code;
    }

    // If still no repair code, generate one
    if (!repairCode) {
      repairCode = `RP${Date.now()}`;
    }

    // Get file index from request or generate one
    let fileIndex = req.fileIndex || 0;
    if (req.files) {
      fileIndex = req.files.length;
    }

    const fileExtension = path.extname(file.originalname);

    // Format: REPAIR_CODE_INDEX.ext (e.g., RP12345_1.jpg, RP12345_2.png)
    const filename = `${repairCode}_${fileIndex}${fileExtension}`;
    console.log('[MULTER] Saving file:', filename, 'for repair code:', repairCode, 'original:', file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer for equipment image upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

export const uploadRepairImages = multer({
  storage: repairImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

export const getPicUrl = (pic) => {
  if (!pic) return null;

  if (pic.startsWith('http')) {
    return pic;
  }

  // Remove leading slash if present
  const cleanPic = pic.startsWith('/') ? pic.slice(1) : pic;

  // Check if it's a repair image
  if (cleanPic.includes('repair/')) {
    return `http://localhost:5000/${cleanPic}`;
  }

  return `http://localhost:5000/uploads/${cleanPic}`;
};

// Function to process multiple repair images
export const processRepairImages = (files, repairCode) => {
  if (!files || files.length === 0) return [];

  return files.map((file, index) => ({
    filename: file.filename,
    original_name: file.originalname,
    file_path: `uploads/repair/${file.filename}`,
    url: `http://localhost:5000/uploads/repair/${file.filename}`,
    repair_code: repairCode,
    index: index
  }));
};

// Function to delete repair images
export const deleteRepairImages = async (images) => {
  if (!images || images.length === 0) return;

  for (const image of images) {
    try {
      const filePath = path.join(process.cwd(), 'server', image.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting image ${image.filename}:`, error);
    }
  }
};