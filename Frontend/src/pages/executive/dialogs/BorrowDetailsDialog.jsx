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
  const [formData, setFormData] = useState({
    approvalNotes: "",
    priority: "medium",
    specialConditions: "",
    assignedTo: ""
  });

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [equipmentAvailability, setEquipmentAvailability] = useState("available");

  const priorityOptions = [
    { value: "low", label: "ต่ำ", color: "bg-blue-50 text-blue-700 border-blue-200", icon: null },
    { value: "medium", label: "ปานกลาง", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: null },
    { value: "high", label: "สูง", color: "bg-orange-50 text-orange-700 border-orange-200", icon: null },
    { value: "urgent", label: "เร่งด่วน", color: "bg-red-50 text-red-700 border-red-200", icon: <ExclamationCircleIcon className="w-4 h-4" /> }
  ];

  const rejectReasonOptions = [
    "อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ",
    "วัตถุประสงค์ไม่เหมาะสม",
    "ระยะเวลาการยืมยาวเกินไป",
    "ผู้ขอยืมมีประวัติการคืนล่าช้า",
    "อื่น ๆ (ระบุในหมายเหตุ)"
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    borrowing: "bg-blue-50 text-blue-700 border-blue-200",
    returned: "bg-purple-50 text-purple-700 border-purple-200"
  };

  useEffect(() => {
    if (borrowRequest) {
      setFormData({
        approvalNotes: "",
        priority: borrowRequest.priority || "medium",
        specialConditions: "",
        assignedTo: ""
      });
      setRejectReason("");
      setFormErrors({});
      checkEquipmentAvailability();
    }
  }, [borrowRequest, open]);

  const checkEquipmentAvailability = () => {
    setTimeout(() => {
      setEquipmentAvailability(Math.random() > 0.3 ? "available" : "unavailable");
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.approvalNotes.trim()) {
      errors.approvalNotes = "กรุณากรอกหมายเหตุการอนุมัติ";
    }

    if (formData.priority === "urgent" && !formData.specialConditions.trim()) {
      errors.specialConditions = "กรุณาระบุเงื่อนไขพิเศษสำหรับคำขอเร่งด่วน";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApprove = () => {
    if (!validateForm()) return;

    if (equipmentAvailability === "unavailable") {
      alert("อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    onApprove({
      ...borrowRequest,
      ...formData,
      approvalStatus: "approved",
      status: "approved",
      approvalDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  const handleShowRejectDialog = () => {
    setShowRejectDialog(true);
  };

  const handleCancelReject = () => {
    setShowRejectDialog(false);
    setRejectReason("");
    setFormErrors({});
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setFormErrors(prev => ({ ...prev, rejectReason: "กรุณากรอกเหตุผลในการปฏิเสธ" }));
      return;
    }

    onReject({
      ...borrowRequest,
      ...formData,
      approvalStatus: "rejected",
      status: "rejected",
      approvalNotes: rejectReason,
      approvalDate: new Date().toISOString().split('T')[0]
    });
    setShowRejectDialog(false);
    onClose();
  };

  if (!open || !borrowRequest) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      {/* Main Dialog */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CubeIcon className="w-6 h-6 text-blue-500" />
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Information Card */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-gray-500" />
              <span>ข้อมูลคำขอยืม</span>
            </h3>

            {equipmentAvailability === "unavailable" && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-3 border border-red-200">
                <ExclamationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                <div>
                  <p className="font-medium">อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ</p>
                  <p className="text-sm mt-1">กรุณาตรวจสอบความพร้อมของอุปกรณ์อีกครั้งก่อนอนุมัติ</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Equipment Info */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                      <img
                        src={borrowRequest.equipment?.image || "/placeholder-equipment.png"}
                        alt={borrowRequest.equipment?.name}
                        className="object-contain w-full h-full p-2"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{borrowRequest.equipment?.name}</h4>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="w-20">รหัสอุปกรณ์:</span>
                        <span className="font-medium text-gray-700">{borrowRequest.equipment?.code || '-'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-20">หมวดหมู่:</span>
                        <span className="font-medium text-gray-700">{borrowRequest.equipment?.category || '-'}</span>
                      </p>
                    </div>
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeStyle[borrowRequest.status || "pending"]}`}>
                        {borrowRequest.status === "pending" ? "รอการอนุมัติ" :
                         borrowRequest.status === "approved" ? "อนุมัติแล้ว" :
                         borrowRequest.status === "rejected" ? "ปฏิเสธ" :
                         borrowRequest.status === "borrowing" ? "กำลังยืม" :
                         "คืนแล้ว"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requester and Dates */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span>ผู้ขอยืม</span>
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={borrowRequest.requester?.avatar || "/placeholder-user.png"}
                            alt={borrowRequest.requester?.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{borrowRequest.requester?.name}</div>
                        <div className="text-sm text-gray-500">{borrowRequest.requester?.department}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <ClockSolid className="w-3 h-3" />
                        <span>วันที่ขอยืม</span>
                      </div>
                      <div className="font-medium text-gray-800">{borrowRequest.requestDate}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <CalendarSolid className="w-3 h-3" />
                        <span>ระยะเวลายืม</span>
                      </div>
                      <div className="font-medium text-gray-800">
                        {borrowRequest.borrowDate} - {borrowRequest.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">วัตถุประสงค์การยืม</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  {borrowRequest.purpose || "-"}
                </p>
              </div>
            </div>

            {borrowRequest.approvalNotes && borrowRequest.status !== "pending" && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">หมายเหตุการอนุมัติ</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    {borrowRequest.approvalNotes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Approval Form */}
          {borrowRequest.status === "pending" && (
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">แบบฟอร์มการอนุมัติ</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Priority */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">ความสำคัญ</label>
                    <div className="grid grid-cols-2 gap-2">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleChange({ target: { name: "priority", value: option.value } })}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all flex items-center justify-center gap-2 ${
                            formData.priority === option.value
                              ? `${option.color} border-transparent shadow-sm`
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {option.icon && <span className="opacity-80">{option.icon}</span>}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label htmlFor="assignedTo" className="block font-medium text-gray-700 mb-2">
                      มอบหมายให้
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="assignedTo"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        placeholder="ระบุชื่อผู้รับผิดชอบ"
                        className="input input-bordered w-full bg-white pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Special Conditions */}
                  {formData.priority === "urgent" && (
                    <div>
                      <label htmlFor="specialConditions" className="block font-medium text-gray-700 mb-2">
                        เงื่อนไขพิเศษ
                        <span className="text-xs font-normal text-gray-500 ml-1">(สำหรับคำขอเร่งด่วน)</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="specialConditions"
                          name="specialConditions"
                          value={formData.specialConditions}
                          onChange={handleChange}
                          rows={3}
                          className={`textarea textarea-bordered w-full bg-white pl-10 ${
                            formErrors.specialConditions ? "textarea-error" : ""
                          }`}
                          placeholder="ระบุเงื่อนไขพิเศษ..."
                        />
                        <div className="absolute top-3 left-3">
                          <ExclamationCircleIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {formErrors.specialConditions && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.specialConditions}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Approval Notes */}
                  <div>
                    <label htmlFor="approvalNotes" className="block font-medium text-gray-700 mb-2">
                      หมายเหตุการอนุมัติ
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="approvalNotes"
                        name="approvalNotes"
                        value={formData.approvalNotes}
                        onChange={handleChange}
                        rows={4}
                        className={`textarea textarea-bordered w-full bg-white pl-10 ${
                          formErrors.approvalNotes ? "textarea-error" : ""
                        }`}
                        placeholder="ระบุหมายเหตุเพิ่มเติม..."
                        required
                      />
                      <div className="absolute top-3 left-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </div>
                    {formErrors.approvalNotes && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.approvalNotes}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={handleShowRejectDialog}
                      className="btn btn-outline btn-error min-w-[120px]"
                    >
                      ปฏิเสธ
                    </button>
                    <button
                      onClick={handleApprove}
                      className="btn btn-primary min-w-[120px] shadow-sm"
                      disabled={equipmentAvailability === "unavailable"}
                    >
                      อนุมัติคำขอ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
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
                      <label key={reason} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          id={`reason-${reason}`}
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
                  {formErrors.rejectReason && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.rejectReason}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCancelReject}
                    className="btn btn-outline min-w-[100px]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    className="btn btn-error min-w-[100px] shadow-sm"
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
  );
}