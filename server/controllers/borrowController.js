import * as BorrowModel from '../models/borrowModel.js';

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
  try {
    const borrow_id = await BorrowModel.createBorrowTransaction(user_id, reason, borrow_date, return_date, borrow_code, purpose);
    for (const item of items) {
      await BorrowModel.addBorrowItem(borrow_id, item.item_id, item.quantity || 1, item.note || null);
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
  const { status, rejection_reason } = req.body;
  try {
    const affectedRows = await BorrowModel.updateBorrowStatus(id, status, rejection_reason);
    res.json({ affectedRows });
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