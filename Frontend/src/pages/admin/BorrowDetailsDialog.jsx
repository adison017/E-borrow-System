import {
    CheckCircleIcon as CheckCircleSolidIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    ArrowPathIcon,
    XCircleIcon
  } from "@heroicons/react/24/solid";
  import { useState } from "react";
  import { MdClose } from "react-icons/md";

  const BorrowDetailsDialog = ({ borrow, isOpen, onClose, onApprove, onReject }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectReason, setShowRejectReason] = useState(false);

    if (!isOpen || !borrow) return null;

    const borrowDates = `${borrow.borrow_date} ถึง ${borrow.due_date}`;

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-green-700 text-sm font-semibold">
                        <CheckCircleSolidIcon className="w-6 h-6" /> อนุมัติ/กำลังยืม
                    </div>
                );
            case "pending_approval":
                return (
                    <div className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-blue-700 text-sm font-semibold">
                        <ClockIcon className="w-6 h-6" /> รออนุมัติ
                    </div>
                );
            case "under_review":
                return (
                    <div className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-yellow-800 text-sm font-semibold">
                        <ArrowPathIcon className="w-6 h-6" /> รอตรวจสอบ
                    </div>
                );
            case "rejected":
                return (
                    <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-red-700 text-sm font-semibold">
                        <XCircleIcon className="w-6 h-6" /> ไม่ผ่านการตรวจสอบ
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

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            await onApprove();
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = () => {
        if (!rejectReason) {
            alert("กรุณาระบุเหตุผลที่ไม่ผ่านการตรวจสอบ");
            return;
        }
        setIsSubmitting(true);
        try {
            onReject(rejectReason);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
      isOpen && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">รายละเอียดการยืมครุภัณฑ์</h2>
                  <p className="text-sm text-gray-500 mt-1">รหัส: {borrow.borrow_code}</p>
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
                {/* Borrower Info Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ข้อมูลผู้ยืม
                  </h3>
                  <div className="ml-7">
                    <p className="text-gray-700"><span className="font-medium">ชื่อผู้ขอยืม:</span> {borrow.borrower.name}</p>
                    <p className="text-gray-700"><span className="font-medium">แผนก:</span> {borrow.borrower.department}</p>
                    <p className="text-gray-700"><span className="font-medium">ระยะเวลายืม:</span> {borrowDates}</p>
                    <p className="text-gray-700"><span className="font-medium">วัตถุประสงค์:</span> {borrow.purpose}</p>
                  </div>
                </div>

                {/* Equipment Info Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    รายการครุภัณฑ์ที่ยืม
                  </h3>
                  <div className="flex items-center p-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                      <img
                        src={borrow.equipment.image}
                        alt={borrow.equipment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{borrow.equipment.name}</p>
                      <p className="text-sm text-gray-500">เลขครุภัณฑ์: {borrow.equipment.code}</p>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    สถานะการยืม
                  </h3>
                  <div className="ml-7 mt-2">
                    {getStatusBadge(borrow.status)}
                  </div>
                </div>
              </div>

              {/* Footer with action buttons */}
              {borrow.status === "under_review" && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg mt-6">
                  {showRejectReason && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เหตุผลที่ไม่ผ่านการตรวจสอบ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="ระบุเหตุผล..."
                        required
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      onClick={onClose}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ยกเลิก
                    </button>

                    {!showRejectReason ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        onClick={() => setShowRejectReason(true)}
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        ไม่ผ่านการตรวจสอบ
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-70"
                        onClick={handleReject}
                        disabled={isSubmitting || !rejectReason}
                      >
                        {isSubmitting ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                            กำลังประมวลผล...
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5 mr-2" />
                            ยืนยันไม่ผ่านการตรวจสอบ
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
                      onClick={handleApprove}
                      disabled={isSubmitting || borrow.status !== "under_review"}
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                          กำลังประมวลผล...
                        </>
                      ) : (
                        <>
                          <CheckCircleSolidIcon className="h-5 w-5 mr-2" />
                          ยืนยันข้อมูลและส่งอนุมัติ
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    );
  };

  export default BorrowDetailsDialog;