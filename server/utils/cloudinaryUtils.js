import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { SUPPORTED_MIME_TYPES } from './supported-file-types.js';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn('⚠️ Cloudinary environment variables are not configured. File uploads will fail.');
  console.warn('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
}

// Create Cloudinary storage configuration
const createCloudinaryStorage = (folder, allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'], customPublicId = null) => {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary is not configured. Using fallback storage.');
    return multer.memoryStorage();
  }

  try {
    // ตรวจสอบประเภทไฟล์เพื่อกำหนด resource_type
    const hasDocuments = allowedFormats.some(format =>
      ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv', 'html', 'zip', 'rar', '7z', 'rtf', 'xml', 'json'].includes(format)
    );

    const resourceType = hasDocuments ? 'auto' : 'image';

    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowed_formats: allowedFormats,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        public_id: customPublicId ? () => customPublicId : undefined,
        resource_type: resourceType // ใช้ auto สำหรับไฟล์หลายประเภท
      }
    });
  } catch (error) {
    console.warn('⚠️ Error creating Cloudinary storage, using fallback storage:', error.message);
    return multer.memoryStorage();
  }
};

// File filter for different file types
const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    console.log(`การพยายามอัปโหลดไฟล์ - ชื่อไฟล์: ${file.originalname}, ประเภท MIME: ${file.mimetype}`);
    console.log(`ประเภทไฟล์ที่รองรับ: ${allowedTypes.join(', ')}`);

    // ตรวจสอบ MIME type
    const isMimeTypeSupported = allowedTypes.includes(file.mimetype);
    console.log(`ไฟล์นี้รองรับหรือไม่ (MIME): ${isMimeTypeSupported}`);

    // ตรวจสอบนามสกุลไฟล์
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    const isExtensionSupported = fileExtension && allowedTypes.some(type => {
      // ตรวจสอบว่า type เป็น MIME type หรือนามสกุลไฟล์
      if (type.includes('/')) {
        // เป็น MIME type
        return false;
      } else {
        // เป็นนามสกุลไฟล์
        return type.toLowerCase() === fileExtension;
      }
    });
    console.log(`นามสกุลไฟล์: ${fileExtension}, รองรับหรือไม่: ${isExtensionSupported}`);

    if (isMimeTypeSupported || isExtensionSupported) {
      console.log(`✅ ไฟล์ ${file.originalname} ผ่านการตรวจสอบ`);
      cb(null, true);
    } else {
      console.log(`❌ ไฟล์ ${file.originalname} ไม่ผ่านการตรวจสอบ`);
      const error = new Error(`รูปแบบไฟล์ไม่ได้รับอนุญาต ไฟล์ที่อัปโหลด: ${file.originalname} (ประเภท: ${file.mimetype}) ประเภทไฟล์ที่รองรับ: ${allowedTypes.join(', ')}`);
      error.http_code = 400;
      cb(error, false);
    }
  };
};

// Storage configurations for different file types (สร้างเมื่อต้องการใช้งาน)
const getEquipmentImageStorage = () => createCloudinaryStorage('e-borrow/equipment');
const getUserImageStorage = () => createCloudinaryStorage('e-borrow/user');
const getRepairImageStorage = () => createCloudinaryStorage('e-borrow/repair');
const getHandoverPhotoStorage = () => createCloudinaryStorage('e-borrow/handover_photo');
const getPaySlipStorage = () => createCloudinaryStorage('e-borrow/pay_slip');
const getRoomImageStorage = () => createCloudinaryStorage('e-borrow/roomimg');
const getSignatureStorage = () => createCloudinaryStorage('e-borrow/signature');
const getDocumentStorage = () => createCloudinaryStorage('e-borrow/important_documents', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'zip', 'rar', '7z', 'rtf', 'xml', 'json']);
const getLogoStorage = () => createCloudinaryStorage('e-borrow/logo');

// Multer configurations for different file types
export const uploadEquipmentImage = multer({
  storage: getEquipmentImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');

// Function to create equipment upload with custom item_code
export const createEquipmentUploadWithItemCode = (itemCode) => {
  const customStorage = createCloudinaryStorage('e-borrow/equipment', ['jpg', 'jpeg', 'png', 'gif', 'webp'], itemCode);

  return multer({
    storage: customStorage,
    fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }).single('image');
};

export const uploadUserImage = multer({
  storage: getUserImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('avatar');

export const uploadRepairImages = multer({
  storage: getRepairImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 } // 5MB per file, max 10 files
}).array('images', 10);

export const uploadHandoverPhoto = multer({
  storage: getHandoverPhotoStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('handover_photo');

export const uploadPaySlip = multer({
  storage: getPaySlipStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('pay_slip');

export const uploadRoomImages = multer({
  storage: getRoomImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 } // 5MB per file, max 5 files
}).array('images', 5);

export const uploadSignature = multer({
  storage: getSignatureStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('signature');

// Create a fallback storage for when Cloudinary is not configured
const createFallbackStorage = () => {
  return multer.memoryStorage();
};

// Create local storage for files that Cloudinary doesn't support
const createLocalStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', folder);
      // สร้างโฟลเดอร์ถ้ายังไม่มี
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const name = path.basename(file.originalname, extension);
      cb(null, `${name}-${uniqueSuffix}${extension}`);
    }
  });
};

export const uploadImportantDocuments = multer({
  storage: (() => {
    try {
      // ลองสร้าง Cloudinary storage สำหรับ important documents
      const cloudinaryStorage = createCloudinaryStorage('e-borrow/important_documents', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'zip', 'rar', '7z', 'rtf', 'xml', 'json']);

      // ตรวจสอบว่าเป็น CloudinaryStorage หรือไม่
      if (cloudinaryStorage.constructor.name === 'CloudinaryStorage') {
        console.log('☁️ Using Cloudinary storage for important documents');
        return cloudinaryStorage;
      } else {
        console.log('📁 Using fallback storage for important documents');
        return cloudinaryStorage; // จะเป็น multer.memoryStorage()
      }
    } catch (error) {
      console.warn('⚠️ Error creating Cloudinary storage, using fallback storage:', error.message);
      return multer.memoryStorage();
    }
  })(),
  fileFilter: createFileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/html',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/rtf',
    'application/xml',
    'text/xml',
    'application/json',
    // เพิ่มนามสกุลไฟล์เพื่อรองรับกรณีที่ MIME type ไม่ถูกต้อง
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'zip', 'rar', '7z', 'rtf', 'xml', 'json'
  ]),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 } // 10MB per file, max 5 files
}).array('important_documents', 5);

