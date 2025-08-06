# Room API Documentation

## ตาราง room

```sql
CREATE TABLE room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    room_code VARCHAR(20) UNIQUE,
    address TEXT,
    detail TEXT,
    image_url VARCHAR(255),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. ดึงข้อมูลห้องทั้งหมด
- **URL:** `GET /api/rooms`
- **Description:** ดึงข้อมูลห้องทั้งหมด
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "room_id": 1,
    "room_name": "ห้องประชุมใหญ่",
    "room_code": "RM-001",
    "address": "ชั้น 1 อาคารหลัก",
    "detail": "ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป",
    "image_url": null,
    "note": "รองรับผู้เข้าร่วมได้ 50 คน",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. ค้นหาห้อง
- **URL:** `GET /api/rooms/search?search=<search_term>`
- **Description:** ค้นหาห้องตามชื่อห้อง รหัสห้อง หรือที่อยู่
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  - `search` (required): คำค้นหา
- **Response:** รายการห้องที่ตรงกับคำค้นหา

### 3. ดึงข้อมูลห้องตามรหัสห้อง
- **URL:** `GET /api/rooms/code/:code`
- **Description:** ดึงข้อมูลห้องตามรหัสห้อง
- **Headers:**
  - `Authorization: Bearer <token>`
- **Parameters:**
  - `code` (required): รหัสห้อง
- **Response:** ข้อมูลห้อง

### 4. ดึงข้อมูลห้องตาม ID
- **URL:** `GET /api/rooms/:id`
- **Description:** ดึงข้อมูลห้องตาม ID
- **Headers:**
  - `Authorization: Bearer <token>`
- **Parameters:**
  - `id` (required): ID ห้อง
- **Response:** ข้อมูลห้อง

### 5. สร้างห้องใหม่
- **URL:** `POST /api/rooms`
- **Description:** สร้างห้องใหม่
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "room_name": "ห้องประชุมใหญ่",
  "room_code": "RM-001",
  "address": "ชั้น 1 อาคารหลัก",
  "detail": "ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป",
  "image_url": "https://example.com/image.jpg",
  "note": "รองรับผู้เข้าร่วมได้ 50 คน"
}
```
- **Response:**
```json
{
  "message": "สร้างห้องเรียบร้อยแล้ว",
  "room": {
    "room_id": 1,
    "room_name": "ห้องประชุมใหญ่",
    "room_code": "RM-001",
    "address": "ชั้น 1 อาคารหลัก",
    "detail": "ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป",
    "image_url": "https://example.com/image.jpg",
    "note": "รองรับผู้เข้าร่วมได้ 50 คน",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. อัปเดตข้อมูลห้อง
- **URL:** `PUT /api/rooms/:id`
- **Description:** อัปเดตข้อมูลห้อง
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Parameters:**
  - `id` (required): ID ห้อง
- **Body:** เหมือนกับ POST แต่ไม่จำเป็นต้องมีทุก field
- **Response:**
```json
{
  "message": "อัปเดตข้อมูลห้องเรียบร้อยแล้ว",
  "room": {
    "room_id": 1,
    "room_name": "ห้องประชุมใหญ่ (อัปเดต)",
    "room_code": "RM-001",
    "address": "ชั้น 1 อาคารหลัก",
    "detail": "ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป",
    "image_url": "https://example.com/image.jpg",
    "note": "รองรับผู้เข้าร่วมได้ 50 คน",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. ลบห้อง
- **URL:** `DELETE /api/rooms/:id`
- **Description:** ลบห้อง
- **Headers:**
  - `Authorization: Bearer <token>`
- **Parameters:**
  - `id` (required): ID ห้อง
- **Response:**
```json
{
  "message": "ลบห้องเรียบร้อยแล้ว"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "กรุณากรอกชื่อห้อง"
}
```

### 404 Not Found
```json
{
  "message": "ไม่พบข้อมูลห้อง"
}
```

### 500 Internal Server Error
```json
{
  "message": "เกิดข้อผิดพลาดในการดึงข้อมูลห้อง"
}
```

## การใช้งาน

1. **สร้างตาราง:** รันไฟล์ `create_room_table.sql` เพื่อสร้างตารางและข้อมูลตัวอย่าง
2. **Authentication:** ต้องใช้ token ของ admin ในการเข้าถึง API
3. **Validation:** ระบบจะตรวจสอบข้อมูลที่จำเป็นและความถูกต้องของข้อมูล
4. **Error Handling:** ระบบจะส่งข้อความแจ้งเตือนที่เหมาะสมเมื่อเกิดข้อผิดพลาด

## หมายเหตุ

- รหัสห้อง (`room_code`) จะถูกสร้างอัตโนมัติถ้าไม่ได้ระบุ
- รหัสห้องต้องไม่ซ้ำกัน
- วันที่สร้างและอัปเดตจะถูกจัดการอัตโนมัติ
- ระบบรองรับการค้นหาห้องตามชื่อ รหัส หรือที่อยู่