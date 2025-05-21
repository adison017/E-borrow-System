import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid";
import { MdClose } from "react-icons/md";

const ReturnDetailsDialog = ({ returnItem, isOpen, onClose }) => {
  if (!isOpen || !returnItem) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-green-700 text-sm font-semibold">
            <CheckCircleSolidIcon className="w-5 h-5" /> คืนแล้ว
          </div>
        );
      case "overdue":
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-red-700 text-sm font-semibold">
            <ExclamationTriangleIcon className="w-5 h-5" /> เกินกำหนด
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-yellow-800 text-sm font-semibold">
            <ClockIcon className="w-5 h-5" /> รอคืน
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 text-sm font-semibold">
            ไม่ทราบสถานะ
          </div>
        );
    }
  };

  const equipmentItems = Array.isArray(returnItem.equipment) ? returnItem.equipment : [returnItem.equipment];

  return (
    <div className="fixed inset-0 backdrop-blur bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-lg shadow-sm">
                <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">รายละเอียดการคืนครุภัณฑ์</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-mono font-medium text-blue-600">รหัสการคืน: {returnItem.return_code}</span>
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
                      src={returnItem.borrower.avatar}
                      alt={returnItem.borrower.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-800">{returnItem.borrower.name}</p>
                    <p className="text-gray-500">{returnItem.borrower.department}</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">รหัสการยืม</span>
                    <span className="font-mono text-blue-700">{returnItem.borrow_code}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">รหัสการคืน</span>
                    <span className="font-mono text-blue-700">{returnItem.return_code}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">สถานะ</span>
                    {getStatusBadge(returnItem.status)}
                  </div>
                </div>
              </div>
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
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">รหัสการคืน:</span> 
                      <span className="font-mono text-gray-800 font-medium">{returnItem.return_code}</span>
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">วันที่ยืม</span>
                      <span className="font-medium text-gray-800">{returnItem.borrow_date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">กำหนดคืน</span>
                      <span className="font-medium text-gray-800">{returnItem.due_date}</span>
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
              </div>

              {/* Fine and Notes Box */}
              {(returnItem.fine_amount > 0 || returnItem.notes) && (
                <div className={`rounded-lg p-4 space-y-2 ${returnItem.fine_amount > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    {returnItem.fine_amount > 0 ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    )}
                    <h3 className={`font-semibold ${returnItem.fine_amount > 0 ? 'text-amber-800' : 'text-gray-700'}`}>
                      {returnItem.fine_amount > 0 ? 'รายละเอียดค่าปรับ' : 'หมายเหตุ'}
                    </h3>
                  </div>
                  
                  {returnItem.fine_amount > 0 && (
                    <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-amber-100">
                      <span className="font-medium text-amber-800">จำนวนค่าปรับ</span>
                      <span className="text-amber-800 font-semibold">{returnItem.fine_amount} บาท</span>
                    </div>
                  )}
                  
                  {returnItem.notes && (
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">{returnItem.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnDetailsDialog;