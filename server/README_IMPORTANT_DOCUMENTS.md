# Important Documents Feature for Borrowing System

## Overview
This feature allows users to attach important documents (`เอกสารสำคัญขอยืมครุภัณฑ์`) when creating borrowing requests. The documents are stored in the `server/uploads/important_documents/` folder with a specific naming pattern.

## Backend Implementation

### 1. Database Schema
- **Table**: `borrow_transactions`
- **New Column**: `important_documents` (TEXT)
- **Location**: `server/database/add_important_documents_column.sql`
- **Purpose**: Stores JSON array of document metadata

### 2. File Storage Configuration
- **Location**: `server/utils/imageUtils.js`
- **Storage Path**: `server/uploads/important_documents/`
- **Naming Pattern**: `borrow_code-xxxxx.ext`
  - Example: `BR-1234-1234567890-123456789.pdf`
- **File Size Limit**: 10MB per file
- **Max Files**: 5 files per borrow request
- **File Types**: All file types supported

### 3. API Endpoints

#### POST `/api/borrows`
- **Purpose**: Create a new borrow request with important documents
- **File Field**: `important_documents` (array of files)
- **Middleware**: `uploadImportantDocuments.array('important_documents', 5)`
- **Response**: Returns `borrow_id` and `borrow_code`

#### GET `/api/borrows/:id`
- **Purpose**: Get borrow details including important documents
- **Response**: Borrow object with `important_documents` array

### 4. Model Functions (`server/models/borrowModel.js`)
- `createBorrowTransaction()`: Enhanced to accept `important_documents` parameter
- `getAllBorrows()`: Enhanced to include `important_documents` field
- `getBorrowById()`: Enhanced to include `important_documents` field

### 5. Controller Functions (`server/controllers/borrowController.js`)
- `createBorrow`: Enhanced to handle file uploads and store document metadata

## File Structure
```
server/
├── uploads/
│   └── important_documents/          # Document storage
├── database/
│   └── add_important_documents_column.sql   # Database schema
├── utils/
│   └── imageUtils.js                 # Multer configuration
├── models/
│   └── borrowModel.js                # Database operations
├── controllers/
│   └── borrowController.js           # API logic
└── routes/
    └── borrowRoutes.js               # Route definitions
```

## Usage Example

### Frontend Form Data
```javascript
const formData = new FormData();
formData.append('user_id', '123');
formData.append('borrow_date', '2024-01-15');
formData.append('return_date', '2024-01-20');
formData.append('purpose', 'Project work');
formData.append('items', JSON.stringify([
  { item_id: 1, quantity: 2, note: 'For testing' }
]));

// Add important documents
files.forEach(file => {
  formData.append('important_documents', file);
});
```

### API Response Example
```json
{
  "borrow_id": 456,
  "borrow_code": "BR-1234",
  "important_documents": [
    {
      "filename": "BR-1234-1234567890-123456789.pdf",
      "original_name": "contract.pdf",
      "file_path": "uploads/important_documents/BR-1234-1234567890-123456789.pdf",
      "file_size": 1024000,
      "mime_type": "application/pdf"
    }
  ]
}
```

## Setup Instructions

1. **Create Database Column**:
   ```bash
   mysql -u root -p < server/database/add_important_documents_column.sql
   ```

2. **Create Upload Directory**:
   ```bash
   mkdir -p server/uploads/important_documents
   ```

3. **Restart Server**: The new routes and middleware will be automatically loaded.

## Implementation Details

### File Naming Convention
- Format: `{borrow_code}-{timestamp}-{random}.{extension}`
- Example: `BR-1234-1703123456789-987654321.pdf`
- Ensures unique filenames and easy identification

### Database Storage
- Documents metadata stored as JSON in `important_documents` column
- Each document includes: filename, original_name, file_path, file_size, mime_type
- JSON structure allows for easy parsing and manipulation

### File Access
- Files are accessible via: `http://localhost:5000/uploads/important_documents/{filename}`
- Static file serving already configured in Express

## Notes
- Files are automatically organized by borrow code
- All file types are accepted as requested
- File size limit is 10MB per file
- Maximum 5 files per borrow request
- Files are stored with unique timestamps to prevent conflicts
- Database stores metadata as JSON for easy retrieval and manipulation