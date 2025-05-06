import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";
import { useState } from "react";

const ExBorDetailsDialog = ({ borrow, isOpen, onClose, onApprove, onReject }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);

  if (!isOpen || !borrow) return null;

  // Format borrowing period dates
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
          alert("กรุณาระบุเหตุผลที่ปฏิเสธการยืม");
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
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
          {/* Background overlay with animation */}
          <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={onClose}
          ></div>

          {/* Dialog with animation */}
          <div className="modal-box w-11/12 max-w-xl p-0 bg-white rounded-lg shadow-2xl z-50 transform transition-all duration-300 ease-out scale-95 opacity-0
              [.modal-open_&]:scale-100 [.modal-open_&]:opacity-100">

              {/* Header */}
              <div className="bg-indigo-800 py-4 px-6 rounded-t-lg">
                  <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          อนุมัติการยืมครุภัณฑ์
                      </h2>
                      <button
                          onClick={onClose}
                          className="text-white hover:text-gray-200 focus:outline-none"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
              </div>

              <div className="p-6 space-y-6">
                  {/* Transaction ID Box */}
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          <div>
                              <div className="text-sm text-gray-500">หมายเลขการยืม</div>
                              <div className="font-bold text-gray-800 text-lg">{borrow.borrow_code}</div>
                          </div>
                      </div>
                  </div>

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

              {/* Footer with action buttons - Only show for pending approval */}
              {borrow.status === "pending_approval" && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
                  {showRejectReason && (
                    <div className="mb-4">
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-amber-700">
                              กรุณาระบุเหตุผลในการปฏิเสธการยืมครุภัณฑ์ เพื่อแจ้งให้ผู้ยืมทราบ
                            </p>
                          </div>
                        </div>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เหตุผลที่ปฏิเสธการยืม <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="ระบุเหตุผล เช่น ไม่ได้รับอนุมัติงบประมาณ, มีผู้จองใช้งานในช่วงเวลาดังกล่าวแล้ว..."
                        required
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      onClick={onClose}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ปิด
                    </button>

                    {!showRejectReason ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        onClick={() => setShowRejectReason(true)}
                      >
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        ปฏิเสธการยืม
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mr-2"
                          onClick={() => setShowRejectReason(false)}
                        >
                          ย้อนกลับ
                        </button>
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
                              ยืนยันการปฏิเสธ
                            </>
                          )}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70"
                      onClick={handleApprove}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                          กำลังประมวลผล...
                        </>
                      ) : (
                        <>
                          <CheckCircleSolidIcon className="h-5 w-5 mr-2" />
                          อนุมัติการยืม
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* For other statuses, just show close button */}
              {borrow.status !== "pending_approval" && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      onClick={onClose}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ปิด
                    </button>
                  </div>
                </div>
              )}
          </div>
      </div>
  );
};

export default ExBorDetailsDialog;