import {
    CheckCircleIcon as CheckCircleSolidIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    ArrowPathIcon,
    XCircleIcon,
    DocumentCheckIcon,
    ClipboardDocumentListIcon,
    TruckIcon,
    QuestionMarkCircleIcon
} from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { MdClose } from "react-icons/md";

const EquipmentDeliveryDialog = ({ borrow, isOpen, onClose, onConfirm }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryNote, setDeliveryNote] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [signature, setSignature] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const webcamRef = useRef(null);

    useEffect(() => {
        if (isOpen && borrow) {
            setDeliveryNote("");
            if (borrow.status === "delivered" && borrow.signature) {
                setSignature(borrow.signature);
            } else {
                setSignature(null);
            }
            setShowCamera(false);
        }
    }, [isOpen, borrow]);

    if (!isOpen || !borrow) return null;

    const borrowDates = `${borrow.borrow_date} ถึง ${borrow.due_date}`;

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-base font-semibold transition-all";

        switch (status) {
            case "delivered":
                return (
                    <div className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
                        <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
                        <span>ส่งมอบแล้ว</span>
                        <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                );
            case "pending_delivery":
                return (
                    <div className={`${baseClasses} bg-amber-100 text-amber-800 border border-amber-200`}>
                        <ClockIcon className="w-6 h-6 text-amber-600" />
                        <span>รอส่งมอบ</span>
                        <div className="absolute -right-1 -top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                );
            case "cancelled":
                return (
                    <div className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
                        <XCircleIcon className="w-6 h-6 text-red-600" />
                        <span>ยกเลิกแล้ว</span>
                    </div>
                );
            case "in_transit":
                return (
                    <div className={`${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`}>
                        <TruckIcon className="w-6 h-6 text-blue-600" />
                        <span>กำลังขนส่ง</span>
                        <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-ping"></div>
                    </div>
                );
            default:
                return (
                    <div className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
                        <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600" />
                        <span>ไม่ทราบสถานะ</span>
                    </div>
                );
        }
    };

    const captureSignature = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setSignature(imageSrc);
            setShowCamera(false);
        }
    };

    const handleDelivery = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm({
                borrowItem: borrow,
                deliveryNote,
                signature
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDeliveryButtonDisabled = borrow.status === "delivered" || isSubmitting || !signature;

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-800">รายละเอียดการส่งมอบครุภัณฑ์</h2>
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
                        {/* Transaction ID Box */}
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-gray-700">รหัสการยืม: {borrow.borrow_code}</p>
                                    <p className="text-sm text-gray-600">จำนวนครุภัณฑ์: {borrow.equipment?.length || 1} ชิ้น</p>
                                </div>
                            </div>
                        </div>

                        {/* Equipment List */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ครุภัณฑ์</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Array.isArray(borrow.equipment) ? (
                                        borrow.equipment.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.code}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{borrow.equipment.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{borrow.equipment.code}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Borrower Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">ข้อมูลผู้ยืม</h3>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-800">{borrow.borrower.name}</p>
                                    <p className="text-sm text-gray-600">{borrow.borrower.department}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">ระยะเวลายืม</h3>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-800">{borrowDates}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reason for Borrowing */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                <ClipboardDocumentListIcon className="h-5 w-5 mr-1 text-blue-600" />
                                เหตุผลในการยืม
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-800">{borrow.purpose}</p>
                            </div>
                        </div>

                        {/* Delivery Note */}
                        <div>
                            <label htmlFor="deliveryNote" className="block font-semibold text-gray-700 mb-2">
                                หมายเหตุการส่งมอบ
                            </label>
                            <textarea
                                id="deliveryNote"
                                className="textarea textarea-bordered w-full resize-none bg-white"
                                rows="3"
                                placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                                value={deliveryNote}
                                onChange={(e) => setDeliveryNote(e.target.value)}
                                disabled={borrow.status === "delivered"}
                            ></textarea>
                        </div>

                        {/* Signature Section */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">ลายเซ็นรับของ</h3>
                            {borrow.status === "delivered" ? (
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-green-600 font-medium flex items-center">
                                        <CheckCircleSolidIcon className="w-5 h-5 mr-1" />
                                        <span>ได้รับการลงนามยืนยันแล้ว</span>
                                    </div>
                                    <img
                                        src={borrow.signature || signature}
                                        alt="ลายเซ็นรับของ"
                                        className="h-32 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <>
                                    {signature ? (
                                        <div className="flex flex-col items-center">
                                            <img src={signature} alt="ลายเซ็นรับของ" className="h-32 border border-gray-300 rounded-lg mb-2" />
                                            <button
                                                onClick={() => setSignature(null)}
                                                className="text-red-600 text-sm font-medium hover:text-red-800"
                                            >
                                                ลบลายเซ็น
                                            </button>
                                        </div>
                                    ) : showCamera ? (
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-2">
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    videoConstraints={{ facingMode: "user" }}
                                                    onUserMedia={() => setCameraReady(true)}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={captureSignature}
                                                    disabled={!cameraReady}
                                                    className={`btn btn-primary ${cameraReady ? '' : 'btn-disabled'}`}
                                                >
                                                    ถ่ายภาพ
                                                </button>
                                                <button
                                                    onClick={() => setShowCamera(false)}
                                                    className="btn btn-outline"
                                                >
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowCamera(true)}
                                            className="btn btn-primary w-full mt-2"
                                        >
                                            ถ่ายลายเซ็น
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex justify-center">
                            <div className="card bg-gray-100 border border-gray-200 w-full max-w-lg p-6">
                                <div className="card-body items-center text-center">
                                    <h3 className="text-2xl font-bold text-gray-700 mb-4">สถานะการดำเนินการ</h3>
                                    <div className="mt-2">{getStatusBadge(borrow.status)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-action mt-6 flex justify-end space-x-2 border-t pt-4">
                        {borrow.status === "delivered" ? (
                            <button
                                onClick={onClose}
                                className="btn btn-neutral"
                            >
                                ปิด
                            </button>
                        ) : (
                            <button
                                onClick={handleDelivery}
                                className={`btn btn-primary ${isDeliveryButtonDisabled ? 'btn-disabled' : ''}`}
                                disabled={isDeliveryButtonDisabled}
                            >
                                ยืนยันการส่งมอบ
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDeliveryDialog;