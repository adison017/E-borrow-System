import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  UserIcon,
  CubeIcon,
  TagIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon as ClockSolid,
  CalendarIcon as CalendarSolid
} from "@heroicons/react/24/outline";

export default function BorrowDetailsDialog({
  open,
  onClose,
  borrowRequest,
  onApprove,
  onReject
}) {
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [formErrors, setFormErrors] = useState({ rejectReason: "" });

  const rejectReasonOptions = [
    "อุปกรณ์ไม่ว่างในช่วงเวลาดังกล่าว",
    "วัตถุประสงค์ไม่ชัดเจน",
    "ระยะเวลาการยืมไม่เหมาะสม",
    "ผู้ขอยืมมีประวัติการคืนล่าช้า",
    "อื่นๆ (โปรดระบุในหมายเหตุ)"
  ];

  const statusBadgeStyle = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-error",
    borrowing: "badge-info",
    returned: "badge-primary"
  };

  const statusTranslation = {
    pending: "รอการอนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ",
    borrowing: "กำลังยืม",
    returned: "คืนแล้ว"
  };

  const handleClose = () => {
    setApprovalNotes("");
    setActionType(null);
    setShowConfirm(false);
    setShowRejectDialog(false);
    setRejectReason("");
    setFormErrors({ rejectReason: "" });
    onClose();
  };

  const handleAction = (type) => {
    setActionType(type);
    if (type === "reject") {
      setShowRejectDialog(true);
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancelReject = () => {
    setShowRejectDialog(false);
    setRejectReason("");
    setFormErrors({ rejectReason: "" });
  };

  const handleConfirmReject = () => {
    if (!rejectReason) {
      setFormErrors({ rejectReason: "โปรดเลือกเหตุผลในการปฏิเสธ" });
      return;
    }

    if (rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !approvalNotes.trim()) {
      setFormErrors({ rejectReason: "โปรดระบุเหตุผลเพิ่มเติม" });
      return;
    }

    const finalNotes = rejectReason.includes("อื่นๆ")
      ? approvalNotes
      : `${rejectReason}. ${approvalNotes || ''}`.trim();

    setApprovalNotes(finalNotes);
    setShowRejectDialog(false);
    setShowConfirm(true);
    setFormErrors({ rejectReason: "" });
  };

  const confirmAction = () => {
    if (!actionType) return;

    setIsSubmitting(true);

    const actionData = {
      ...borrowRequest,
      approvalNotes,
      approvalDate: new Date().toISOString().split('T')[0]
    };

    try {
      if (actionType === "approve") {
        onApprove(actionData);
      } else {
        onReject(actionData);
      }
      handleClose();
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status) => (
    <div className={`badge gap-2 ${statusBadgeStyle[status]}`}>
      {statusTranslation[status]}
    </div>
  );

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div data-theme="light" className="modal-box max-w-4xl">
        {borrowRequest ? (
          <div>
            <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>อนุมัติคำขอยืมอุปกรณ์</span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    รหัสคำขอ: <span className="font-medium text-gray-700">{borrowRequest.borrowId || ""}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 mt-3">ข้อมูลผู้ขอยืม</h4>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={borrowRequest.requester.avatar} alt={borrowRequest.requester.name} />
                  </div>
                </div>
                <div>
                  <h5 className="font-medium">{borrowRequest.requester.name}</h5>
                  <p className="text-sm text-gray-500">
                    แผนก: {borrowRequest.requester.department}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ข้อมูลอุปกรณ์ */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">ข้อมูลอุปกรณ์</h4>
                <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                  <img
                    src={borrowRequest?.equipment?.image || '/placeholder-equipment.png'}
                    alt={borrowRequest?.equipment?.name || 'Equipment'}
                    className="h-16 w-16 object-contain bg-white p-1 rounded"
                  />
                  <div>
                    <h5 className="font-medium">{borrowRequest?.equipment?.name || 'ไม่ระบุชื่ออุปกรณ์'}</h5>
                    <p className="text-sm text-gray-500">
                      รหัส: {borrowRequest?.equipment?.code || 'ไม่ระบุรหัส'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ข้อมูลการยืม */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">ข้อมูลการยืม</h4>
                <div className="space-y-2 p-3 bg-base-200 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">วันที่ขอยืม:</span>
                    <span className="text-sm font-medium">{borrowRequest.requestDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">วันที่ต้องการยืม:</span>
                    <span className="text-sm font-medium">{borrowRequest.borrowDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">กำหนดคืน:</span>
                    <span className="text-sm font-medium">{borrowRequest.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* วัตถุประสงค์ */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">วัตถุประสงค์</h4>
                <div className="p-3 bg-base-200 rounded-lg">
                  <p className="text-sm">{borrowRequest.purpose}</p>
                </div>
              </div>

              {/* หมายเหตุการอนุมัติ (แสดงเมื่อมีการอนุมัติ/ปฏิเสธแล้ว) */}
              {borrowRequest.approvalNotes && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    หมายเหตุจากผู้ดูแลระบบ
                  </h4>
                  <div
                    className={`p-3 rounded-lg ${
                      borrowRequest.status === "approved"
                        ? "bg-success text-success-content"
                        : "bg-error text-error-content"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {borrowRequest.status === "approved" ? (
                        <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                      )}
                      <p className="text-sm">{borrowRequest.approvalNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ยืนยันการดำเนินการ */}
              {showConfirm && (
                <div className="md:col-span-2">
                  <div
                    className={`p-4 rounded-lg ${
                      actionType === "approve"
                        ? "bg-success text-success-content"
                        : "bg-error text-error-content"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {actionType === "approve" ? (
                        <InformationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium">
                          {actionType === "approve"
                            ? "ยืนยันการอนุมัติคำขอยืม"
                            : "ยืนยันการปฏิเสธคำขอยืม"}
                        </h4>
                        <p className="text-sm mt-1">
                          {actionType === "approve"
                            ? "คุณกำลังจะอนุมัติคำขอยืมนี้ ระบบจะแจ้งเตือนไปยังผู้ขอยืมทันที"
                            : "คุณกำลังจะปฏิเสธคำขอยืมนี้ ระบบจะแจ้งเตือนไปยังผู้ขอยืมทันที"}
                        </p>
                        {approvalNotes && (
                          <div className="mt-2 p-2 bg-base-100 rounded">
                            <p className="text-xs font-medium">หมายเหตุ:</p>
                            <p className="text-xs">{approvalNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action">
              {!showConfirm ? (
                <>
                  {borrowRequest.status === "pending" && (
                    <>
                      <button
                        className="btn btn-error rounded-xl"
                        onClick={() => handleAction("reject")}
                      >
                        ปฏิเสธ
                      </button>
                      <button
                        className="btn btn-success rounded-xl"
                        onClick={() => handleAction("approve")}
                      >
                        อนุมัติ
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    className="btn"
                    onClick={() => setShowConfirm(false)}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className={`btn ${
                      actionType === "approve" ? "btn-success" : "btn-error"
                    }`}
                    onClick={confirmAction}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        กำลังดำเนินการ...
                      </>
                    ) : actionType === "approve" ? (
                      "ยืนยันการอนุมัติ"
                    ) : (
                      "ยืนยันการปฏิเสธ"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <InformationCircleIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              ไม่พบข้อมูลคำขอยืม
            </h3>
            <div className="modal-action justify-center">
              <button
                className="btn btn-primary"
                onClick={handleClose}
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        {/* Reject Confirmation Dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                    <span>ปฏิเสธคำขอยืม</span>
                  </h3>
                  <button
                    onClick={handleCancelReject}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <MdClose className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-3">
                      โปรดเลือกเหตุผลในการปฏิเสธ
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="space-y-3">
                      {rejectReasonOptions.map((reason) => (
                        <label key={reason} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="rejectReason"
                            value={reason}
                            checked={rejectReason === reason}
                            onChange={() => setRejectReason(reason)}
                            className="radio radio-error mt-0.5"
                          />
                          <span className="text-sm text-gray-700">{reason}</span>
                        </label>
                      ))}
                    </div>
                    {formErrors.rejectReason && !rejectReason && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.rejectReason}</p>
                    )}
                  </div>

                  {/* Additional notes for "Other" reason */}
                  {rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && (
                    <div className="mt-4">
                      <label className="block font-medium text-gray-700 mb-2">
                        ระบุเหตุผลเพิ่มเติม
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="textarea textarea-bordered w-full"
                        placeholder="โปรดระบุเหตุผลในการปฏิเสธ"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        required
                      />
                      {formErrors.rejectReason && rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !approvalNotes.trim() && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.rejectReason}</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={handleCancelReject}
                      className="btn btn-circle bg-gray-200 min-w-[100px] rounded-xl"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmReject}
                      className="btn btn-error min-w-[100px] shadow-sm rounded-xl"
                      disabled={!rejectReason || (rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !approvalNotes.trim())}
                    >
                      ยืนยัน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}