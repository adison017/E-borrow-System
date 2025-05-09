import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { CheckCircleIcon, XCircleIcon, ClockIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export default function RepairApprovalDialog({
  open,
  onClose,
  repairRequest,
  onApprove,
  onReject
}) {
  const [formData, setFormData] = useState({
    approvalStatus: "",
    approvalNotes: "",
    budgetApproved: 0,
    priority: "medium",
    assignedTo: "",
    estimatedCompletionDate: ""
  });

  const priorityOptions = [
    { value: "low", label: "ต่ำ", color: "bg-blue-100 text-blue-800" },
    { value: "medium", label: "ปานกลาง", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "สูง", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "เร่งด่วน", color: "bg-red-100 text-red-800" }
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    inprogress: "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800"
  };

  useEffect(() => {
    if (repairRequest) {
      setFormData({
        approvalStatus: "",
        approvalNotes: "",
        budgetApproved: repairRequest.estimatedCost || 0,
        priority: "medium",
        assignedTo: "",
        estimatedCompletionDate: ""
      });
    }
  }, [repairRequest, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "budgetApproved" ? parseFloat(value) || 0 : value
    }));
  };

  const handleApprove = () => {
    onApprove({
      ...repairRequest,
      ...formData,
      approvalStatus: "approved",
      approvalDate: new Date().toISOString()
    });
    onClose();
  };

  const handleReject = () => {
    onReject({
      ...repairRequest,
      ...formData,
      approvalStatus: "rejected",
      approvalDate: new Date().toISOString()
    });
    onClose();
  };

  if (!open || !repairRequest) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">อนุมัติคำขอแจ้งซ่อม</h2>
              <p className="text-gray-500 text-sm">
                รหัสคำขอ: {repairRequest.requestId || ""}
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
            {/* ข้อมูลคำขอแจ้งซ่อม */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">ข้อมูลคำขอแจ้งซ่อม</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-4">
                    <div className="avatar">
                      <div className="w-20 rounded">
                        <img src={repairRequest.equipment?.image || "/placeholder-equipment.png"} alt={repairRequest.equipment?.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{repairRequest.equipment?.name}</div>
                      <div className="text-sm text-gray-500">รหัส: {repairRequest.equipment?.code}</div>
                      <div className="text-sm text-gray-500">หมวดหมู่: {repairRequest.equipment?.category}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-md text-xs ${statusBadgeStyle[repairRequest.status || "pending"]}`}>
                          {repairRequest.status === "pending" ? "รอการอนุมัติ" :
                           repairRequest.status === "approved" ? "อนุมัติแล้ว" :
                           repairRequest.status === "rejected" ? "ปฏิเสธ" :
                           repairRequest.status === "inprogress" ? "กำลังซ่อม" :
                           "เสร็จสิ้น"}
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
                          <img src={repairRequest.requester?.avatar || "/placeholder-user.png"} alt={repairRequest.requester?.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{repairRequest.requester?.name}</div>
                        <div className="text-sm text-gray-500">{repairRequest.requester?.department}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                      <div>
                        <div className="text-gray-500">วันที่แจ้งซ่อม</div>
                        <div>{repairRequest.requestDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">ประมาณการค่าใช้จ่าย</div>
                        <div>{repairRequest.estimatedCost?.toLocaleString() || 0} บาท</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-sm mb-1">รายละเอียดการแจ้งซ่อม</h4>
                <p className="text-gray-700 text-sm bg-white p-3 rounded-md border border-gray-200">{repairRequest.description || "-"}</p>
              </div>

              {repairRequest.images && repairRequest.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-1">รูปภาพประกอบ</h4>
                  <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                    {repairRequest.images.map((img, index) => (
                      <div key={index} className="w-24 h-24 rounded-md overflow-hidden">
                        <img src={img} alt={`ภาพที่ ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ฟอร์มการอนุมัติ */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">ความสำคัญ</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-white border-cyan-500 text-base"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">งบประมาณที่อนุมัติ (บาท)</label>
                  <input
                    type="number"
                    name="budgetApproved"
                    value={formData.budgetApproved}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white border-cyan-500 text-base"
                    placeholder="ระบุงบประมาณที่อนุมัติ"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">มอบหมายให้</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white border-cyan-500 text-base"
                    placeholder="ระบุชื่อผู้รับผิดชอบ"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">กำหนดวันที่แล้วเสร็จ</label>
                  <input
                    type="date"
                    name="estimatedCompletionDate"
                    value={formData.estimatedCompletionDate}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white border-cyan-500 text-base"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">หมายเหตุ</label>
                  <textarea
                    name="approvalNotes"
                    value={formData.approvalNotes}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full bg-white border-cyan-500 text-base"
                    placeholder="ระบุหมายเหตุหรือเงื่อนไขการอนุมัติ"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-action mt-6 flex justify-end space-x-2 border-t pt-4">
            <button
              className="btn btn-outline btn-base px-4 py-1 text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              className="btn btn-error btn-base text-white flex items-center gap-1"
              onClick={handleReject}
            >
              <XCircleIcon className="w-5 h-5" />
              ปฏิเสธ
            </button>
            <button
              className="btn btn-success btn-base text-white flex items-center gap-1"
              onClick={handleApprove}
            >
              <CheckCircleIcon className="w-5 h-5" />
              อนุมัติ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}