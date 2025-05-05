import { useState } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const ReturnFormDialog = ({
  borrowedItem,
  isOpen,
  onClose,
  onConfirm,
  isOverdue,
  overdayCount,
  fineAmount,
  setFineAmount,
}) => {
  const [returnCondition, setReturnCondition] = useState("good");
  const [returnNotes, setReturnNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  if (!isOpen || !borrowedItem) return null;

  const handleConfirm = () => {
    onConfirm({
      borrowedItem,
      returnCondition,
      returnNotes,
      fineAmount,
      paymentMethod,
    });
  };

  const conditionOptions = [
    { value: "good", label: "สภาพดี", color: "success" },
    { value: "minor_damage", label: "ชำรุดเล็กน้อย", color: "warning" },
    { value: "major_damage", label: "ชำรุดหนัก", color: "error" },
    { value: "lost", label: "สูญหาย", color: "error" },
  ];

  const paymentMethods = [
    { value: "cash", label: "เงินสด" },
    { value: "transfer", label: "โอนเงิน" },
    { value: "other", label: "อื่นๆ" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-center">บันทึกการคืนครุภัณฑ์</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* ข้อมูลการยืม */}
          <div>
            <h3 className="font-semibold mb-4">ข้อมูลการยืม</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* ครุภัณฑ์ */}
              <div className="flex gap-4">
                <div className="avatar">
                  <div className="w-24 rounded">
                    <img src={borrowedItem.equipment.image} alt={borrowedItem.equipment.name} />
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{borrowedItem.equipment.name}</div>
                  <div className="text-sm text-gray-500">รหัส: {borrowedItem.equipment.code}</div>
                  <div className="text-sm text-gray-500">รหัสการยืม: {borrowedItem.borrow_code}</div>
                </div>
              </div>

              {/* ผู้ยืม */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={borrowedItem.borrower.avatar} alt={borrowedItem.borrower.name} />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">{borrowedItem.borrower.name}</div>
                    <div className="text-sm text-gray-500">{borrowedItem.borrower.department}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">วันที่ยืม</div>
                    <div>{borrowedItem.borrow_date}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">กำหนดคืน</div>
                    <div className={isOverdue ? "text-error" : ""}>
                      {borrowedItem.due_date}
                      {isOverdue && (
                        <span className="text-xs text-red-500 ml-1">(ล่าช้า {overdayCount} วัน)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* แจ้งเตือนคืนล่าช้า */}
          {isOverdue && (
            <div className="alert alert-error shadow-lg">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <div>
                <h3 className="font-bold">พบการคืนล่าช้า!</h3>
                <div className="text-xs">
                  คืนช้า {overdayCount} วัน มีค่าปรับ {fineAmount} บาท
                </div>
              </div>
            </div>
          )}

          {/* ฟอร์มข้อมูล */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* สภาพครุภัณฑ์ */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">สภาพครุภัณฑ์</span>
                </label>
                <select
                  className="select select-bordered bg-white border-cyan-500"
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                >
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">หมายเหตุ</span>
                </label>
                <textarea
                  className="textarea textarea-bordered bg-white border-cyan-500"
                  placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  rows={4}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                />
              </div>
            </div>

            {/* ค่าปรับ */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">ค่าปรับ (บาท)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered bg-white border-cyan-500"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(parseInt(e.target.value) || 0)}
                  disabled={!isOverdue}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">วิธีการชำระค่าปรับ</span>
                </label>
                <select
                  className="select select-bordered bg-white border-cyan-500"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={fineAmount <= 0}
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {fineAmount > 0 && (
                <div className="alert alert-info shadow-md">
                  <InformationCircleIcon className="h-5 w-5" />
                  <div>
                    <h3 className="font-bold">กรุณาเก็บหลักฐานการชำระค่าปรับ</h3>
                    <div className="text-xs">
                      จำนวน {fineAmount} บาท ผ่าน {paymentMethods.find(m => m.value === paymentMethod)?.label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end gap-4 border-t">
          <button className="btn btn-outline" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn btn-success flex items-center gap-2" onClick={handleConfirm}>
            <CheckCircleIcon className="h-5 w-5" />
            ยืนยันการคืน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnFormDialog;
