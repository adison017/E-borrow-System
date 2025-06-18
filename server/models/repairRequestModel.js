import connection from '../db.js';

export const getAllRepairRequests = async () => {
  try {
    const [rows] = await connection.query(`SELECT
  rr.id AS repair_id,
  requester.Fullname AS requester_name,
  requester.avatar,
  b.branch_name,
  r.role_name,
  e.name AS equipment_name,
  e.item_code AS equipment_code,
  e.category AS equipment_category,
  e.item_id,
  rr.problem_description,
  rr.request_date,
  rr.estimated_cost,
  rr.pic_filename AS repair_pic,
  rr.status,
  rr.repair_code,
  e.pic AS equipment_pic,             -- รูปภาพครุภัณฑ์ (URL หรือ path)
  e.pic_filename AS equipment_pic_filename -- ชื่อไฟล์รูป (ถ้ามี)
FROM repair_requests rr
JOIN users requester ON rr.user_id = requester.user_id
LEFT JOIN branches b ON requester.branch_id = b.branch_id
LEFT JOIN roles r ON requester.role_id = r.role_id
JOIN equipment e ON rr.item_id = e.item_id where rr.status = "รอการอนุมัติซ่อม";
`);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getRepairRequestById = async (id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM repair_requests WHERE id = ?', [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getRepairRequestsByUserId = async (user_id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM repair_requests WHERE user_id = ?', [user_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getRepairRequestsByItemId = async (item_id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM repair_requests WHERE item_id = ?', [item_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const addRepairRequest = async (repairRequest) => {
  try {
    const {
      repair_code,
      user_id,
      item_id,
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename
    } = repairRequest;

    const [result] = await connection.query(
      `INSERT INTO repair_requests
      (repair_code, user_id, item_id, problem_description, request_date, estimated_cost, status, pic_filename)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [repair_code, user_id, item_id, problem_description, request_date, estimated_cost, status, pic_filename]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateRepairRequest = async (id, repairRequest) => {
  try {
    const {
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note,
      budget,
      responsible_person,
      approval_date
    } = repairRequest;

    const [result] = await connection.query(
      `UPDATE repair_requests
      SET problem_description = ?,
          request_date = ?,
          estimated_cost = ?,
          status = ?,
          pic_filename = ?,
          note = ?,
          budget = ?,
          responsible_person = ?,
          approval_date = ?
      WHERE id = ?`,
      [problem_description, request_date, estimated_cost, status, pic_filename, note, budget, responsible_person, approval_date, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteRepairRequest = async (id) => {
  try {
    const [result] = await connection.query('DELETE FROM repair_requests WHERE id = ?', [id]);
    return result;
  } catch (error) {
    throw error;
  }
};