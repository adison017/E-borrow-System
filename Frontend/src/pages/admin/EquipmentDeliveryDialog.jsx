import { 
    CheckCircleIcon as CheckCircleSolidIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    ArrowPathIcon,
    XCircleIcon,
    DocumentCheckIcon,
    ClipboardDocumentListIcon
} from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
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
            // Reset form when dialog opens
            setDeliveryNote("");
            setSignature(null);
            setShowCamera(false);
        }
    }, [isOpen, borrow]);

    if (!isOpen || !borrow) return null;

    // Format borrowing period dates
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
            // Send delivery data to parent component
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

    // Delivery button status
    const isDeliveryButtonDisabled = borrow.status === "delivered" || isSubmitting || !signature;

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
    {/* Background overlay with animation */}
    <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
    ></div>

    {/* Dialog with animation and shadow */}
    <div className="modal-box w-full max-w-3xl p-0 bg-white rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-out scale-95 opacity-0 
        [.modal-open_&]:scale-100 [.modal-open_&]:opacity-100 shadow-xl">
        
        {/* Header with shadow */}
        <div className="bg-blue-700 py-4 px-6 rounded-t-lg shadow-md">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <DocumentCheckIcon className="h-6 w-6 mr-2" />
                    รายละเอียดการส่งมอบครุภัณฑ์
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
            {/* Transaction ID Box with shadow */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
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

            {/* Equipment List with shadow */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
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

            {/* Borrower Information with shadow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">ข้อมูลผู้ยืม</h3>
                    <div className="bg-gray-50 p-3 rounded-lg shadow-md">
                        <p className="text-gray-800">{borrow.borrower.name}</p>
                        <p className="text-sm text-gray-600">{borrow.borrower.department}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">ระยะเวลายืม</h3>
                    <div className="bg-gray-50 p-3 rounded-lg shadow-md">
                        <p className="text-gray-800">{borrowDates}</p>
                    </div>
                </div>
            </div>

            {/* Reason for Borrowing with shadow */}
            <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-1 text-blue-600" />
                    เหตุผลในการยืม
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg shadow-md">
                    <p className="text-gray-800">{borrow.purpose}</p>
                </div>
            </div>

            {/* Delivery Note with shadow */}
            <div>
                <label htmlFor="deliveryNote" className="block font-semibold text-gray-700 mb-2">
                    หมายเหตุการส่งมอบ
                </label>
                <textarea
                    id="deliveryNote"
                    className="textarea textarea-bordered w-full resize-none bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    rows="3"
                    placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                ></textarea>
            </div>

            {/* Signature Section with shadow */}
            <div>
                <h3 className="font-semibold text-gray-700 mb-2">ลายเซ็นรับของ</h3>
                {signature ? (
                    <div className="flex flex-col items-center">
                        <img src={signature} alt="ลายเซ็นรับของ" className="h-32 border border-gray-300 rounded-lg mb-2 shadow-md" />
                        <button
                            onClick={() => setSignature(null)}
                            className="text-red-600 text-sm font-medium hover:text-red-800"
                        >
                            ลบลายเซ็น
                        </button>
                    </div>
                ) : showCamera ? (
                    <div className="flex flex-col items-center">
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-2 shadow-md">
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
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex justify-center ">
                <div className="card bg-gray-100 shadow-lg border border-gray-200 w-full max-w-lg p-6">
                    <div className="card-body items-center text-center">
                        <h3 className="text-2xl font-bold text-gray-700 mb-4 ">สถานะการดำเนินการ</h3>
                        <div className="mt-2">{getStatusBadge(borrow.status)}</div>
                    </div>
                </div>
            </div>



        </div>

        {/* Footer with Submit Button */}
        <div className="bg-gray-50 p-4 text-right shadow-md">
            <button
                onClick={handleDelivery}
                className={`btn btn-primary ${isDeliveryButtonDisabled ? 'btn-disabled' : ''}`}
                disabled={isDeliveryButtonDisabled}
            >
                ยืนยันการส่งมอบ
            </button>
        </div>
    </div>
</div>

    );
};

export default EquipmentDeliveryDialog;
