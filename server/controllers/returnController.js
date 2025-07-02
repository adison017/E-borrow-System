import * as ReturnModel from '../models/returnModel.js';
import * as BorrowModel from '../models/borrowModel.js';
import * as EquipmentModel from '../models/equipmentModel.js';
import * as DamageLevelModel from '../models/damageLevelModel.js';

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
    condition_level_id,
    condition_text,
    fine_amount,
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
      condition_level_id,
      condition_text,
      fine_amount,
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