import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, CheckCircleIcon as CheckCircleSolidIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2.5 rounded-lg shadow-sm">
                <ClipboardDocumentListIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">บันทึกการคืนครุภัณฑ์</h2>
                <p className="text-sm text-gray-500 mt-1">รหัสการยืม: <span className="font-mono font-medium text-blue-600">{borrowedItem.borrow_code}</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">            
            {/* Grid layout for equipment list and borrower info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Borrower Info (1/3) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  ข้อมูลผู้ยืม
                </h3>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={borrowedItem.borrower.avatar} 
                      alt={borrowedItem.borrower.name} 
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm" 
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{borrowedItem.borrower.name}</p>
                      <p className="text-sm text-gray-500">{borrowedItem.borrower.department}</p>
                    </div>
                  </div>
                
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">ระยะเวลาการยืม:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm bg-white p-3 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">วันที่ยืม</p>
                        <p className="font-medium text-gray-800">{borrowedItem.borrow_date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">กำหนดคืน</p>
                        <div className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-800"}`}>
                          {borrowedItem.due_date}
                          {isOverdue && (
                            <span className="block text-xs font-normal text-red-500">(ล่าช้า {overdayCount} วัน)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* แจ้งเตือนคืนล่าช้า */}
                {isOverdue && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
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

              {/* Equipment List (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  รายการครุภัณฑ์ที่คืน
                </h3>
                
                <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
                  <div className="min-w-[340px]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
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
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="max-w-full max-h-full object-contain p-1"
                                    style={{ display: 'block', margin: 'auto' }}
                                    onError={e => { e.target.onerror = null; e.target.src = '/lo.png'; }}
                                  />
                                ) : (
                                  <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <span className="font-semibold text-gray-800 text-base leading-tight">{item.name}</span>
                              <div className="text-xs text-gray-500 italic mt-1 leading-tight">{item.code}</div>
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              <span className="font-medium text-blue-700 text-base">{item.quantity || 1}</span>
                            </td>
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
            </div>

            {/* ฟอร์มข้อมูล */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
              {/* สภาพครุภัณฑ์ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">ข้อมูลการคืน</h3>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    สภาพครุภัณฑ์
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    หมายเหตุ
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                    rows={4}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* ค่าปรับ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">ข้อมูลค่าปรับ</h3>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    ค่าปรับ (บาท)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isOverdue ? "border-gray-200 bg-gray-50 text-gray-400" : "border-gray-300"}`}
                    value={fineAmount}
                    onChange={(e) => setFineAmount(parseInt(e.target.value) || 0)}
                    disabled={!isOverdue}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${fineAmount <= 0 ? "text-gray-400" : "text-gray-700"}`}>
                    วิธีการชำระค่าปรับ
                  </label>
                  <select
                    className={`w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${fineAmount <= 0 ? "border-gray-200 bg-gray-50 text-gray-400" : "border-gray-300"}`}
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3 mt-4">
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

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-2 border-t pt-4">
            <button 
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all" 
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button 
              className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <CheckCircleSolidIcon className="w-5 h-5" />
                  ยืนยันการคืน
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnFormDialog;