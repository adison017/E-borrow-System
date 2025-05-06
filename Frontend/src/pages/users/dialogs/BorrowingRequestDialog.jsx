import { BsCalendarDateFill } from "react-icons/bs"; 
import { RiArrowGoBackLine } from "react-icons/ri"; 
import { BsBoxSeamFill } from "react-icons/bs"; 
import React from "react";
import {
  FaFileAlt,
  FaSearch,
  FaCalendarAlt,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaChevronRight,
  FaMoneyBillAlt,
  FaQrcode,
} from "react-icons/fa";
import QRCode from "react-qr-code";

const getStepIcon = (stepNumber) => {
  const iconClass = "text-lg";
  switch (stepNumber) {
    case 1:
      return <FaFileAlt className={iconClass} />;
    case 2:
      return <FaSearch className={iconClass} />;
    case 3:
      return <BsBoxSeamFill className={iconClass} />;
    case 4:
      return <RiArrowGoBackLine className={iconClass} />;
    case 5:
      return <FaMoneyBillWave className={iconClass} />;
    case 6:
      return <FaCheck className={iconClass} />;
    default:
      return <FaFileAlt className={iconClass} />;
  }
};

const BorrowingRequestDialog = ({ request, onClose, onConfirmReceipt, onPayFine,showImageModal }) => {
  if (!request) return null;

  // Determine current step based on status
  let currentStep = 1;
  if (request.status === "รออนุมัติ") currentStep = 2;
  if (request.status === "อนุมัติ") currentStep = 3;
  if (request.status === "กำหนดคืน") currentStep = 4;
  if (request.status === "ค้างชำระเงิน") currentStep = 5;
  if (request.status === "เสร็จสิ้น") currentStep = 6;
  if (request.status === "ปฏิเสธ") currentStep = 2;

  // Check if we should show QR code
  const showQRCode = request.status === "อนุมัติ" || request.status === "กำหนดคืน";
  const showReason = request.status === "ปฏิเสธ";
  const showFine = request.status === "ค้างชำระเงิน";

  return (
    <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                <span>คำร้องขอยืม</span>
                <FaChevronRight className="text-gray-400 text-sm hidden sm:block" />
                <span className="text-primary">{request.id}</span>
              </h2>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  className={`badge ${request.statusColor} text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium`}
                >
                  {request.status}
                </span>
                <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                  <BsCalendarDateFill className="text-gray-400 hidden sm:block" />
                  วันที่ยืม {request.borrowedDate} - คืน {request.dueDate}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className=" text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* QR Code Section (only for approved or received status) */}
          {showQRCode && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 text-center">
                QR Code สำหรับการยืมครุภัณฑ์
              </h3>
              <div className="p-2 bg-white rounded-lg border border-gray-200 mb-2">
                <QRCode 
                  value={request.id} 
                  size={128}
                  level="H"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                สแกนเพื่อตรวจสอบข้อมูลการยืม
              </p>
            </div>
          )}

          {showReason && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                <FaTimes className="text-red-600 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 text-lg flex items-center gap-2">
                  เหตุผลการปฏิเสธคำร้อง
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    ไม่ได้รับการอนุมัติ
                  </span>
                </h3>
                <p className="text-xs text-red-700 mt-1">
                  วันที่ปฏิเสธ: {request.rejectionDate || 'ไม่ระบุวันที่'}
                </p>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-start gap-3 px-6">
                <div className="text-red-500 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-medium mb-1">สาเหตุ</p>
                  <p className="text-red-700">{request.cencalReason}</p>
                  
                  {request.rejectionDetails && (
                    <div className="mt-3">
                      <p className="text-red-800 font-medium mb-1 text-sm">รายละเอียดเพิ่มเติม:</p>
                      <p className="text-red-600 text-sm">{request.rejectionDetails}</p>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Payment Section for Overdue Status */}
          {showFine && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-amber-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <FaMoneyBillWave className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 text-lg">ค่าปรับ</h3>
                    <p className="text-xs text-amber-700">กรุณาชำระค่าปรับเพื่อดำเนินการต่อ</p>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  รอชำระเงิน
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 mb-5 border border-amber-100">
                {/* เงื่อนไขตรวจสอบการแสดงจำนวนวันที่คืนล่าช้า */}
                {request.overdueDays ? (
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt className="text-amber-400" />
                        วันที่คืนล่าช้า
                      </p>
                      <p className="text-xl font-bold text-amber-700">
                        {request.overdueDays} <span className="text-sm font-normal">วัน</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMoneyBillWave className="text-amber-400" />
                        ค่าปรับทั้งหมด
                      </p>
                      <p className="text-xl font-bold text-amber-700">
                        ฿{request.fineAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FaMoneyBillWave className="text-amber-400" />
                      ค่าปรับทั้งหมด
                    </p>
                    <p className="text-xl font-bold text-amber-700">
                      ฿{request.fineAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                )}
                
                {/* ส่วนแสดงเหตุผลค่าปรับ */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">รายละเอียดค่าปรับ</h4>
                  <div className="bg-amber-50 rounded-lg p-3">
                    {request.fineReason ? (
                      <p className="text-amber-800 font-medium">{request.fineReason}</p>
                    ) : request.overdueDays ? (
                      <p className="text-amber-800 font-medium">
                        คืนครุภัณฑ์ล่าช้า {request.overdueDays} วัน
                      </p>
                    ) : (
                      <p className="text-amber-800 font-medium">
                        มีค่าปรับจากการยืมครุภัณฑ์
                      </p>
                    )}
                    {request.fineDetails && (
                      <p className="text-amber-600 text-sm mt-1">{request.fineDetails}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ส่วนช่องทางการชำระเงิน (คงเดิม) */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 text-sm flex items-center gap-2">
                  <FaExchangeAlt className="text-gray-400" />
                  <span>เลือกช่องทางการชำระเงิน</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Cash Payment */}
                  <button
                    onClick={() => onPayFine('cash')}
                    className="group flex items-center gap-3 bg-white hover:bg-green-50 p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-all"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <FaMoneyBillAlt className="text-green-600 text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">ชำระเงินสด</p>
                      <p className="text-xs text-gray-500">ที่แผนกครุภัณฑ์ ชั้น 2</p>
                    </div>
                    <FaChevronRight className="ml-auto text-gray-300 group-hover:text-green-400" />
                  </button>

                  {/* QR Payment */}
                <button
                    onClick={() => onPayFine('qr')}
                    className="group flex items-center gap-3 bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FaQrcode className="text-blue-600 text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">สแกน QR Code</p>
                      <p className="text-xs text-gray-500">ผ่านแอปธนาคาร</p>
                    </div>
                    <FaChevronRight className="ml-auto text-gray-300 group-hover:text-blue-400" />
                  </button>
                </div>
                </div>
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-400">
                    ระบบจะอัปเดตสถานะภายใน 1 ชั่วโมงหลังชำระเงิน
                  </p>
                </div>
              </div>
          )}

          {/* Progress Steps */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-700 mb-3 md:mb-4 text-lg">
              สถานะการยืม
            </h3>
            <div className="flex justify-center">
              <div className="steps steps-horizontal md:gap-4 sm:gap-2">
                {[1, 2, 3, 4, 5, 6].map((step) => {
                  const isActive = currentStep >= step;
                  const isRejected = request.status === "ปฏิเสธ" && step === 2;
                  
                  return (
                    <div
                      key={step}
                      className={`step ${isRejected ? "step-error" : isActive ? "step-warning" : "step-neutral"}`}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1
                          ${isRejected ? "bg-error text-white" : isActive ? "bg-warning text-black" : "bg-gray-200 text-gray-500"}`}
                      >
                        {getStepIcon(step)}
                      </div>
                      <div className="text-center text-xs md:text-sm text-gray-700 whitespace-nowrap">
                        {step === 1 && "ส่งข้อมูล"}
                        {step === 2 && (request.status === "ปฏิเสธ" ? "ปฏิเสธ" : "รอตรวจสอบ")}
                        {step === 3 && "รับครุภัณฑ์"}
                        {step === 4 && "คืนครุภัณฑ์"}
                        {step === 5 && "ชำระค่าปรับ"}
                        {step === 6 && "เสร็จสิ้น"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          
      
          {/* Equipment List */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">รายการครุภัณฑ์</h3>
            <div className="bg-blue-50 rounded-lg p-3 md:p-4">
              {request.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg transition-colors">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "https://via.placeholder.com/500?text=No+Image"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/500?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate text-sm md:text-base">{item.name}</p>
                    <div className="flex justify-between text-xs md:text-sm text-gray-500 px-1">
                      <span>รหัส: {item.equipmentId || `EQ-${(1000 + index).toString().padStart(4, '0')}`}</span>
                      <span>จำนวน: {item.quantity} {item.quantity > 1 ? 'ชิ้น' : 'ชุด'}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-5 bg-blue-600 px-2 py-3 rounded-2xl text-white font-medium text-sm md:text-base justify-end flex">
                รวมทั้งหมด {request.total} ชิ้น
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm">เหตุผลการขอยืม</h3>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <p className="text-gray-700 text-sm md:text-base">{request.reason}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">วันที่ยืม</h3>
              <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                <p className="text-gray-700 text-sm md:text-base">{request.borrowedDate}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">วันที่คืน</h3>
              <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                <p className="text-gray-700 text-sm md:text-base">{request.dueDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowingRequestDialog;