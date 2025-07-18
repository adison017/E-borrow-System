import db from '../db.js';

export const createBorrowTransaction = async (user_id, reason, borrow_date, return_date, borrow_code, purpose) => {
  const [result] = await db.query(
    'INSERT INTO borrow_transactions (user_id, reason, borrow_date, return_date, borrow_code, purpose) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, reason, borrow_date, return_date, borrow_code, purpose]
  );
  return result.insertId;
};

export const addBorrowItem = async (borrow_id, item_id, quantity, note) => {
  await db.query(
    'INSERT INTO borrow_items (borrow_id, item_id, quantity) VALUES (?, ?, ?)',
    [borrow_id, item_id, quantity]
  );
};

export const getAllBorrows = async () => {
  const [rows] = await db.query(
    `SELECT
  bt.borrow_id,
  bt.user_id,
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
  bi.quantity,
  bt.borrow_date,
  bt.return_date,
  bt.status,
  bt.purpose,
  bt.rejection_reason
FROM borrow_transactions bt
JOIN users u ON bt.user_id = u.user_id
JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
JOIN equipment e ON bi.item_id = e.item_id
LEFT JOIN branches b ON u.branch_id = b.branch_id
LEFT JOIN positions p ON u.position_id = p.position_id
LEFT JOIN roles r ON u.role_id = r.role_id;`
  );

  // Group by borrow_id
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.borrow_id]) {
      grouped[row.borrow_id] = {
        borrow_id: row.borrow_id,
        user_id: row.user_id, // เพิ่ม user_id ใน object
        borrow_code: row.borrow_code,
        borrower: {
          name: row.fullname,
          position: row.position_name,
          department: row.branch_name,
          avatar: row.avatar,
          role: row.role_name,
        },
        equipment: [],
        borrow_date: row.borrow_date ? row.borrow_date.toISOString ? row.borrow_date.toISOString().split('T')[0] : String(row.borrow_date).split('T')[0] : null,
        due_date: row.return_date ? row.return_date.toISOString ? row.return_date.toISOString().split('T')[0] : String(row.return_date).split('T')[0] : null,
        status: row.status,
        purpose: row.purpose,
        rejection_reason: row.rejection_reason, 
      };
    }
    grouped[row.borrow_id].equipment.push({
      item_id: row.item_id,
      item_code: row.item_code,
      name: row.name,
      quantity: row.quantity,
      pic:row.pic,
    });
  });
  return Object.values(grouped);
};

export const getBorrowById = async (borrow_id) => {
  // Join users, equipment, branch, ... เหมือน getAllBorrows
  const [rows] = await db.query(
    `SELECT
      bt.borrow_id,
      bt.user_id,
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
      e.location,
      bi.quantity,
      bt.borrow_date,
      bt.return_date,
      bt.status,
      bt.purpose,
      bt.rejection_reason
    FROM borrow_transactions bt
    JOIN users u ON bt.user_id = u.user_id
    JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
    JOIN equipment e ON bi.item_id = e.item_id
    LEFT JOIN branches b ON u.branch_id = b.branch_id
    LEFT JOIN positions p ON u.position_id = p.position_id
    LEFT JOIN roles r ON u.role_id = r.role_id
    WHERE bt.borrow_id = ?`,
    [borrow_id]
  );
  if (!rows || rows.length === 0) return null;
  // Group
  const row = rows[0];
  return {
    borrow_id: row.borrow_id,
    user_id: row.user_id, // เพิ่ม user_id ใน object
    borrow_code: row.borrow_code,
    borrower: {
      name: row.fullname,
      position: row.position_name,
      department: row.branch_name,
      avatar: row.avatar,
      role: row.role_name,
    },
    equipment: rows.map(r => ({
      item_id: r.item_id,
      item_code: r.item_code,
      name: r.name,
      quantity: r.quantity,
      pic: r.pic,
      location: r.location,
    })),
    borrow_date: row.borrow_date ? row.borrow_date.toISOString ? row.borrow_date.toISOString().split('T')[0] : String(row.borrow_date).split('T')[0] : null,
    due_date: row.return_date ? row.return_date.toISOString ? row.return_date.toISOString().split('T')[0] : String(row.return_date).split('T')[0] : null,
    status: row.status,
    purpose: row.purpose,
    rejection_reason: row.rejection_reason
  };
};

export const updateBorrowStatus = async (borrow_id, status, rejection_reason = null, signature_image = null) => {
  let query, params;
  if (signature_image && typeof signature_image === 'string' && signature_image.trim() !== '') {
    query = 'UPDATE borrow_transactions SET status = ?, signature_image = ?, rejection_reason = ? WHERE borrow_id = ?';
    params = [status, signature_image, rejection_reason, borrow_id];
  } else if (rejection_reason !== null && rejection_reason !== undefined) {
    query = 'UPDATE borrow_transactions SET status = ?, rejection_reason = ? WHERE borrow_id = ?';
    params = [status, rejection_reason, borrow_id];
  } else {
    query = 'UPDATE borrow_transactions SET status = ? WHERE borrow_id = ?';
    params = [status, borrow_id];
  }
  const [result] = await db.query(query, params);
  return result.affectedRows;
};

export const deleteBorrow = async (borrow_id) => {
  await db.query('DELETE FROM borrow_transactions WHERE borrow_id = ?', [borrow_id]);
};

export const getBorrowsByStatus = async (statusArray) => {
  const placeholders = statusArray.map(() => '?').join(',');

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
      bi.quantity,
      bt.borrow_date,
      ret.return_date AS actual_return_date,
      bt.status,
      bt.purpose,
      bt.rejection_reason
    FROM borrow_transactions bt
    JOIN users u ON bt.user_id = u.user_id
    JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
    JOIN equipment e ON bi.item_id = e.item_id
    LEFT JOIN branches b ON u.branch_id = b.branch_id
    LEFT JOIN positions p ON u.position_id = p.position_id
    LEFT JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN (
      SELECT r1.*
      FROM returns r1
      INNER JOIN (
        SELECT borrow_id, MAX(return_date) AS max_return_date
        FROM returns
        GROUP BY borrow_id
      ) r2 ON r1.borrow_id = r2.borrow_id AND r1.return_date = r2.max_return_date
    ) ret ON bt.borrow_id = ret.borrow_id
    WHERE bt.status IN (${placeholders})`,
    statusArray
  );

  // Group by borrow_id
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
        borrow_date: row.borrow_date ? row.borrow_date.toISOString ? row.borrow_date.toISOString().split('T')[0] : String(row.borrow_date).split('T')[0] : null,
        return_date: row.actual_return_date, // วันคืนจริงจากตาราง returns
        status: row.status,
        purpose: row.purpose,
        rejection_reason: row.rejection_reason
      };
    }
    grouped[row.borrow_id].equipment.push({
      item_id: row.item_id,
      item_code: row.item_code,
      name: row.name,
      quantity: row.quantity,
      pic: row.pic,
    });
  });

  return Object.values(grouped);
};

export const getActiveBorrows = async () => {
  const [rows] = await db.query(
    `SELECT bt.borrow_id, bt.borrow_code, bt.borrow_date, bt.return_date, u.line_id
     FROM borrow_transactions bt
     JOIN users u ON bt.user_id = u.user_id
     WHERE bt.status = 'approved'`
  );
  return rows;
};
