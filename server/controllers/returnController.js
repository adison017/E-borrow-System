import * as ReturnModel from '../models/returnModel.js';
import * as BorrowModel from '../models/borrowModel.js';
import * as EquipmentModel from '../models/equipmentModel.js';
import * as DamageLevelModel from '../models/damageLevelModel.js';
import { updateProofImageAndPayStatus } from '../models/returnModel.js';

export const getAllReturns = async (req, res) => {
  try {
    const rows = await ReturnModel.getAllReturns();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const createReturn = async (req, res) => {
  // DEBUG LOG
  console.log('==== [API] POST /api/returns ====');
  console.log('createReturn req.body:', req.body);
  const {
    borrow_id,
    return_date,
    return_by,
    user_id, // เพิ่ม user_id
    condition_level_id,
    condition_text,
    fine_amount,
    damage_fine,
    late_fine,
    late_days,
    proof_image,
    status,
    notes,
    pay_status = 'pending',
    paymentMethod = 'cash',
  } = req.body;
  try {
    // 1. บันทึกการคืน
    const return_id = await ReturnModel.createReturn(
      borrow_id,
      return_date,
      return_by,
      user_id, // user_id ต้องอยู่ลำดับที่ 4
      condition_level_id,
      condition_text,
      fine_amount,
      damage_fine,
      late_fine,
      late_days,
      proof_image,
      status,
      notes,
      pay_status,
      paymentMethod
    );

    // 2. อัปเดตสถานะ borrow
    if ((pay_status === 'pending') && (paymentMethod === 'online' || paymentMethod === 'transfer')) {
      console.log(`[RETURN] Set borrow_id=${borrow_id} status=waiting_payment (pay_status=${pay_status}, paymentMethod=${paymentMethod})`);
      await BorrowModel.updateBorrowStatus(borrow_id, 'waiting_payment');
      // ไม่ต้องอัปเดตสถานะอุปกรณ์ที่นี่
    } else {
      console.log(`[RETURN] Set borrow_id=${borrow_id} status=completed (pay_status=${pay_status}, paymentMethod=${paymentMethod})`);
      await BorrowModel.updateBorrowStatus(borrow_id, 'completed');
      // อัปเดตสถานะอุปกรณ์ที่นี่เท่านั้น
      const borrow = await BorrowModel.getBorrowById(borrow_id);
      const equipmentList = borrow && borrow.equipment ? borrow.equipment : [];
      const damageLevels = await DamageLevelModel.getAllDamageLevels();
      const selectedDamage = damageLevels.find(dl => dl.damage_id === Number(condition_level_id) || dl.id === Number(condition_level_id));
      const isMajorDamage = selectedDamage && (selectedDamage.name === 'ชำรุดหนัก' || Number(selectedDamage.fine_percent) >= 70);
      for (const eq of equipmentList) {
        const newStatus = isMajorDamage ? 'ชำรุด' : 'พร้อมใช้งาน';
        await EquipmentModel.updateEquipmentStatus(eq.item_code, newStatus);
      }
    }

    res.status(201).json({ return_id, user_id: return_by });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const getSuccessBorrows = async (req, res) => {
  try {
    const borrows = await BorrowModel.getBorrowsByStatus(['completed', 'rejected']);
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const updatePayStatus = async (req, res) => {
  const { return_id } = req.params;
  try {
    // 1. อัปเดต pay_status ใน returns เป็น 'paid'
    await ReturnModel.updatePayStatus(return_id, 'paid');
    // 2. หา borrow_id จาก return
    const ret = await ReturnModel.getReturnById(return_id);
    if (ret && ret.borrow_id) {
      console.log(`[PAY] Set borrow_id=${ret.borrow_id} status=completed (pay_status=paid)`);
      await BorrowModel.updateBorrowStatus(ret.borrow_id, 'completed');
      // 4. อัปเดตสถานะอุปกรณ์ที่นี่ (เหมือนใน createReturn)
      const borrow = await BorrowModel.getBorrowById(ret.borrow_id);
      const equipmentList = borrow && borrow.equipment ? borrow.equipment : [];
      const damageLevels = await DamageLevelModel.getAllDamageLevels();
      const selectedDamage = damageLevels.find(dl => dl.damage_id === Number(ret.condition_level_id) || dl.id === Number(ret.condition_level_id));
      const isMajorDamage = selectedDamage && (selectedDamage.name === 'ชำรุดหนัก' || Number(selectedDamage.fine_percent) >= 70);
      for (const eq of equipmentList) {
        const newStatus = isMajorDamage ? 'ชำรุด' : 'พร้อมใช้งาน';
        await EquipmentModel.updateEquipmentStatus(eq.item_code, newStatus);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const getReturnsByBorrowId = async (req, res) => {
  const { borrow_id } = req.params;
  try {
    const [rows] = await ReturnModel.getReturnsByBorrowId(borrow_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const getAllReturns_pay = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const rows = await (await import('../models/returnModel.js')).getAllReturns_pay(user_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const uploadSlip = async (req, res) => {
  try {
    console.log('UPLOAD SLIP req.body:', req.body);
    console.log('UPLOAD SLIP req.files:', req.files);
    const file = req.files?.slip?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // ใช้ borrow_code จาก req.body
    // สามารถบันทึกชื่อไฟล์ลงฐานข้อมูลได้ที่นี่ (ถ้ามี borrow_id)
    // const borrow_id = req.body.borrow_id;
    // TODO: update return record with slip filename if needed
    res.json({ success: true, filename: file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { borrow_id, proof_image } = req.body;
    console.log('[confirm-payment] req.body:', req.body);
    if (!borrow_id || !proof_image) {
      console.log('[confirm-payment] missing borrow_id or proof_image');
      return res.status(400).json({ success: false, message: 'Missing borrow_id or proof_image' });
    }
    const affected = await updateProofImageAndPayStatus(borrow_id, proof_image);
    console.log('[confirm-payment] affected:', affected);
    if (affected > 0) {
      res.json({ success: true });
    } else {
      console.log('[confirm-payment] Return not found for borrow_id:', borrow_id);
      res.status(404).json({ success: false, message: 'Return not found' });
    }
  } catch (err) {
    console.error('[confirm-payment] error:', err);
    res.status(500).json({ success: false, message: 'Confirm payment failed', error: err.message });
  }
};