import {
  ArrowPathIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentTextIcon,
  UserCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const BorrowDetailsDialog = ({ borrow, isOpen, onClose, onApprove, onReject }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectReason, setShowRejectReason] = useState(false);

    // Reset rejectReason and showRejectReason when dialog is opened
    useEffect(() => {
        if (isOpen) {
            setRejectReason("");
            setShowRejectReason(false);
        }
    }, [isOpen]);

    if (!isOpen || !borrow) return null;

    const borrowDates = `${borrow.borrow_date} ถึง ${borrow.due_date}`;
    
    // Convert single equipment to array if needed
    const equipmentItems = Array.isArray(borrow.equipment) 
        ? borrow.equipment 
        : [borrow.equipment];

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-green-700 text-sm font-medium">
                        <CheckCircleSolidIcon className="w-4 h-4" /> อนุมัติ/กำลังยืม
                    </div>
                );
            case "pending_approval":
                return (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-blue-700 text-sm font-medium">
                        <ClockIcon className="w-4 h-4" /> รออนุมัติ
                    </div>
                );
            case "under_review":
                return (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-amber-700 text-sm font-medium">
                        <ArrowPathIcon className="w-4 h-4" /> รอตรวจสอบ
                    </div>
                );
            case "rejected":
                return (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-red-700 text-sm font-medium">
                        <XCircleIcon className="w-4 h-4" /> ไม่อนุมัติ
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 text-sm font-medium">
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
            alert("กรุณาระบุเหตุผลที่ไม่อนุมัติ");
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

    // Equipment item component
    const EquipmentItem = ({ equipment }) => (
        <div className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 shadow-sm">
                {equipment.image ? (
                    <img
                        src={equipment.image}
                        alt={equipment.name}
                        className="max-w-full max-h-full object-contain p-1"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/lo.png"; // Default fallback image
                        }}
                    />
                ) : (
                    <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <p className="text-base font-semibold text-gray-800">{equipment.name}</p>
                <p className="text-sm text-gray-500 mt-1">รหัสครุภัณฑ์: <span className="font-medium text-gray-700">{equipment.code}</span></p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    {equipment.quantity > 1 && (
                        <p className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-medium">
                            จำนวน: {equipment.quantity} ชิ้น
                        </p>
                    )}
                    {equipment.status && (
                        <span className={`px-2.5 py-0.5 inline-flex items-center justify-center text-xs font-medium rounded-full ${
                            equipment.status === "available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-amber-100 text-amber-800"
                        }`}>
                            {equipment.status === "available" ? "พร้อมใช้งาน" : "ถูกยืม"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        isOpen && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-3 md:p-5 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl transform transition-all duration-300 max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2.5 rounded-lg shadow-sm">
                                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    รายละเอียดการยืมครุภัณฑ์
                                </h2>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    รหัส: {borrow.borrow_code}
                                </span>
                                {getStatusBadge(borrow.status)}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
                        >
                            <MdClose className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                            {/* Left side: Borrower info */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Borrower card */}
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg shadow-sm">
                                                <UserCircleIcon className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                ข้อมูลผู้ยืม
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1.5 flex items-center gap-4">
                                                {borrow.borrower?.avatar && (
                                                    <img
                                                        src={borrow.borrower.avatar}
                                                        alt={borrow.borrower.name}
                                                        className="w-14 h-14 rounded-full border border-gray-200 shadow-sm object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">ชื่อผู้ขอยืม</p>
                                                    <p className="text-gray-800 font-semibold">{borrow.borrower.name}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-sm text-gray-500 font-medium">แผนก</p>
                                                <p className="text-gray-800 font-semibold">{borrow.borrower.department}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-sm text-gray-500 font-medium">ระยะเวลายืม</p>
                                                <p className="text-gray-800 font-semibold">{borrowDates}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-sm text-gray-500 font-medium">วัตถุประสงค์</p>
                                                <p className="text-gray-800 font-semibold">{borrow.purpose}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes if available */}
                                {borrow.notes && (
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-amber-100 p-2 rounded-lg shadow-sm">
                                                    <ClipboardDocumentListIcon className="h-5 w-5 text-amber-600" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    หมายเหตุ
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-700">{borrow.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Rejection reason input */}
                                {showRejectReason && (
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-5 py-4 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-100 p-2 rounded-lg shadow-sm">
                                                    <XCircleIcon className="h-5 w-5 text-red-600" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    เหตุผลที่ไม่อนุมัติ
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <textarea
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                                rows={3}
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="ระบุเหตุผลที่ไม่อนุมัติ..."
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right side: Equipment list */}
                            <div className="md:col-span-1">
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col sticky top-0">
                                    <div className="bg-gradient-to-r from-green-50 to-teal-50 px-5 py-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                รายการครุภัณฑ์ที่ยืม
                                            </h3>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">จำนวนรายการ: {equipmentItems.length}</span>
                                                <span className="text-sm text-gray-500 mt-0.5">
                                                    รวมทั้งสิ้น: {equipmentItems.reduce((total, eq) => total + (eq.quantity || 1), 0)} ชิ้น
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-x-auto bg-gray-50 p-4">
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
                                                                    {item.image || item.pic ? (
                                                                        <img
                                                                            src={item.image || item.pic}
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
                        </div>
                    </div>

                    {/* Footer with action buttons */}
                    {borrow.status === "under_review" && (
                        <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
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
                                        className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm"
                                        onClick={() => setShowRejectReason(true)}
                                    >
                                        <XCircleIcon className="h-5 w-5 mr-2" />
                                        ไม่อนุมัติ
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm disabled:opacity-70"
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
                                                ยืนยันไม่อนุมัติ
                                            </>
                                        )}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm disabled:opacity-70"
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
        )
    );
};

export default BorrowDetailsDialog;