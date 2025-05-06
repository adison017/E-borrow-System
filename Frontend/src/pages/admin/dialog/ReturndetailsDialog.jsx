import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import { MdClose } from "react-icons/md";

const ReturnDetailsDialog = ({ returnItem, isOpen, onClose }) => {
  if (!isOpen || !returnItem) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-green-700 text-sm font-semibold">
            <CheckCircleSolidIcon className="w-5 h-5" /> คืนแล้ว
          </div>
        );
      case "overdue":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-red-700 text-sm font-semibold">
            <ExclamationTriangleIcon className="w-5 h-5" /> เกินกำหนด
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-yellow-800 text-sm font-semibold">
            <ClockIcon className="w-5 h-5" /> รอคืน
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 text-sm font-semibold">
            ไม่ทราบสถานะ
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">รายละเอียดการคืนครุภัณฑ์</h2>
              <p className="text-blue-600 mt-1">รหัสการคืน: {returnItem.return_code}</p>
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
            {/* Equipment Information */}
            <div className="card bg-gray-100">
              <div className="card-body">
                <h4 className="card-title text-lg font-bold text-blue-800 border-b pb-2">ข้อมูลครุภัณฑ์</h4>
                <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-lg">
                      <img
                        src={returnItem.equipment.image}
                        alt={returnItem.equipment.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ชื่อครุภัณฑ์</p>
                      <p className="font-bold">{returnItem.equipment.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">รหัสครุภัณฑ์</p>
                      <p className="font-mono">{returnItem.equipment.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">รหัสการยืม</p>
                      <p className="font-mono">{returnItem.borrow_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">รหัสการคืน</p>
                      <p className="font-mono">{returnItem.return_code}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrower Information */}
            <div className="card bg-gray-100">
              <div className="card-body">
                <h4 className="card-title text-lg font-bold text-blue-800 border-b pb-2">ข้อมูลผู้ยืม</h4>
                <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full">
                      <img
                        src={returnItem.borrower.avatar}
                        alt={returnItem.borrower.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ชื่อผู้ยืม</p>
                      <p className="font-bold">{returnItem.borrower.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">แผนก</p>
                      <p className="font-medium">{returnItem.borrower.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-gray-100">
                <div className="card-body">
                  <h4 className="card-title text-lg font-bold text-blue-800 border-b pb-2">ข้อมูลการยืม-คืน</h4>
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">วันที่ยืม</p>
                      <p className="font-medium">{returnItem.borrow_date}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">กำหนดคืน</p>
                      <p className="font-medium">{returnItem.due_date}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">วันที่คืนจริง</p>
                      <p className="font-medium">{returnItem.return_date || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-100">
                <div className="card-body">
                  <h4 className="card-title text-lg font-bold text-blue-800 border-b pb-2">สถานะการคืน</h4>
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">สถานะ</p>
                      {getStatusBadge(returnItem.status)}
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">สภาพที่คืน</p>
                      <p className="font-medium">{returnItem.condition || '-'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">ค่าปรับ</p>
                      <p className="font-medium">
                        {returnItem.fine_amount > 0 ? `${returnItem.fine_amount} บาท` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fine and Notes */}
            {returnItem.fine_amount > 0 && (
              <div className="card bg-warning/10 border-warning/20">
                <div className="card-body">
                  <h4 className="card-title text-lg font-bold text-amber-800">ค่าปรับ</h4>
                  <div className="alert alert-warning mt-2">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h3 className="font-bold">มีการเรียกเก็บค่าปรับ</h3>
                        <p className="text-sm">จำนวน {returnItem.fine_amount} บาท</p>
                        {returnItem.notes && (
                          <p className="text-sm mt-1">หมายเหตุ: {returnItem.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {returnItem.notes && !returnItem.fine_amount > 0 && (
              <div className="card bg-base-100">
                <div className="card-body">
                  <h4 className="card-title text-lg font-bold text-blue-800">หมายเหตุ</h4>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{returnItem.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-action mt-6 flex justify-end space-x-2 border-t pt-4">
            <button
              className="btn btn-neutral"
              onClick={onClose}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnDetailsDialog;