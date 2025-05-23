import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, CheckCircleIcon as CheckCircleSolidIcon, ClipboardDocumentListIcon, DocumentCheckIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { MdClose } from "react-icons/md";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !borrowedItem) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    try {
      onConfirm({
        borrowedItem,
        returnCondition,
        returnNotes,
        fineAmount,
        paymentMethod,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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

  const equipmentItems = Array.isArray(borrowedItem.equipment) ? borrowedItem.equipment : [borrowedItem.equipment];

  return (
    <div className="fixed inset-0 backdrop-blur bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-8xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-lg shadow-sm">
                <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">บันทึกการคืนครุภัณฑ์</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-mono font-medium text-blue-600">รหัสการยืม: {borrowedItem.borrow_code}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Borrower Info */}
            <div className="space-y-6 lg:order-1">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-gray-800">ข้อมูลผู้ยืม</h3>
                </div>
                <div className="flex flex-col items-center gap-4">
                  {borrowedItem.borrower?.avatar && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={borrowedItem.borrower.avatar}
                        alt={borrowedItem.borrower.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-gray-500 "><span className="font-mono">{borrowedItem.borrower.student_id}</span></p>
                    <p className="font-bold text-lg text-gray-800">{borrowedItem.borrower.name}</p>
                    <p className="text-gray-500 ">{borrowedItem.borrower.position}</p>
                    <p className="text-gray-500 mt-1">{borrowedItem.borrower.department}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">รหัสการยืม</span>
                    <span className="font-mono text-blue-700">{borrowedItem.borrow_code}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">ระยะเวลายืม</span>
                    <span className="font-semibold text-gray-800 text-right">{borrowedItem.borrow_date} ถึง {borrowedItem.due_date}</span>
                  </div>
                </div>
              </div>
              {isOverdue && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-700">พบการคืนล่าช้า!</h3>
                    <div className="text-sm text-red-600">
                      คืนช้า {overdayCount} วัน มีค่าปรับ {fineAmount} บาท
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Equipment List and Form */}
            <div className="lg:col-span-2 space-y-6 lg:order-2">
              {/* Equipment List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  รายการครุภัณฑ์ที่คืน
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">รหัสการยืม:</span>
                      <span className="font-mono text-gray-800 font-medium">{borrowedItem.borrow_code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">จำนวนครุภัณฑ์:</span>
                      <span className="font-mono text-gray-800 font-medium">
                        {equipmentItems?.reduce((total, eq) => total + (eq.quantity || 1), 0) || 0} ชิ้น
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">รูป</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ครุภัณฑ์</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">จำนวน</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {equipmentItems.length > 0 ? equipmentItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 py-3 align-middle text-center">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mx-auto border border-gray-200 bg-white">
                                {item.image || item.pic ? (
                                  <img src={item.image || item.pic} alt={item.name} className="max-w-full max-h-full object-contain p-1" onError={e => { e.target.onerror = null; e.target.src = '/lo.png'; }} />
                                ) : (
                                  <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle"><span className="font-semibold text-gray-800 text-base leading-tight">{item.name}</span><div className="text-xs text-gray-500 italic mt-1 leading-tight">{item.code}</div></td>
                            <td className="px-4 py-3 text-right align-middle"><span className="font-medium text-blue-700 text-base">{item.quantity || 1}</span></td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-gray-400 text-base">ไม่พบข้อมูลครุภัณฑ์</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Return Form */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />ข้อมูลการคืน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* สภาพครุภัณฑ์ */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">สภาพครุภัณฑ์</label>
                      <select
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={returnCondition}
                        onChange={(e) => setReturnCondition(e.target.value)}
                      >
                        {conditionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <label className="block text-sm font-medium text-gray-700 mt-4">หมายเหตุ</label>
                      <textarea
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="ระบุรายละเอียดเพิ่มเติม..."
                        rows={4}
                        value={returnNotes}
                        onChange={(e) => setReturnNotes(e.target.value)}
                      />
                    </div>
                    {/* ค่าปรับ */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">ค่าปรับ (บาท)</label>
                      <input
                        type="number"
                        className={`w-full px-4 py-2.5 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${!isOverdue ? "border-gray-200 bg-gray-50 text-gray-400" : "border-gray-300"}`}
                        value={fineAmount}
                        onChange={(e) => setFineAmount(parseInt(e.target.value) || 0)}
                        disabled={!isOverdue}
                      />
                      <label className={`block text-sm font-medium ${fineAmount <= 0 ? "text-gray-400" : "text-gray-700"}`}>วิธีการชำระค่าปรับ</label>
                      <select
                        className={`w-full px-4 py-2.5 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${fineAmount <= 0 ? "border-gray-200 bg-gray-50 text-gray-400" : "border-gray-300"}`}
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
                      {fineAmount > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mt-4">
                          <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-blue-700">กรุณาเก็บหลักฐานการชำระค่าปรับ</h3>
                            <div className="text-sm text-blue-600">
                              จำนวน {fineAmount} บาท ผ่าน {paymentMethods.find(m => m.value === paymentMethod)?.label}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />กำลังดำเนินการ...</>
              ) : (
                <><CheckCircleSolidIcon className="w-5 h-5 mr-2" />ยืนยันการคืน</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnFormDialog;