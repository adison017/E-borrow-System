import { useState } from "react";

const CheckDataDialog = ({ borrow, isOpen, onClose, onApprove, onReject }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !borrow) return null;

  // Format borrowing period dates
  const borrowDates = `${borrow.borrow_date} ถึง ${borrow.due_date}`;

  // Convert the equipment to the items array format expected by the dialog
  const items = [
    {
      name: borrow.equipment.name,
      assetNumber: borrow.equipment.code
    }
  ];

  const handleClosePopup = () => {
    setShowRejectReason(false);
    setRejectReason("");
    onClose();
  };

  const handleRejectClick = () => {
    setShowRejectReason(true);
  };

  const handleRejectSubmit = () => {
    onReject(rejectReason);
    setShowRejectReason(false);
    setRejectReason("");
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-t-4 border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 py-4 px-6"> 
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              รายละเอียดการยืมครุภัณฑ์
            </h2>
            <button 
              onClick={handleClosePopup}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 bg-gray-50">
          {/* Transaction ID Box */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <div>
                <div className="text-sm text-gray-500">หมายเลขการยืม</div>
                <div className="font-bold text-gray-800 text-lg">{borrow.borrow_code}</div>
              </div>
            </div>
          </div>

          {/* Borrower Info Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              ข้อมูลผู้ยืม
            </h3>
            <div className="ml-7">
              <p className="text-gray-700"><span className="font-medium">ชื่อผู้ขอยืม:</span> {borrow.borrower.name}</p>
              <p className="text-gray-700"><span className="font-medium">แผนก:</span> {borrow.borrower.department}</p>
              <p className="text-gray-700"><span className="font-medium">ระยะเวลายืม:</span> {borrowDates}</p>
              <p className="text-gray-700"><span className="font-medium">วัตถุประสงค์:</span> {borrow.purpose}</p>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              รายการครุภัณฑ์ที่ยืม
            </h3>
            <div className="space-y-3 ml-7">
              {items.map((item, index) => (
                <div key={index} className="flex items-center p-2 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">เลขครุภัณฑ์: {item.assetNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reject Reason Input (shown only when rejecting) */}
          {showRejectReason && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                เหตุผลการไม่อนุมัติ
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="กรุณากรอกเหตุผลการไม่อนุมัติ..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                required
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 flex justify-end">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg mr-2 transition duration-200"
            onClick={handleClosePopup}
          >
            ปิด
          </button>
          {showRejectReason ? (
            <>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg mr-2 transition duration-200"
                onClick={() => setShowRejectReason(false)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                onClick={handleRejectSubmit}
              >
                ยืนยันการไม่อนุมัติ
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg mr-2 transition duration-200"
                onClick={handleRejectClick}
              >
                ไม่อนุมัติ
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                onClick={onApprove}
              >
                อนุมัติ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckDataDialog;