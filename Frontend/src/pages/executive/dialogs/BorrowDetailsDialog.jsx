import {
  ArrowPathIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CubeIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TagIcon,
  UserIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { MdClose } from "react-icons/md";

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
  const [expandedSections, setExpandedSections] = useState({
    requester: true,
    equipment: true,
    timeline: false,
    purpose: true,
    notes: borrowRequest?.approvalNotes ? true : false
  });

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

  const statusIcons = {
    pending: <ClockIcon className="w-4 h-4" />,
    approved: <CheckCircleIcon className="w-4 h-4" />,
    rejected: <XCircleIcon className="w-4 h-4" />,
    borrowing: <ArrowPathIcon className="w-4 h-4" />,
    returned: <DocumentCheckIcon className="w-4 h-4" />
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className={`badge badge-sm gap-1 ${statusBadgeStyle[status]}`}>
      {statusIcons[status]}
      <span>{statusTranslation[status]}</span>
    </div>
  );

  const getDialogTitle = () => {
    const titles = {
      pending: "อนุมัติคำขอยืมอุปกรณ์",
      approved: "รายละเอียดคำขอยืม (อนุมัติแล้ว)",
      rejected: "รายละเอียดคำขอยืม (ปฏิเสธ)",
      borrowing: "รายละเอียดคำขอยืม (กำลังยืม)",
      returned: "รายละเอียดคำขอยืม (คืนแล้ว)"
    };
    return titles[borrowRequest?.status] || "รายละเอียดคำขอยืมอุปกรณ์";
  };

  if (!open) return null;

  const SectionHeader = ({ title, icon, section, isExpanded = true }) => (
    <div 
      className={`flex items-center justify-between ${section ? 'cursor-pointer hover:bg-gray-50 px-2 py-1 rounded' : ''}`} 
      onClick={section ? () => toggleSection(section) : undefined}
    >
      <h4 className="text-xs font-semibold text-gray-500 flex items-center gap-1">
        {icon}
        {title}
      </h4>
      {section && (
        isExpanded ? 
          <ChevronUpIcon className="w-3 h-3 text-gray-500" /> : 
          <ChevronDownIcon className="w-3 h-3 text-gray-500" />
      )}
    </div>
  );

  return (
    <div className="modal modal-open">
      <div data-theme="light" className="modal-box max-w-[90vw] w-[90vw] h-fit max-h-[90vh]">
        {borrowRequest ? (
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      {getDialogTitle()}
                      {renderStatusBadge(borrowRequest.status)}
                    </h2>
                    <p className="text-xs text-gray-500">
                      รหัสคำขอ: <span className="font-medium">{borrowRequest.borrowId || ""}</span>
                      {borrowRequest.requestDate && <span> | วันที่ขอ: {borrowRequest.requestDate}</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-5 flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                {/* ข้อมูลผู้ขอยืมและช่วงเวลา */}
                <div>
                  <SectionHeader 
                    title="ข้อมูลผู้ขอยืม" 
                    icon={<UserIcon className="h-3 w-3" />}
                    section="requester"
                    isExpanded={expandedSections.requester}
                  />
                  
                  {expandedSections.requester && (
                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-md mt-1.5">
                      <div className="avatar">
                        <div className="w-14 rounded-full">
                          <img 
                            src={borrowRequest.requester?.avatar || "/placeholder-user.png"} 
                            alt={borrowRequest.requester?.name} 
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">{borrowRequest.requester?.name}</h5>
                        <p className="text-sm text-gray-500">{borrowRequest.requester?.department}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <SectionHeader 
                      title="ข้อมูลการยืม" 
                      icon={<CalendarIcon className="h-3 w-3" />}
                    />
                    
                    <div className="grid grid-cols-2 gap-3 p-3 bg-base-200 rounded-md mt-1.5 text-sm">
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">วันที่ต้องการยืม:</p>
                        <p className="font-medium text-sm">{borrowRequest.borrowDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">กำหนดคืน:</p>
                        <p className="font-medium text-sm">{borrowRequest.dueDate}</p>
                      </div>
                      {borrowRequest.status === "returned" && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 mb-0.5">วันที่คืน:</p>
                          <p className="font-medium text-sm">{borrowRequest.returnDate || "-"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <SectionHeader 
                      title="วัตถุประสงค์" 
                      icon={<TagIcon className="h-3 w-3" />}
                      section="purpose"
                      isExpanded={expandedSections.purpose}
                    />
                    
                    {expandedSections.purpose && (
                      <div className="p-3 bg-base-200 rounded-md mt-1.5">
                        <p className="text-sm">{borrowRequest.purpose}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <SectionHeader 
                      title="สถานะการดำเนินการ" 
                      icon={<ClockIcon className="h-3 w-3" />}
                      section="timeline"
                      isExpanded={expandedSections.timeline}
                    />
                    
                    {expandedSections.timeline && (
                      <div className="p-3 bg-base-200 rounded-md mt-1.5">
                        <ol className="relative border-l border-gray-300 ml-2.5 text-sm">
                          <li className="mb-2 ml-4">
                            <span className="absolute flex items-center justify-center w-4 h-4 bg-blue-100 rounded-full -left-2 ring-2 ring-white">
                              <CalendarIcon className="w-2 h-2 text-blue-800" />
                            </span>
                            <h3 className="font-medium">ยื่นคำขอยืม</h3>
                            <p className="text-xs text-gray-500">{borrowRequest.requestDate || "-"}</p>
                          </li>
                          
                          {(borrowRequest.status === "approved" || borrowRequest.status === "rejected" || 
                          borrowRequest.status === "borrowing" || borrowRequest.status === "returned") && (
                            <li className="mb-2 ml-4">
                              <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-2 ring-white 
                                ${borrowRequest.status === "rejected" ? "bg-red-100" : "bg-green-100"}`}>
                                {borrowRequest.status === "rejected" ? 
                                  <XCircleIcon className="w-2 h-2 text-red-800" /> : 
                                  <CheckCircleIcon className="w-2 h-2 text-green-800" />
                                }
                              </span>
                              <h3 className="font-medium">
                                {borrowRequest.status === "rejected" ? "ปฏิเสธคำขอ" : "อนุมัติคำขอ"}
                              </h3>
                              <p className="text-xs text-gray-500">{borrowRequest.approvalDate || "-"}</p>
                            </li>
                          )}

                          {(borrowRequest.status === "borrowing" || borrowRequest.status === "returned") && (
                            <li className="mb-2 ml-4">
                              <span className="absolute flex items-center justify-center w-4 h-4 bg-blue-100 rounded-full -left-2 ring-2 ring-white">
                                <ArrowPathIcon className="w-2 h-2 text-blue-800" />
                              </span>
                              <h3 className="font-medium">รับอุปกรณ์</h3>
                              <p className="text-xs text-gray-500">{borrowRequest.borrowDate || "-"}</p>
                            </li>
                          )}

                          {borrowRequest.status === "returned" && (
                            <li className="ml-4">
                              <span className="absolute flex items-center justify-center w-4 h-4 bg-purple-100 rounded-full -left-2 ring-2 ring-white">
                                <DocumentCheckIcon className="w-2 h-2 text-purple-800" />
                              </span>
                              <h3 className="font-medium">คืนอุปกรณ์แล้ว</h3>
                              <p className="text-xs text-gray-500">{borrowRequest.returnDate || "-"}</p>
                            </li>
                          )}
                        </ol>
                      </div>
                    )}
                  </div>
                  
                  {/* หมายเหตุการอนุมัติ */}
                  {borrowRequest.approvalNotes && (
                    <div className="mt-3">
                      <SectionHeader 
                        title="หมายเหตุการอนุมัติ" 
                        icon={<InformationCircleIcon className="h-3 w-3" />}
                        section="notes"
                        isExpanded={expandedSections.notes}
                      />
                      
                      {expandedSections.notes && (
                        <div className="mt-1.5">
                          <div
                            className={`p-3 rounded-md ${
                              borrowRequest.status === "rejected"
                                ? "bg-red-50"
                                : "bg-green-50"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {borrowRequest.status === "rejected" ? (
                                <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-500" />
                              ) : (
                                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                              )}
                              <div>
                                <p className="text-sm mb-1 font-medium">
                                  {borrowRequest.status === "rejected" ? "คำขอถูกปฏิเสธ" : "คำขอได้รับการอนุมัติ"}
                                </p>
                                <p className="text-sm">{borrowRequest.approvalNotes}</p>
                                {borrowRequest.approvalDate && (
                                  <p className="text-xs text-gray-500 mt-2">วันที่: {borrowRequest.approvalDate}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* ข้อมูลอุปกรณ์ */}
                <div>
                  <SectionHeader 
                    title="ข้อมูลอุปกรณ์" 
                    icon={<CubeIcon className="h-3 w-3" />}
                    section="equipment"
                    isExpanded={expandedSections.equipment}
                  />
                  
                  {expandedSections.equipment && (
                    <div className="mt-1">
                      {Array.isArray(borrowRequest?.equipments) ? (
                        <div className="space-y-2">
                          {borrowRequest.equipments.map((equipment, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-md">
                              <img
                                src={equipment?.image || '/placeholder-equipment.png'}
                                alt={equipment?.name || 'Equipment'}
                                className="h-16 w-16 object-contain bg-white p-1.5 rounded"
                              />
                              <div>
                                <h5 className="text-sm font-medium">{equipment?.name || 'ไม่ระบุชื่ออุปกรณ์'}</h5>
                                <p className="text-sm text-gray-500">
                                  {equipment?.code || 'ไม่ระบุรหัส'}{equipment?.category ? ` | ${equipment.category}` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-md">
                          <img
                            src={borrowRequest?.equipment?.image || '/placeholder-equipment.png'}
                            alt={borrowRequest?.equipment?.name || 'Equipment'}
                            className="h-16 w-16 object-contain bg-white p-1.5 rounded"
                          />
                          <div>
                            <h5 className="text-sm font-medium">{borrowRequest?.equipment?.name || 'ไม่ระบุชื่ออุปกรณ์'}</h5>
                            <p className="text-sm text-gray-500">
                              {borrowRequest?.equipment?.code || 'ไม่ระบุรหัส'}{borrowRequest?.equipment?.category ? ` | ${borrowRequest.equipment.category}` : ''}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* ยืนยันการดำเนินการ */}
                  {showConfirm && (
                    <div className="mt-3">
                      <div
                        className={`p-2 rounded-md ${
                          actionType === "approve"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {actionType === "approve" ? (
                            <InformationCircleIcon className="h-4 w-4 flex-shrink-0 text-green-500" />
                          ) : (
                            <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0 text-red-500" />
                          )}
                          <div>
                            <h4 className="text-xs font-medium">
                              {actionType === "approve"
                                ? "ยืนยันการอนุมัติคำขอยืม"
                                : "ยืนยันการปฏิเสธคำขอยืม"}
                            </h4>
                            <p className="text-xs mt-0.5">
                              {actionType === "approve"
                                ? "คุณกำลังจะอนุมัติคำขอยืมนี้"
                                : "คุณกำลังจะปฏิเสธคำขอยืมนี้"}
                            </p>
                            {approvalNotes && (
                              <div className="mt-1 p-1 bg-white rounded text-xs">
                                <p className="font-medium">หมายเหตุ:</p>
                                <p>{approvalNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mt-auto">
              {!showConfirm ? (
                <>
                  {borrowRequest.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-error btn-sm rounded-md px-4"
                        onClick={() => handleAction("reject")}
                      >
                        ปฏิเสธ
                      </button>
                      <button
                        className="btn btn-success btn-sm rounded-md px-4"
                        onClick={() => handleAction("approve")}
                      >
                        อนุมัติ
                      </button>
                    </div>
                  )}
              
                </>
              ) : (
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline btn-sm rounded-md"
                    onClick={() => setShowConfirm(false)}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className={`btn btn-sm ${
                      actionType === "approve" ? "btn-success" : "btn-error"
                    } rounded-md`}
                    onClick={confirmAction}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        กำลังดำเนินการ...
                      </>
                    ) : actionType === "approve" ? (
                      "ยืนยันการอนุมัติ"
                    ) : (
                      "ยืนยันการปฏิเสธ"
                    )}
                  </button>
                </div>
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
                className="btn btn-primary rounded-md btn-sm"
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                    <span>ปฏิเสธคำขอยืม</span>
                  </h3>
                  <button
                    onClick={handleCancelReject}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      โปรดเลือกเหตุผลในการปฏิเสธ
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                      {rejectReasonOptions.map((reason) => (
                        <label key={reason} className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100">
                          <input
                            type="radio"
                            name="rejectReason"
                            value={reason}
                            checked={rejectReason === reason}
                            onChange={() => setRejectReason(reason)}
                            className="radio radio-error radio-sm mt-0.5"
                          />
                          <span className="text-xs text-gray-700">{reason}</span>
                        </label>
                      ))}
                    </div>
                    {formErrors.rejectReason && !rejectReason && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.rejectReason}</p>
                    )}
                  </div>

                  {/* Additional notes for "Other" reason */}
                  {rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ระบุเหตุผลเพิ่มเติม
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        rows={2}
                        className="textarea textarea-bordered w-full text-xs"
                        placeholder="โปรดระบุเหตุผลในการปฏิเสธ"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        required
                      />
                      {formErrors.rejectReason && rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !approvalNotes.trim() && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.rejectReason}</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={handleCancelReject}
                      className="btn btn-outline btn-sm rounded-md"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmReject}
                      className="btn btn-error btn-sm rounded-md"
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