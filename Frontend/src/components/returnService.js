// ค่าปรับต่อวัน (บาท)
const FINE_RATE_PER_DAY = 50;

// คำนวณสถานะการคืน
export const calculateReturnStatus = (borrowedItem) => {
  const today = new Date();
  const dueDate = new Date(borrowedItem.due_date);
  
  // ตรวจสอบว่าเกินกำหนดหรือไม่
  if (today > dueDate) {
    // คำนวณจำนวนวันที่เกินกำหนด
    const diffTime = Math.abs(today - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      isOverdue: true,
      overdayCount: diffDays,
      fineAmount: diffDays * FINE_RATE_PER_DAY
    };
  } else {
    return {
      isOverdue: false,
      overdayCount: 0,
      fineAmount: 0
    };
  }
};

// แปลงสถานะครุภัณฑ์จากรหัสเป็นข้อความ
export const getConditionText = (conditionCode) => {
  switch(conditionCode) {
    case "good":
      return "ปกติ";
    case "minor_damage":
      return "ชำรุดเล็กน้อย";
    case "major_damage":
      return "ชำรุดหนัก";
    case "lost":
      return "สูญหาย";
    default:
      return "";
  }
};

// สร้างข้อมูลการคืนใหม่
export const createNewReturn = (borrowedItem, returnOptions, existingReturns) => {
  const { returnCondition, returnNotes, fineAmount } = returnOptions;
  
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  
  // สร้าง ID และรหัสการคืนใหม่
  const newReturnId = existingReturns.length > 0 
    ? Math.max(...existingReturns.map(item => item.return_id)) + 1 
    : 1;
  const newReturnCode = `RT-${String(newReturnId).padStart(3, '0')}`;
  
  // ตรวจสอบสถานะการคืน
  const { isOverdue } = calculateReturnStatus(borrowedItem);
  
  return {
    return_id: newReturnId,
    return_code: newReturnCode,
    borrow_code: borrowedItem.borrow_code,
    borrower: borrowedItem.borrower,
    equipment: borrowedItem.equipment,
    borrow_date: borrowedItem.borrow_date,
    due_date: borrowedItem.due_date,
    return_date: formattedDate,
    status: isOverdue ? "overdue" : "completed",
    condition: getConditionText(returnCondition),
    fine_amount: fineAmount,
    notes: returnNotes
  };
};