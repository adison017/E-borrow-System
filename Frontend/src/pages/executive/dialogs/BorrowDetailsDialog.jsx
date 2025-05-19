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
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    borrowing: "bg-blue-100 text-blue-800 border-blue-200",
    returned: "bg-indigo-100 text-indigo-800 border-indigo-200"
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
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadgeStyle[status]}`}>
      <span className="mr-1">{statusIcons[status]}</span>
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
      className={`flex items-center justify-between ${section ? 'cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition-colors duration-150' : ''}`} 
      onClick={section ? () => toggleSection(section) : undefined}
    >
      <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
        <span className="text-gray-500">{icon}</span>
        {title}
      </h4>
      {section && (
        isExpanded ? 
          <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : 
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      )}
    </div>
  );

  return (
    <div className="modal modal-open">
      <div data-theme="light" className="modal-box max-w-[90vw] w-[90vw] h-fit max-h-[90vh] rounded-lg shadow-xl">
        {borrowRequest ? (
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-white z-10 pb-3 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      {getDialogTitle()}
                      {renderStatusBadge(borrowRequest.status)}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      รหัสคำขอ: <span className="font-medium">{borrowRequest.borrowId || ""}</span>
                      {borrowRequest.requestDate && <span> | วันที่ขอ: {borrowRequest.requestDate}</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-150"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6 flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* ข้อมูลผู้ขอยืมและช่วงเวลา */}
                <div>
                  <SectionHeader 
                    title="ข้อมูลผู้ขอยืม" 
                    icon={<UserIcon className="h-4 w-4" />}
                    section="requester"
                    isExpanded={expandedSections.requester}
                  />
                  
                  {expandedSections.requester && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mt-2 shadow-sm">
                      <div className="avatar">
                        <div className="w-14 rounded-full ring-2 ring-white shadow">
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
                  
                  <div className="mt-4">
                    <SectionHeader 
                      title="ข้อมูลการยืม" 
                      icon={<CalendarIcon className="h-4 w-4" />}
                    />
                    
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mt-2 shadow-sm">
                      <div className="border-r border-gray-200 pr-4">
                        <p className="text-sm text-gray-500 mb-1">วันที่ต้องการยืม:</p>
                        <p className="font-medium text-sm">{borrowRequest.borrowDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">กำหนดคืน:</p>
                        <p className="font-medium text-sm">{borrowRequest.dueDate}</p>
                      </div>
                      {borrowRequest.status === "returned" && (
                        <div className="col-span-2 pt-2 mt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">วันที่คืน:</p>
                          <p className="font-medium text-sm">{borrowRequest.returnDate || "-"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <SectionHeader 
                      title="วัตถุประสงค์" 
                      icon={<TagIcon className="h-4 w-4" />}
                      section="purpose"
                      isExpanded={expandedSections.purpose}
                    />
                    
                    {expandedSections.purpose && (
                      <div className="p-4 bg-gray-50 rounded-lg mt-2 shadow-sm">
                        <p className="text-sm leading-relaxed">{borrowRequest.purpose}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <SectionHeader 
                      title="สถานะการดำเนินการ" 
                      icon={<ClockIcon className="h-4 w-4" />}
                      section="timeline"
                      isExpanded={expandedSections.timeline}
                    />
                    
                    {expandedSections.timeline && (
                      <div className="p-4 bg-gray-50 rounded-lg mt-2 shadow-sm">
                        <ol className="relative border-l-2 border-gray-300 ml-2.5 text-sm">
                          <li className="mb-4 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white">
                              <CalendarIcon className="w-3 h-3 text-blue-800" />
                            </span>
                            <h3 className="font-medium text-gray-900">ยื่นคำขอยืม</h3>
                            <p className="text-xs text-gray-500 mt-1">{borrowRequest.requestDate || "-"}</p>
                          </li>
                          
                          {(borrowRequest.status === "approved" || borrowRequest.status === "rejected" || 
                          borrowRequest.status === "borrowing" || borrowRequest.status === "returned") && (
                            <li className="mb-4 ml-6">
                              <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white 
                                ${borrowRequest.status === "rejected" ? "bg-red-100" : "bg-green-100"}`}>
                                {borrowRequest.status === "rejected" ? 
                                  <XCircleIcon className="w-3 h-3 text-red-800" /> : 
                                  <CheckCircleIcon className="w-3 h-3 text-green-800" />
                                }
                              </span>
                              <h3 className="font-medium text-gray-900">
                                {borrowRequest.status === "rejected" ? "ปฏิเสธคำขอ" : "อนุมัติคำขอ"}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">{borrowRequest.approvalDate || "-"}</p>
                            </li>
                          )}

                          {(borrowRequest.status === "borrowing" || borrowRequest.status === "returned") && (
                            <li className="mb-4 ml-6">
                              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white">
                                <ArrowPathIcon className="w-3 h-3 text-blue-800" />
                              </span>
                              <h3 className="font-medium text-gray-900">รับอุปกรณ์</h3>
                              <p className="text-xs text-gray-500 mt-1">{borrowRequest.borrowDate || "-"}</p>
                            </li>
                          )}

                          {borrowRequest.status === "returned" && (
                            <li className="ml-6">
                              <span className="absolute flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full -left-3 ring-4 ring-white">
                                <DocumentCheckIcon className="w-3 h-3 text-purple-800" />
                              </span>
                              <h3 className="font-medium text-gray-900">คืนอุปกรณ์แล้ว</h3>
                              <p className="text-xs text-gray-500 mt-1">{borrowRequest.returnDate || "-"}</p>
                            </li>
                          )}
                        </ol>
                      </div>
                    )}
                  </div>
                  
                  {/* หมายเหตุการอนุมัติ */}
                  {borrowRequest.approvalNotes && (
                    <div className="mt-4">
                      <SectionHeader 
                        title="หมายเหตุการอนุมัติ" 
                        icon={<InformationCircleIcon className="h-4 w-4" />}
                        section="notes"
                        isExpanded={expandedSections.notes}
                      />
                      
                      {expandedSections.notes && (
                        <div className="mt-2">
                          <div
                            className={`p-4 rounded-lg shadow-sm ${
                              borrowRequest.status === "rejected"
                                ? "bg-red-50 border border-red-100"
                                : "bg-green-50 border border-green-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {borrowRequest.status === "rejected" ? (
                                <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                              ) : (
                                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm mb-2 font-medium">
                                  {borrowRequest.status === "rejected" ? "คำขอถูกปฏิเสธ" : "คำขอได้รับการอนุมัติ"}
                                </p>
                                <p className="text-sm leading-relaxed">{borrowRequest.approvalNotes}</p>
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
                    icon={<CubeIcon className="h-4 w-4" />}
                    section="equipment"
                    isExpanded={expandedSections.equipment}
                  />
                  
                  {expandedSections.equipment && (
                    <div className="mt-2">
                      {Array.isArray(borrowRequest?.equipments) ? (
                        <div className="space-y-3">
                          {borrowRequest.equipments.map((equipment, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                              <div className="bg-white p-2 rounded-md shadow-sm">
                                <img
                                  src={equipment?.image || '/placeholder-equipment.png'}
                                  alt={equipment?.name || 'Equipment'}
                                  className="h-16 w-16 object-contain"
                                />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">{equipment?.name || 'ไม่ระบุชื่ออุปกรณ์'}</h5>
                                <p className="text-sm text-gray-500 mt-1">
                                  {equipment?.code || 'ไม่ระบุรหัส'}{equipment?.category ? ` | ${equipment.category}` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                          <div className="bg-white p-2 rounded-md shadow-sm">
                            <img
                              src={borrowRequest?.equipment?.image || '/placeholder-equipment.png'}
                              alt={borrowRequest?.equipment?.name || 'Equipment'}
                              className="h-16 w-16 object-contain"
                            />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium">{borrowRequest?.equipment?.name || 'ไม่ระบุชื่ออุปกรณ์'}</h5>
                            <p className="text-sm text-gray-500 mt-1">
                              {borrowRequest?.equipment?.code || 'ไม่ระบุรหัส'}{borrowRequest?.equipment?.category ? ` | ${borrowRequest.equipment.category}` : ''}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* ยืนยันการดำเนินการ */}
                  {showConfirm && (
                    <div className="mt-6">
                      <div
                        className={`p-4 rounded-lg shadow-sm ${
                          actionType === "approve"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {actionType === "approve" ? (
                            <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                          ) : (
                            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                          )}
                          <div>
                            <h4 className="text-sm font-medium">
                              {actionType === "approve"
                                ? "ยืนยันการอนุมัติคำขอยืม"
                                : "ยืนยันการปฏิเสธคำขอยืม"}
                            </h4>
                            <p className="text-sm mt-1">
                              {actionType === "approve"
                                ? "คุณกำลังจะอนุมัติคำขอยืมนี้"
                                : "คุณกำลังจะปฏิเสธคำขอยืมนี้"}
                            </p>
                            {approvalNotes && (
                              <div className="mt-3 p-2 bg-white rounded text-sm border border-gray-200">
                                <p className="font-medium">หมายเหตุ:</p>
                                <p className="mt-1">{approvalNotes}</p>
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

            <div className="border-t border-gray-200 pt-4 mt-auto px-6 pb-2">
              {!showConfirm ? (
                <>
                  {borrowRequest.status === "pending" && (
                    <div className="flex justify-end gap-3">
                      <button
                        className="px-4 py-2 rounded-md bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors duration-150 flex items-center gap-1"
                        onClick={() => handleAction("reject")}
                      >
                        <XCircleIcon className="w-5 h-5" />
                        ปฏิเสธ
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-150 flex items-center gap-1"
                        onClick={() => handleAction("approve")}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        อนุมัติ
                      </button>
                    </div>
                  )}
              
                </>
              ) : (
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setShowConfirm(false)}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md font-medium text-white transition-colors duration-150 flex items-center gap-1
                      ${actionType === "approve" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-red-600 hover:bg-red-700"
                      }`}
                    onClick={confirmAction}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        กำลังดำเนินการ...
                      </>
                    ) : actionType === "approve" ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        ยืนยันการอนุมัติ
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5" />
                        ยืนยันการปฏิเสธ
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
              <InformationCircleIcon
                className="h-8 w-8 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-3 text-md font-medium text-gray-900">
              ไม่พบข้อมูลคำขอยืม
            </h3>
            <div className="mt-6">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-150"
                onClick={handleClose}
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        {/* Reject Confirmation Dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                    <span>ปฏิเสธคำขอยืม</span>
                  </h3>
                  <button
                    onClick={handleCancelReject}
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-150"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      โปรดเลือกเหตุผลในการปฏิเสธ
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 rounded-md border border-gray-200 divide-y">
                      {rejectReasonOptions.map((reason) => (
                        <label 
                          key={reason} 
                          className={`flex items-start gap-3 p-3 cursor-pointer transition-colors duration-150
                            ${rejectReason === reason ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                        >
                          <input
                            type="radio"
                            name="rejectReason"
                            value={reason}
                            checked={rejectReason === reason}
                            onChange={() => setRejectReason(reason)}
                            className="mt-0.5"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ระบุเหตุผลเพิ่มเติม
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
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

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleCancelReject}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmReject}
                      className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors duration-150 flex items-center gap-1"
                      disabled={!rejectReason || (rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !approvalNotes.trim())}
                    >
                      <XCircleIcon className="w-5 h-5" />
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