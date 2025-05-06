import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationCircleIcon
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
    { value: "low", label: "ต่ำ", color: "bg-blue-100 text-blue-800" },
    { value: "medium", label: "ปานกลาง", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "สูง", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "เร่งด่วน", color: "bg-red-100 text-red-800" }
  ];

  const rejectReasonOptions = [
    "อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ",
    "วัตถุประสงค์ไม่เหมาะสม",
    "ระยะเวลาการยืมยาวเกินไป",
    "ผู้ขอยืมมีประวัติการคืนล่าช้า",
    "อื่น ๆ (ระบุในหมายเหตุ)"
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    borrowing: "bg-blue-100 text-blue-800",
    returned: "bg-purple-100 text-purple-800"
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

      // Check equipment availability (mock - replace with actual API call)
      checkEquipmentAvailability();
    }
  }, [borrowRequest, open]);

  const checkEquipmentAvailability = () => {
    // Mock availability check
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

    // Clear error when field is changed
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
    <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">อนุมัติคำขอยืมอุปกรณ์</h2>
              <p className="text-gray-500 text-sm">
                รหัสคำขอ: {borrowRequest.borrowId || ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* ข้อมูลคำขอยืม */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">ข้อมูลคำขอยืม</h3>

              {equipmentAvailability === "unavailable" && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ</p>
                    <p className="text-sm">กรุณาตรวจสอบความพร้อมของอุปกรณ์อีกครั้งก่อนอนุมัติ</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-4">
                    <div className="avatar">
                      <div className="w-20 rounded">
                        <img
                          src={borrowRequest.equipment?.image || "/placeholder-equipment.png"}
                          alt={borrowRequest.equipment?.name}
                          className="object-contain bg-white p-1 border border-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{borrowRequest.equipment?.name}</div>
                      <div className="text-sm text-gray-500">รหัส: {borrowRequest.equipment?.code}</div>
                      <div className="text-sm text-gray-500">หมวดหมู่: {borrowRequest.equipment?.category}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-md text-xs ${statusBadgeStyle[borrowRequest.status || "pending"]}`}>
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

                <div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={borrowRequest.requester?.avatar || "/placeholder-user.png"}
                            alt={borrowRequest.requester?.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{borrowRequest.requester?.name}</div>
                        <div className="text-sm text-gray-500">{borrowRequest.requester?.department}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                      <div>
                        <div className="text-gray-500">วันที่ขอยืม</div>
                        <div>{borrowRequest.requestDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">ระยะเวลายืม</div>
                        <div>{borrowRequest.borrowDate} ถึง {borrowRequest.dueDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-sm mb-1">วัตถุประสงค์การยืม</h4>
                <p className="text-gray-700 text-sm bg-white p-3 rounded-md border border-gray-200">
                  {borrowRequest.purpose || "-"}
                </p>
              </div>

              {borrowRequest.approvalNotes && borrowRequest.status !== "pending" && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-1">หมายเหตุการอนุมัติ</h4>
                  <p className="text-gray-700 text-sm bg-white p-3 rounded-md border border-gray-200">
                    {borrowRequest.approvalNotes}
                  </p>
                </div>
              )}
            </div>

            {/* ฟอร์มการอนุมัติ */}
            {borrowRequest.status === "pending" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">ความสำคัญ</label>
                    <div className="flex flex-wrap gap-2">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleChange({ target: { name: "priority", value: option.value } })}
                          className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                            formData.priority === option.value
                              ? `${option.color} border-transparent`
                              : "bg-white border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="assignedTo" className="block font-medium text-gray-700 mb-1">
                      มอบหมายให้
                    </label>
                    <input
                      type="text"
                      id="assignedTo"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      placeholder="ชื่อผู้รับผิดชอบ"
                      className="input input-bordered w-full bg-white"
                    />
                  </div>

                  {formData.priority === "urgent" && (
                    <div>
                      <label htmlFor="specialConditions" className="block font-medium text-gray-700 mb-1">
                        เงื่อนไขพิเศษ (สำหรับคำขอเร่งด่วน)
                      </label>
                      <textarea
                        id="specialConditions"
                        name="specialConditions"
                        value={formData.specialConditions}
                        onChange={handleChange}
                        rows={3}
                        className={`textarea textarea-bordered w-full bg-white ${
                          formErrors.specialConditions ? "textarea-error" : ""
                        }`}
                        placeholder="ระบุเงื่อนไขพิเศษ..."
                      />
                      {formErrors.specialConditions && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.specialConditions}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="approvalNotes" className="block font-medium text-gray-700 mb-1">
                      หมายเหตุการอนุมัติ
                    </label>
                    <textarea
                      id="approvalNotes"
                      name="approvalNotes"
                      value={formData.approvalNotes}
                      onChange={handleChange}
                      rows={4}
                      className={`textarea textarea-bordered w-full bg-white ${
                        formErrors.approvalNotes ? "textarea-error" : ""
                      }`}
                      placeholder="ระบุหมายเหตุเพิ่มเติม..."
                      required
                    />
                    {formErrors.approvalNotes && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.approvalNotes}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleShowRejectDialog}
                      className="btn btn-outline btn-error"
                    >
                      ปฏิเสธ
                    </button>
                    <button
                      onClick={handleApprove}
                      className="btn btn-primary"
                      disabled={equipmentAvailability === "unavailable"}
                    >
                      อนุมัติคำขอ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">ปฏิเสธคำขอยืม</h3>
                <button
                  onClick={handleCancelReject}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    เหตุผลในการปฏิเสธ
                  </label>
                  <div className="space-y-2">
                    {rejectReasonOptions.map((reason) => (
                      <div key={reason} className="flex items-center">
                        <input
                          type="radio"
                          id={`reason-${reason}`}
                          name="rejectReason"
                          value={reason}
                          checked={rejectReason === reason}
                          onChange={() => setRejectReason(reason)}
                          className="radio radio-sm radio-error mr-2"
                        />
                        <label htmlFor={`reason-${reason}`} className="text-sm">
                          {reason}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formErrors.rejectReason && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.rejectReason}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleCancelReject}
                    className="btn btn-outline"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    className="btn btn-error"
                  >
                    ยืนยันการปฏิเสธ
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