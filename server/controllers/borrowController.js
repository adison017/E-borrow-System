import * as BorrowModel from '../models/borrowModel.js';
import { saveBase64Image } from '../utils/saveBase64Image.js';
import User from '../models/userModel.js';
import { sendLineNotify } from '../utils/lineNotify.js';

// สร้างรายการยืมใหม่
export const createBorrow = async (req, res) => {
  console.log('==== [API] POST /api/borrows ====');
  console.log('payload:', req.body);
  const { user_id, reason, borrow_date, return_date, items, purpose } = req.body;
  // items = [{ item_id, quantity, note }]
  if (!user_id || !borrow_date || !return_date || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }
  // ตรวจสอบ item_id ใน items ว่าต้องไม่เป็น null หรือ undefined
  const invalidItem = items.find(item => !item.item_id);
  if (invalidItem) {
    return res.status(400).json({ message: 'item_id ของอุปกรณ์ต้องไม่เป็น null หรือว่าง' });
  }
  // สุ่ม borrow_code
  function generateBorrowCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BR-${random}`;
  }
  const borrow_code = generateBorrowCode();
  // ลบ logic ตรวจสอบรหัสซ้ำ (findByBorrowCode)
  try {
    const borrow_id = await BorrowModel.createBorrowTransaction(user_id, reason, borrow_date, return_date, borrow_code, purpose);
    for (const item of items) {
      await BorrowModel.addBorrowItem(borrow_id, item.item_id, item.quantity || 1, item.note || null);
    }
    // แจ้งเตือน LINE ไปยัง admin ทุกคน
    try {
      // ดึงข้อมูล borrow ล่าสุด (ที่เพิ่งสร้าง)
      const borrow = await BorrowModel.getBorrowById(borrow_id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      const flexMessage = {
        type: 'flex',
        altText: '📢 ด่วน! มีคำขอยืมใหม่เข้ามาในระบบ',
        contents: {
          type: 'bubble',
          size: 'mega',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '🚨 ด่วน! คำขอยืมใหม่',
                weight: 'bold',
                size: 'xl',
                color: '#ffffff',
                align: 'center',
                margin: 'md',
              }
            ],
            backgroundColor: '#00B900', // LINE green
            paddingAll: '20px',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            backgroundColor: '#ffffff',
            borderColor: '#e0e0e0',
            borderWidth: '2px',
            cornerRadius: 'lg',
            contents: [
              {
                type: 'text',
                text: 'โปรดตรวจสอบคำขอยืมอุปกรณ์ใหม่',
                weight: 'bold',
                size: 'md',
                color: '#00B900',
                align: 'center',
                margin: 'md',
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ชื่อผู้ยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrower?.name || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ตำแหน่ง', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.position || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'สาขา', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.department || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'text',
                text: '📋 รายการอุปกรณ์',
                size: 'sm',
                color: '#00B900',
                weight: 'bold',
                margin: 'md',
              },
              {
                type: 'text',
                text: equipmentList,
                size: 'sm',
                color: '#222222',
                wrap: true
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                ]
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#00B900',
                action: {
                  type: 'uri',
                  label: 'ดูรายละเอียด',
                  uri: 'https://your-system-url/borrows/' + borrow.borrow_code // เปลี่ยน url ตามจริง
                }
              }
            ]
          }
        }
      };
      // ส่ง LINE Notify ไปยัง admin ทุกคน
      const admins = await User.getAdmins();
      for (const admin of admins) {
        if (admin.line_id) {
          await sendLineNotify(admin.line_id, flexMessage);
        }
      }
    } catch (notifyErr) {
      console.error('Error sending LINE notify to admin:', notifyErr);
    }
    res.status(201).json({ borrow_id, borrow_code });
  } catch (err) {
    console.error('เกิดข้อผิดพลาดใน createBorrow:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ดูรายการยืมทั้งหมด
export const getAllBorrows = async (req, res) => {
  try {
    const rows = await BorrowModel.getAllBorrows();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ดูรายละเอียดการยืม (รวมรายการอุปกรณ์)
export const getBorrowById = async (req, res) => {
  const { id } = req.params;
  try {
    const borrow = await BorrowModel.getBorrowById(id);
    if (!borrow) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(borrow);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// อัปเดตสถานะ
export const updateBorrowStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejection_reason, signature_image } = req.body;
  try {
    let signaturePath = null;
    if (signature_image) {
      if (typeof signature_image === 'string' && signature_image.startsWith('data:image/')) {
        signaturePath = await saveBase64Image(signature_image);
      } else {
        signaturePath = signature_image; // already a path
      }
    }
    const affectedRows = await BorrowModel.updateBorrowStatus(id, status, rejection_reason, signaturePath);

    // === เพิ่มส่วนนี้: แจ้ง user เมื่อสถานะเป็น pending_approval ===
    if (status === 'pending_approval') {
      const borrow = await BorrowModel.getBorrowById(id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      // ส่งให้ executive (เดิม)
      const flexMessageExecutive = {
        type: 'flex',
        altText: '📢 แจ้งเตือนผู้บริหาร: มีคำขออนุมัติการยืมใหม่',
        contents: {
          type: 'bubble',
          size: 'mega',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '📝 คำขออนุมัติการยืม',
                weight: 'bold',
                size: 'xl',
                color: '#ffffff',
                align: 'center',
                margin: 'md',
              }
            ],
            backgroundColor: '#1976D2',
            paddingAll: '20px',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            backgroundColor: '#ffffff',
            borderColor: '#e0e0e0',
            borderWidth: '2px',
            cornerRadius: 'lg',
            contents: [
              {
                type: 'text',
                text: 'มีคำขออนุมัติการยืมอุปกรณ์ใหม่ โปรดตรวจสอบ',
                weight: 'bold',
                size: 'md',
                color: '#1976D2',
                align: 'center',
                margin: 'md',
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ชื่อผู้ยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrower?.name || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ตำแหน่ง', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.position || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'สาขา', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.department || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'text',
                text: '📋 รายการอุปกรณ์',
                size: 'sm',
                color: '#1976D2',
                weight: 'bold',
                margin: 'md',
              },
              {
                type: 'text',
                text: equipmentList,
                size: 'sm',
                color: '#222222',
                wrap: true
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                ]
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#1976D2',
                action: {
                  type: 'uri',
                  label: 'ดูรายละเอียด',
                  uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                }
              }
            ]
          }
        }
      };
      // ส่งให้ executive
      const executives = await User.getExecutives();
      for (const executive of executives) {
        if (executive.line_id) {
          await sendLineNotify(executive.line_id, flexMessageExecutive);
        }
      }
      // ส่งให้ user (ผู้ยืม)
      // ดึง line_id จาก user_id โดยตรง
      const user = await User.findById(borrow.user_id);
      if (user?.line_id) {
        const flexMessageUser = {
          type: 'flex',
          altText: '📢 แจ้งสถานะคำขอยืมของคุณ',
          contents: {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '📦 สถานะคำขอยืมของคุณ',
                  weight: 'bold',
                  size: 'xl',
                  color: '#ffffff',
                  align: 'center',
                  margin: 'md',
                }
              ],
              backgroundColor: '#009688',
              paddingAll: '20px',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              borderWidth: '2px',
              cornerRadius: 'lg',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะ:รออนุมัติจากผู้บริหาร',
                  weight: 'bold',
                  size: 'md',
                  color: '#009688',
                  align: 'center',
                  margin: 'md',
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'รายการอุปกรณ์ที่ขอยืม:',
                  size: 'sm',
                  color: '#009688',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: equipmentList,
                  size: 'sm',
                  color: '#222222',
                  wrap: true
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#009688',
                  action: {
                    type: 'uri',
                    label: 'ดูรายละเอียด',
                    uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                  }
                }
              ]
            }
          }
        };
        console.log('[DEBUG] เตรียมส่ง LINE Notify ถึง user:', user.user_id, user.line_id);
        console.log('[DEBUG] flexMessageUser:', JSON.stringify(flexMessageUser));
        try {
          await sendLineNotify(user.line_id, flexMessageUser);
          console.log('[DEBUG] ส่ง LINE Notify ถึง user สำเร็จ');
        } catch (err) {
          console.error('[DEBUG] ส่ง LINE Notify ถึง user ไม่สำเร็จ:', err);
        }
      }
    }
    // === แจ้ง user เมื่อสถานะเป็น carry (อนุมัติแล้ว) ===
    if (status === 'carry') {
      const borrow = await BorrowModel.getBorrowById(id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      const user = await User.findById(borrow.user_id);
      if (user?.line_id) {
        // รวม location ของอุปกรณ์ทุกชิ้น (ไม่ซ้ำ)
        const locations = Array.from(new Set(borrow.equipment.map(eq => eq.location).filter(Boolean)));
        const locationText = locations.length > 0 ? locations.join(', ') : 'ห้องพัสดุ อาคาร 1 ชั้น 2';
        const flexMessageUser = {
          type: 'flex',
          altText: '📢 แจ้งสถานะคำขอยืมของคุณ',
          contents: {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '📦 สถานะคำขอยืมของคุณ',
                  weight: 'bold',
                  size: 'xl',
                  color: '#ffffff',
                  align: 'center',
                  margin: 'md',
                }
              ],
              backgroundColor: '#388e3c',
              paddingAll: '20px',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              borderWidth: '2px',
              cornerRadius: 'lg',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะ: อนุมัติแล้ว ',
                  weight: 'bold',
                  size: 'md',
                  color: '#388e3c',
                  align: 'center',
                  margin: 'md',
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'สถานที่รับครุภัณฑ์: ' + locationText,
                  size: 'sm',
                  color: '#388e3c',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: 'รายการอุปกรณ์ที่ขอยืม:',
                  size: 'sm',
                  color: '#388e3c',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: equipmentList,
                  size: 'sm',
                  color: '#222222',
                  wrap: true
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#388e3c',
                  action: {
                    type: 'uri',
                    label: 'ดูรายละเอียด',
                    uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                  }
                }
              ]
            }
          }
        };
        console.log('[DEBUG] เตรียมส่ง LINE Notify ถึง user (carry):', user.user_id, user.line_id);
        console.log('[DEBUG] flexMessageUser (carry):', JSON.stringify(flexMessageUser));
        try {
          await sendLineNotify(user.line_id, flexMessageUser);
          console.log('[DEBUG] ส่ง LINE Notify ถึง user (carry) สำเร็จ');
        } catch (err) {
          console.error('[DEBUG] ส่ง LINE Notify ถึง user (carry) ไม่สำเร็จ:', err);
        }
      }
    }
    // === แจ้ง user เมื่อสถานะเป็น rejected (ไม่อนุมัติ) ===
    if (status === 'rejected') {
      const borrow = await BorrowModel.getBorrowById(id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      const user = await User.findById(borrow.user_id);
      if (user?.line_id) {
        const flexMessageUser = {
          type: 'flex',
          altText: '📢 แจ้งสถานะคำขอยืมของคุณ',
          contents: {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '❌ ไม่อนุมัติการยืม',
                  weight: 'bold',
                  size: 'xl',
                  color: '#ffffff',
                  align: 'center',
                  margin: 'md',
                }
              ],
              backgroundColor: '#d32f2f',
              paddingAll: '20px',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              borderWidth: '2px',
              cornerRadius: 'lg',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะ: ไม่อนุมัติการยืม',
                  weight: 'bold',
                  size: 'md',
                  color: '#d32f2f',
                  align: 'center',
                  margin: 'md',
                },
                ...(borrow.rejection_reason ? [{
                  type: 'text',
                  text: 'เหตุผล: ' + borrow.rejection_reason,
                  size: 'sm',
                  color: '#d32f2f',
                  margin: 'md',
                  wrap: true
                }] : []),
                {
                  type: 'text',
                  text: 'กรุณาทำรายการใหม่',
                  size: 'sm',
                  color: '#d32f2f',
                  weight: 'bold',
                  align: 'center',
                  margin: 'md',
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'รายการอุปกรณ์ที่ขอยืม:',
                  size: 'sm',
                  color: '#d32f2f',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: equipmentList,
                  size: 'sm',
                  color: '#222222',
                  wrap: true
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#d32f2f',
                  action: {
                    type: 'uri',
                    label: 'ดูรายละเอียด',
                    uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                  }
                }
              ]
            }
          }
        };
        // const user = await User.findById(borrow.user_id); // ลบออก
        // if (user?.line_id) { // ลบออก
        //   await sendLineNotify(user.line_id, flexMessageUser); // ลบออก
        // }
      }
    }
    // ลบส่วนแจ้งเตือน LINE สำหรับ waiting_payment และ completed ออก (ย้ายไป handle ที่ returnController.js แล้ว)
    // === ลบส่วนแจ้งเตือน LINE สำหรับ completed (ให้เหลือเฉพาะใน returnController.js) ===

    res.json({ affectedRows, signaturePath });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ลบรายการยืม
export const deleteBorrow = async (req, res) => {
  const { id } = req.params;
  try {
    await BorrowModel.deleteBorrow(id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};