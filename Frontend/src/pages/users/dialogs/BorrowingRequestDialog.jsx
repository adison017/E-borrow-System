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
} from "react-icons/fa";

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

const BorrowingRequestDialog = ({ request, onClose, onConfirmReceipt }) => {
  if (!request) return null;

  // Determine current step based on status
  let currentStep = 1;
  if (request.status === "รออนุมัติ") currentStep = 2;
  if (request.status === "อนุมัติ") currentStep = 3;
  if (request.status === "รับครุภัณฑ์แล้ว") currentStep = 4;
  if (request.status === "ค้างชำระเงิน") currentStep = 5;
  if (request.status === "เสร็จสิ้น") currentStep = 6;

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

          {/* Progress Steps */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-700 mb-3 md:mb-4 text-lg">
              สถานะการยืม
            </h3>
            <div className="flex justify-center">
              <div className="steps steps-horizontal gap-2">
                {[1, 2, 3, 4, 5, 6].map((step) => {
                  const isActive = currentStep >= step;
                  return (
                    <div
                      key={step}
                      className={`step ${isActive ? "step-warning" : "step-neutral"}`}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1
                          ${isActive ? "bg-warning text-black" : "bg-gray-200 text-gray-500"}`}
                      >
                        {getStepIcon(step)}
                      </div>
                      <div className="text-center text-xs md:text-sm text-gray-700 whitespace-nowrap">
                        {step === 1 && "ส่งข้อมูล"}
                        {step === 2 && "รอตรวจสอบ"}
                        {step === 3 && "รับครุภัณฑ์"}
                        {step === 4 && "กำหนดคืน"}
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
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
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