import {
    CheckCircleIcon as CheckCircleSolidIcon,
    ClockIcon,
    DocumentCheckIcon,
    ExclamationTriangleIcon,
    UserCircleIcon
} from "@heroicons/react/24/solid";
import { MdClose } from "react-icons/md";

const ReturnDetailsDialog = ({ returnItem, isOpen, onClose, paymentDetails }) => {
  if (!isOpen || !returnItem) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 text-xs font-semibold"><ClockIcon className="w-4 h-4" /> รอคืน</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-green-700 text-xs font-semibold"><CheckCircleSolidIcon className="w-4 h-4" /> คืนแล้ว</span>;
      case "overdue":
        return <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-red-700 text-xs font-semibold"><ExclamationTriangleIcon className="w-4 h-4" /> เกินกำหนด</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-red-700 text-xs font-semibold"><ExclamationTriangleIcon className="w-4 h-4" /> ไม่อนุมัติ</span>;
      case "waiting_payment":
        return <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-blue-700 text-xs font-semibold animate-pulse border border-blue-200"><CheckCircleSolidIcon className="w-4 h-4" /> รอชำระเงิน</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-gray-700 text-xs font-semibold">-</span>;
    }
  };

  const equipmentItems = Array.isArray(returnItem.equipment) ? returnItem.equipment : [returnItem.equipment];

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white rounded-xl shadow-xl w-full max-w-8xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-lg shadow-sm">
                <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">รายละเอียดการคืนครุภัณฑ์</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-mono font-medium text-blue-600">รหัสการยืม: {returnItem.borrow_code}</span>
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

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Right/Borrower Info (1/3) */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <UserCircleIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">ข้อมูลผู้ยืม</h3>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={
                        returnItem.borrower.avatar
                          ? returnItem.borrower.avatar.startsWith('http')
                            ? returnItem.borrower.avatar
                            : `http://localhost:5000/uploads/user/${returnItem.borrower.avatar}`
                          : '/default-avatar.png'
                      }
                      alt={returnItem.borrower.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-gray-500 "><span className="font-mono">{returnItem.borrower.student_id}</span></p>
                    <p className="font-bold text-lg text-gray-800">{returnItem.borrower.name}</p>
                    <p className="text-gray-500 ">{returnItem.borrower.position}</p>
                    <p className="text-gray-500 mt-1">{returnItem.borrower.department}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">รหัสการยืม</span>
                    <span className="font-mono text-blue-700">{returnItem.borrow_code}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">สถานะ</span>
                    {console.log('DEBUG returnItem.status:', returnItem.status)}
                    {getStatusBadge(returnItem.status)}
                  </div>
                </div>
              </div>

              {/* Fine and Notes Box - Moved to left column */}
              {(returnItem.fine_amount > 0 || returnItem.notes) && (
                <div className={`rounded-xl p-5 space-y-3 ${returnItem.fine_amount > 0 ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    {returnItem.fine_amount > 0 ? (
                      <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    )}
                    <h3 className={`font-semibold ${returnItem.fine_amount > 0 ? 'text-amber-800' : 'text-gray-800'}`}>
                      {returnItem.fine_amount > 0 ? 'รายละเอียดค่าปรับ' : 'หมายเหตุ'}
                    </h3>
                  </div>

                  {returnItem.fine_amount > 0 && (
                    <div className="flex items-center justify-between px-4 py-2 bg-white rounded-full border border-amber-100">
                      <span className="font-medium text-amber-800">จำนวนค่าปรับ</span>
                      <span className="text-amber-800 font-semibold">{returnItem.fine_amount} บาท</span>
                    </div>
                  )}

                  {returnItem.notes && (
                    <div className="p-3 bg-white rounded-full border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">{returnItem.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Left/Main Info (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Equipment List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  รายการครุภัณฑ์ที่คืน
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">รหัสการยืม:</span>
                      <span className="font-mono text-gray-800 font-medium">{returnItem.borrow_code}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
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
                                  {item.pic ? (
                                    <img
                                      src={item.pic}
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

              {/* Loan Details & Return Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold text-gray-700">ข้อมูลการยืม-คืน</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">วันที่ยืม:</span>
                      <span className="font-mono text-gray-800 font-medium">{returnItem.borrow_date ? new Date(returnItem.borrow_date).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">กำหนดคืน:</span>
                      <span className="font-mono text-gray-800 font-medium">{returnItem.due_date ? new Date(returnItem.due_date).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">วันที่คืนจริง</span>
                      <span className="font-medium text-gray-800">{returnItem.return_date || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-700">สถานะการคืน</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">สภาพที่คืน</span>
                      <span className="font-medium text-gray-800">{returnItem.condition || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ค่าปรับ</span>
                      <span className="font-medium text-gray-800">
                        {returnItem.fine_amount > 0 ? `${returnItem.fine_amount} บาท` : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Payment Details */}
                {paymentDetails && (
                  <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V6c0-2.21 3.59-4 8-4s8 1.79 8 4v8c0 2.21-3.59 4-8 4z" />
                      </svg>
                      <h3 className="font-semibold text-blue-700">สถานะการชำระเงิน</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">สถานะชำระเงิน</span>
                        <span className={`font-semibold px-2 py-1 rounded-full ${paymentDetails.pay_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>
                          {paymentDetails.pay_status === 'paid' ? 'ชำระแล้ว' : 'รอชำระเงิน'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">วิธีชำระเงิน</span>
                        <span className="font-medium text-gray-800">{paymentDetails.paymentMethod || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">วันที่คืน</span>
                        <span className="font-medium text-gray-800">{paymentDetails.return_date ? new Date(paymentDetails.return_date).toLocaleString('th-TH') : '-'}</span>
                      </div>
                      {paymentDetails.fine_amount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">จำนวนค่าปรับ</span>
                          <span className="font-medium text-amber-800">{paymentDetails.fine_amount} บาท</span>
                        </div>
                      )}
                      {paymentDetails.proof_image && (
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-sm text-gray-600">สลิป/หลักฐานการโอน</span>
                          <img src={`http://localhost:5000/uploads/signature/${paymentDetails.proof_image}`} alt="slip" className="w-40 h-auto rounded-lg border border-gray-200" />
                        </div>
                      )}
                      {paymentDetails.notes && (
                        <div className="bg-white rounded-lg p-2 border border-gray-200 mt-2">
                          <span className="text-sm text-gray-600">หมายเหตุ</span>
                          <div className="text-gray-800 text-sm mt-1 whitespace-pre-line">{paymentDetails.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
};

export default ReturnDetailsDialog;