// Utility functions for Cloudinary operations
export const cloudinaryUtils = {
  // Upload file to Cloudinary (for direct uploads without multer)
  uploadFile: async (filePath, folder = 'e-borrow/general', options = {}) => {
    try {
      const uploadOptions = {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        ...options
      };

      const result = await cloudinary.uploader.upload(filePath, uploadOptions);

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Upload base64 image
  uploadBase64: async (base64Data, folder = 'e-borrow/general', options = {}) => {
    try {
      const uploadOptions = {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        ...options
      };

      const result = await cloudinary.uploader.upload(base64Data, uploadOptions);

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Cloudinary base64 upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete file from Cloudinary
  deleteFile: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: true,
        result: result
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get file info from Cloudinary
  getFileInfo: async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        success: true,
        info: result
      };
    } catch (error) {
      console.error('Cloudinary get info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate signed upload URL
  generateUploadUrl: (folder = 'e-borrow/general') => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      timestamp: timestamp,
      signature: signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: folder
    };
  },

  // Transform image URL
  transformImage: (url, transformations = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    const defaultTransformations = {
      quality: 'auto:good',
      fetch_format: 'auto',
      ...transformations
    };

    return cloudinary.url(url, {
      transformation: [defaultTransformations]
    });
  },

  // Get Cloudinary account info
  getAccountInfo: async () => {
    try {
      const result = await cloudinary.api.ping();
      return {
        success: true,
        info: result
      };
    } catch (error) {
      console.error('Cloudinary account info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create folder structure in Cloudinary
  createFolders: async () => {
    try {
      const folders = [
        'e-borrow',
        'e-borrow/equipment',
        'e-borrow/user',
        'e-borrow/repair',
        'e-borrow/handover_photo',
        'e-borrow/pay_slip',
        'e-borrow/roomimg',
        'e-borrow/signature',
        'e-borrow/important_documents',
        'e-borrow/logo',
        'e-borrow/general'
      ];

      const results = [];

      for (const folder of folders) {
        try {
          // Create a placeholder image to establish the folder
          const placeholderDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          const result = await cloudinary.uploader.upload(placeholderDataUri, {
            folder: folder,
            public_id: '.folder_placeholder',
            overwrite: true,
            resource_type: 'image'
          });

          // Delete the placeholder immediately
          await cloudinary.uploader.destroy(result.public_id);

          results.push({
            folder: folder,
            status: 'created',
            message: 'Folder created successfully'
          });
        } catch (error) {
          results.push({
            folder: folder,
            status: 'error',
            message: error.message
          });
        }
      }

      return {
        success: true,
        results: results
      };
    } catch (error) {
      console.error('Cloudinary create folders error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // List all folders in Cloudinary
  listFolders: async () => {
    try {
      const result = await cloudinary.api.root_folders();
      return {
        success: true,
        folders: result.folders
      };
    } catch (error) {
      console.error('Cloudinary list folders error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Middleware to handle Cloudinary upload errors
export const handleCloudinaryUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
          error: err.message
        });
      } else if (err) {
        console.error('Upload error:', err);
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          http_code: err.http_code,
          storageErrors: err.storageErrors || []
        });

        // ตรวจสอบว่าเป็น error จาก Cloudinary หรือไม่
        if (err.message && err.message.includes('An unknown file format not allowed')) {
          return res.status(400).json({
            success: false,
            message: 'รูปแบบไฟล์ไม่รองรับโดย Cloudinary กรุณาลองใช้ไฟล์ประเภทอื่น เช่น PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG',
            error: err.message,
            suggestion: 'Cloudinary รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, ZIP, RAR, RTF, XML, JSON'
          });
        }

        // ตรวจสอบ error อื่นๆ จาก Cloudinary
        if (err.message && (err.message.includes('Cloudinary') || err.message.includes('cloudinary'))) {
          return res.status(400).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ไปยัง Cloudinary',
            error: err.message,
            suggestion: 'กรุณาตรวจสอบการตั้งค่า Cloudinary หรือลองอัปโหลดไฟล์ใหม่'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในระบบ',
          error: err.message
        });
      }
      next();
    });
  };
};

export default cloudinary;