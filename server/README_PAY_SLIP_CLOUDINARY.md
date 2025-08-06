# Pay Slip Cloudinary Upload Feature

## Overview
This feature allows users to upload payment slip images to Cloudinary cloud storage when confirming payments for fines. The slips are stored with a specific naming pattern that includes the borrowing code.

## Backend Implementation

### 1. Database Schema
- **Table**: `returns`
- **New Column**: `cloudinary_public_id` (VARCHAR(255))
- **Location**: `server/database/add_cloudinary_public_id_to_returns.sql`
- **Purpose**: Stores Cloudinary public ID for uploaded slip images

### 2. File Storage Configuration
- **Primary Storage**: Cloudinary cloud storage
- **Fallback Storage**: Local file system (`server/uploads/pay_slip/`)
- **Cloudinary Folder**: `e-borrow/pay_slip`
- **Naming Pattern**: `{borrow_code}_slip_{original_name}_{timestamp}`
  - Example: `BR-1234_slip_payment_1703123456789-987654321.jpg`
- **File Size Limit**: 5MB per file
- **File Types**: Images only (JPG, JPEG, PNG, GIF, WEBP)

### 3. API Endpoints

#### POST `/api/returns/upload-slip-cloudinary`
- **Purpose**: Upload payment slip to Cloudinary
- **File Field**: `slip` (single image file)
- **Required Fields**: `borrow_code`, `borrow_id`
- **Middleware**: `createPaySlipUploadWithBorrowCode`
- **Response**: Returns file metadata including Cloudinary URL

#### POST `/api/returns/confirm-payment`
- **Purpose**: Confirm payment with uploaded slip
- **Required Fields**: `borrow_id`, `proof_image`, `cloudinary_public_id` (optional)
- **Response**: Success confirmation

### 4. Model Functions (`server/models/returnModel.js`)
- `updateProofImageAndPayStatus()`: Enhanced to accept `cloudinary_public_id` parameter
- Stores both proof_image URL and cloudinary_public_id

### 5. Controller Functions (`server/controllers/returnController.js`)
- `confirmPayment`: Enhanced to handle cloudinary_public_id
- Supports both Cloudinary and local storage URLs

### 6. Cloudinary Integration (`server/utils/cloudinaryUtils.js`)
- `createPaySlipUploadWithBorrowCode`: Creates upload middleware with custom borrow code
- `createCloudinaryStorageWithCustomName`: Cloudinary storage with custom naming
- `createLocalStorageWithCustomName`: Local storage fallback with custom naming

## File Structure
```
server/
├── uploads/
│   └── pay_slip/                    # Local fallback storage
├── database/
│   └── add_cloudinary_public_id_to_returns.sql   # Database schema
├── utils/
│   └── cloudinaryUtils.js           # Cloudinary and multer configuration
├── models/
│   └── returnModel.js               # Database operations
├── controllers/
│   └── returnController.js          # API logic
└── routes/
    └── returnRoutes.js              # Route definitions
```

## Usage Example

### Frontend Form Data
```javascript
const formData = new FormData();
formData.append('borrow_code', 'BR-1234');
formData.append('borrow_id', '123');
formData.append('slip', file); // Image file
```

### API Response Example
```json
{
  "filename": "BR-1234_slip_payment_1703123456789-987654321",
  "original_name": "payment.jpg",
  "file_size": 1024000,
  "mime_type": "image/jpeg",
  "cloudinary_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/e-borrow/pay_slip/BR-1234_slip_payment_1703123456789-987654321.jpg",
  "cloudinary_public_id": "e-borrow/pay_slip/BR-1234_slip_payment_1703123456789-987654321"
}
```

## Setup Instructions

1. **Configure Cloudinary Environment Variables**:
   ```bash
   # Add to your .env file
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **Create Database Column**:
   ```bash
   mysql -u root -p < server/database/add_cloudinary_public_id_to_returns.sql
   ```

3. **Create Upload Directory** (for fallback):
   ```bash
   mkdir -p server/uploads/pay_slip
   ```

4. **Restart Server**: The new routes and middleware will be automatically loaded.

## Implementation Details

### File Naming Convention
- **Format**: `{borrow_code}_slip_{original_name}_{timestamp}`
- **Example**: `BR-1234_slip_payment_1703123456789-987654321.jpg`
- **Benefits**:
  - Easy identification by borrowing code
  - Preserves original filename
  - Unique timestamps prevent conflicts
  - Consistent naming across Cloudinary and local storage

### Storage Strategy
1. **Primary**: Cloudinary cloud storage
   - Automatic optimization and compression
   - Global CDN for fast access
   - Secure URLs with expiration
   - Backup and redundancy

2. **Fallback**: Local file system
   - Used when Cloudinary is not configured
   - Same naming convention for consistency
   - Files stored in `uploads/pay_slip/`

### Database Storage
- `proof_image`: Stores the image URL (Cloudinary or local)
- `cloudinary_public_id`: Stores Cloudinary public ID for future reference
- Both fields are updated when payment is confirmed

### File Access
- **Cloudinary**: Direct access via secure URLs
- **Local**: Accessible via: `http://localhost:5000/uploads/pay_slip/{filename}`
- Static file serving already configured in Express

## Supported File Types
- **Images**: JPG, JPEG, PNG, GIF, WEBP
- **Size Limit**: 5MB per file
- **Single File**: Only one slip image per payment

## Notes
- Files are automatically organized by borrowing code
- Only image files are accepted for security
- File size limit is 5MB per file
- Cloudinary provides automatic optimization and global CDN
- Fallback to local storage ensures system reliability
- Database stores both URL and Cloudinary public ID for flexibility