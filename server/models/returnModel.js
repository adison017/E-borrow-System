import db from '../db.js';

export const getAllReturns = async () => {
  const [rows] = await db.query(
    `SELECT
  bt.borrow_id,
  bt.borrow_code,
  u.fullname,
  b.branch_name,
  p.position_name,
  r.role_name,
  u.avatar,
  e.name,
  e.item_id,
  e.item_code,
  e.pic,
  e.price,
  bi.quantity,
  bt.borrow_date,
  bt.user_id,
  bt.return_date,
  bt.status,
  bt.purpose,
  bt.user_id,
  ret.pay_status
FROM borrow_transactions bt
JOIN users u ON bt.user_id = u.user_id
JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
JOIN equipment e ON bi.item_id = e.item_id
LEFT JOIN branches b ON u.branch_id = b.branch_id
LEFT JOIN positions p ON u.position_id = p.position_id
LEFT JOIN roles r ON u.role_id = r.role_id
LEFT JOIN (
  SELECT * FROM returns
) ret ON bt.borrow_id = ret.borrow_id
    WHERE bt.status = 'approved' OR bt.status = 'waiting_payment';`
  );

  // Group by return_id
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.borrow_id]) {
      grouped[row.borrow_id] = {
        borrow_id: row.borrow_id,
        borrow_code: row.borrow_code,
        borrower: {
          name: row.fullname,
          position: row.position_name,
          department: row.branch_name,
          avatar: row.avatar,
          role: row.role_name,
        },
        equipment: [],
        borrow_date: row.borrow_date,
        due_date: row.return_date,
        status: row.status,
        purpose: row.purpose,
        user_id: row.user_id,
        borrower_name: row.borrower_name,
        pay_status: row.pay_status || 'pending',
      };
    }
    grouped[row.borrow_id].equipment.push({
      item_id: row.item_id,
      item_code: row.item_code,
      name: row.name,
      quantity: row.quantity,
      pic:row.pic,
      price:row.price,
    });
  });
  return Object.values(grouped);
};


export const createReturn = async (borrow_id, return_date, return_by, condition_level_id, condition_text, fine_amount, proof_image, status, notes, pay_status = 'pending', payment_method = null) => {
  const [result] = await db.query(
    `INSERT INTO returns (
      borrow_id, return_date, return_by, condition_level_id, condition_text, fine_amount, proof_image, status, notes, pay_status, payment_method, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [borrow_id, return_date, return_by, condition_level_id, condition_text, fine_amount, proof_image, status, notes, pay_status, payment_method]
  );
  return result.insertId;
};

export const updatePayStatus = async (return_id, pay_status) => {
  // 1. อัปเดต pay_status ใน returns
  const [result] = await db.query(
    'UPDATE returns SET pay_status = ?, updated_at = CURRENT_TIMESTAMP WHERE return_id = ?',
    [pay_status, return_id]
  );
  // 2. ถ้า pay_status = 'paid' ให้อัปเดต borrow_transactions.status = 'completed'
  if (pay_status === 'paid') {
    // หา borrow_id จาก return
    const [rows] = await db.query('SELECT borrow_id FROM returns WHERE return_id = ?', [return_id]);
    if (rows && rows.length > 0) {
      const borrow_id = rows[0].borrow_id;
      await db.query('UPDATE borrow_transactions SET status = ? WHERE borrow_id = ?', ['completed', borrow_id]);
    }
  }
  return result.affectedRows;
};

export const getReturnById = async (return_id) => {
  const [rows] = await db.query('SELECT * FROM returns WHERE return_id = ?', [return_id]);
  return rows && rows.length > 0 ? rows[0] : null;
};

export const getReturnsByBorrowId = async (borrow_id) => {
  return await db.query('SELECT * FROM returns WHERE borrow_id = ?', [borrow_id]);
};