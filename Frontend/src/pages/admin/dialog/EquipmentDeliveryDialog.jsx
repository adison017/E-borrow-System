import {
    CheckCircleIcon as CheckCircleSolidIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    DocumentCheckIcon,
    PencilSquareIcon,
    QuestionMarkCircleIcon,
    TruckIcon,
    XCircleIcon
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import Webcam from "react-webcam";

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

    const borrowDates = (
        <>
            วันที่ยืม : {borrow.borrow_date}
            <br />
            ถึงวันที่คืน : {borrow.due_date}
        </>
    );

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
        <div className="fixed inset-0 backdrop-blur bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
                        <div className="flex items-center gap-2">
                            <DocumentCheckIcon className="h-7 w-7 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-800">รายละเอียดการส่งมอบครุภัณฑ์</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                {borrow.borrow_code}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content: 2 columns on desktop, stacked on mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left/Main Info (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Transaction ID Box */}
                            <div className="bg-gray-50 rounded-lg p-5 shadow-sm flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-gray-800">รหัสการยืม: {borrow.borrow_code}</p>
                                    <p className="text-sm text-gray-600">จำนวนครุภัณฑ์: {borrow.equipment?.reduce((total, eq) => total + (eq.quantity || 1), 0) || 0} ชิ้น</p>
                                </div>
                            </div>

                            {/* Equipment List */}
                            <div className="rounded-lg overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">รูป</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ครุภัณฑ์</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {borrow.equipment.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-2 py-3 whitespace-nowrap align-middle text-center">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mx-auto">
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
                                                <td className="px-4 py-3 whitespace-nowrap align-middle">
                                                    <span className="font-semibold text-gray-800 text-base">{item.name}</span>
                                                    <div className="text-xs text-gray-500 italic mt-1">{item.code}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right align-middle">
                                                    <span className="font-medium text-blue-700 text-base">{item.quantity || 1}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Borrower & Date Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        ข้อมูลผู้ยืม
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-800 font-medium">{borrow.borrower.name}</p>
                                        <p className="text-sm text-gray-600">{borrow.borrower.department}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        ระยะเวลายืม
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
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
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-800">{borrow.purpose}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right/Signature (1/3) */}
                        <div className="space-y-6 flex flex-col justify-center">
                            {/* Signature Section */}
                            <div className="bg-gradient-to-r h-full from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center mb-5">
                                    <PencilSquareIcon className="w-6 h-6 mr-2 text-blue-600" />
                                    ลายเซ็นรับของ
                                </h3>
                                <p className="text-gray-600 text-xs mb-3 text-center">
                                    กรุณาถ่ายลายเซ็นเพื่อยืนยันการรับมอบครุภัณฑ์
                                </p>
                                {borrow.status === "delivered" ? (
                                    <div className="flex flex-col items-center">
                                        <div className="mb-2 text-green-600 font-medium flex items-center">
                                            <CheckCircleSolidIcon className="w-5 h-5 mr-1" />
                                            <span>ได้รับการลงนามยืนยันแล้ว</span>
                                        </div>
                                        <img
                                            src={borrow.signature || signature}
                                            alt="ลายเซ็นรับของ"
                                            className="h-32 border border-gray-300 rounded-lg bg-white shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {signature ? (
                                            <div className="flex flex-col items-center">
                                                <img 
                                                    src={signature} 
                                                    alt="ลายเซ็นรับของ" 
                                                    className="h-32 border border-gray-300 rounded-lg bg-white shadow-sm mb-2" 
                                                />
                                                <button
                                                    onClick={() => setSignature(null)}
                                                    className="text-red-600 text-xs font-medium hover:text-red-800 flex items-center gap-1"
                                                >
                                                    <XCircleIcon className="w-4 h-4" />
                                                    ลบลายเซ็น
                                                </button>
                                            </div>
                                        ) : showCamera ? (
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden mb-3 shadow-md">
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
                                                        className={`btn btn-primary ${cameraReady ? '' : 'opacity-50'}`}
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
                                                className="btn btn-primary px-6 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                                ถ่ายลายเซ็น
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end space-x-2 pt-4">
                        {borrow.status === "delivered" ? (
                            <button
                                onClick={onClose}
                                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2.5 rounded-lg transition-all"
                            >
                                ปิด
                            </button>
                        ) : (
                            <button
                                onClick={handleDelivery}
                                className={`btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all ${isDeliveryButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isDeliveryButtonDisabled}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังดำเนินการ...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <CheckCircleSolidIcon className="w-5 h-5" />
                                        ยืนยันการส่งมอบ
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDeliveryDialog;