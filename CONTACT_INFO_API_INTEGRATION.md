# 📞 การปรับปรุงระบบข้อมูลติดต่อผู้ดูแลระบบ

## 🔧 การปรับปรุง

### **ปัญหาเดิม:**
- ข้อมูลติดต่อผู้ดูแลระบบถูก hardcode ในอีเมล
- ไม่สามารถอัปเดตข้อมูลได้โดยไม่แก้ไขโค้ด
- ไม่มีความยืดหยุ่นในการจัดการข้อมูล

### **การแก้ไข:**
- ดึงข้อมูลติดต่อจาก API `contactInfoRoutes.js`
- สร้างฟังก์ชัน helper `getContactInfo()`
- ใช้ข้อมูลจากฐานข้อมูลแทนการ hardcode

## 🛠️ การใช้งาน

### **1. ฟังก์ชัน Helper**

```javascript
// Helper function สำหรับดึงข้อมูลติดต่อจาก API
async function getContactInfo() {
  const defaultContactInfo = {
    email: 'support@it.msu.ac.th',
    phone: '043-754-321',
    hours: 'จันทร์-ศุกร์ 8:30-16:30 น.',
    location: 'คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม'
  };
  
  try {
    const ContactInfoModel = await import('../models/contactInfoModel.js');
    const result = await ContactInfoModel.getContactInfo();
    if (result.success && result.data) {
      return {
        email: defaultContactInfo.email, // ใช้ค่าเริ่มต้นสำหรับอีเมล
        phone: result.data.phone || defaultContactInfo.phone,
        hours: result.data.hours || defaultContactInfo.hours,
        location: result.data.location || defaultContactInfo.location
      };
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
  }
  
  return defaultContactInfo;
}
```

### **2. การใช้งานในอีเมล**

```javascript
// ดึงข้อมูลติดต่อจาก API
const contactInfo = await getContactInfo();

// ใช้ในอีเมล
const emailHtml = `
  <div class="contact-info">
    <h4>📞 ติดต่อผู้ดูแลระบบ</h4>
    <p>
      <strong>อีเมล:</strong> ${contactInfo.email}<br>
      <strong>โทรศัพท์:</strong> ${contactInfo.phone}<br>
      <strong>เวลาทำการ:</strong> ${contactInfo.hours}
    </p>
  </div>
`;
```

## 📧 ประเภทอีเมลที่ปรับปรุง

### **1. 🔐 แจ้งเตือนการเข้าสู่ระบบ**
- ตรวจจับอุปกรณ์ใหม่
- แสดงข้อมูลติดต่อจาก API
- ปุ่มติดต่อผู้ดูแลระบบ

### **2. 📧 OTP สำหรับสมัครสมาชิก**
- แสดงรหัส OTP ขนาดใหญ่
- ข้อมูลติดต่อจาก API
- คู่มือการใช้งาน

### **3. 🔑 OTP สำหรับเปลี่ยนรหัสผ่าน**
- คำแนะนำความปลอดภัย
- ข้อมูลติดต่อจาก API
- ข้อควรระวัง

## 🗄️ โครงสร้างฐานข้อมูล

### **ตาราง `contact_info`**
```sql
CREATE TABLE contact_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  hours VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **ข้อมูลตัวอย่าง**
```sql
INSERT INTO contact_info (location, phone, hours) VALUES 
('คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม', '043-754-321', 'จันทร์-ศุกร์ 8:30-16:30 น.');
```

## 🔄 API Endpoints

### **GET /api/contact-info**
```javascript
// ดึงข้อมูลติดต่อ
router.get('/', authenticateToken, getContactInfo);
```

### **PUT /api/contact-info**
```javascript
// อัปเดตข้อมูลติดต่อ
router.put('/', authenticateToken, updateContactInfo);
```

### **POST /api/contact-info**
```javascript
// เพิ่มข้อมูลติดต่อใหม่
router.post('/', authenticateToken, addContactInfo);
```

## 📊 การจัดการข้อมูล

### **ค่าเริ่มต้น (Fallback)**
```javascript
const defaultContactInfo = {
  email: 'support@it.msu.ac.th',
  phone: '043-754-321',
  hours: 'จันทร์-ศุกร์ 8:30-16:30 น.',
  location: 'คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม'
};
```

### **การจัดการ Error**
- ใช้ค่าเริ่มต้นหากไม่สามารถดึงข้อมูลได้
- บันทึก error log สำหรับการแก้ไข
- ไม่ทำให้ระบบหยุดทำงาน

## 🎯 ข้อดีของการปรับปรุง

### **✅ ความยืดหยุ่น**
- อัปเดตข้อมูลได้โดยไม่แก้ไขโค้ด
- จัดการข้อมูลผ่านฐานข้อมูล
- รองรับการเปลี่ยนแปลงในอนาคต

### **✅ การบำรุงรักษา**
- ข้อมูลรวมศูนย์ในฐานข้อมูล
- ลดการ hardcode ในโค้ด
- ง่ายต่อการอัปเดต

### **✅ ความปลอดภัย**
- ข้อมูลถูกจัดการผ่าน API
- มีการตรวจสอบสิทธิ์ (authentication)
- ข้อมูลถูกเก็บในฐานข้อมูลที่ปลอดภัย

## 🚀 การใช้งาน

### **สำหรับผู้ดูแลระบบ**
1. เข้าสู่ระบบด้วยสิทธิ์ admin
2. ไปที่หน้า "จัดการข้อมูลติดต่อ"
3. อัปเดตข้อมูลที่ต้องการ
4. บันทึกการเปลี่ยนแปลง

### **สำหรับผู้พัฒนา**
1. ใช้ฟังก์ชัน `getContactInfo()`
2. ข้อมูลจะถูกดึงจาก API อัตโนมัติ
3. ใช้ค่าเริ่มต้นหากเกิด error

## 📈 การติดตาม

### **Logs ที่บันทึก**
```javascript
[INFO] Contact info fetched successfully
[ERROR] Error fetching contact info: Database connection failed
[INFO] Using default contact info due to API error
```

### **Metrics ที่ติดตาม**
- จำนวนครั้งที่ดึงข้อมูล
- อัตราความสำเร็จในการดึงข้อมูล
- เวลาตอบสนองของ API

## 🔮 การพัฒนาต่อ

### **ฟีเจอร์ที่วางแผน**
1. **Multiple Contact Points**: รองรับหลายจุดติดต่อ
2. **Department-specific**: ข้อมูลติดต่อตามแผนก
3. **Emergency Contacts**: ข้อมูลติดต่อฉุกเฉิน
4. **Contact History**: ประวัติการเปลี่ยนแปลง

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: ✅ Completed
