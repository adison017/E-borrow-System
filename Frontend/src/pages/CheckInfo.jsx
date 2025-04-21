import React, { useState } from 'react';

const CheckInfo = () => {
  const requests = [
    {
      id: 1,
      title: "ครุภัณฑ์",
      username: "user001",
      fullname: "สมชาย ใจดี",
      tranid: "BORROW0112",
      details: {
        items: [
          { name: "คอมพิวเตอร์", assetNumber: "A12345" },  // เลขครุภัณฑ์ที่ไม่ซ้ำ
          { name: "เครื่องปริ้นเตอร์", assetNumber: "A12346" }  // เลขครุภัณฑ์ที่ไม่ซ้ำ
        ],
        borrower: "สมชาย ใจดี",
        borrowDates: "2025-04-01 ถึง 2025-04-30",
        purpose: "ใช้ในการทำงานที่บ้าน"
      }
    },
    {
      id: 2,
      title: "ครุภัณฑ์",
      username: "user002",
      fullname: "นานสงคุล",
      tranid: "BORROW0113",
      details: {
        items: [
          { name: "โน๊ตบุ๊ค", assetNumber: "B12345" },  // เลขครุภัณฑ์ที่ไม่ซ้ำ
          { name: "สแกนเนอร์", assetNumber: "B12346" }  // เลขครุภัณฑ์ที่ไม่ซ้ำ
        ],
        borrower: "นานสงคุล",
        borrowDates: "2025-04-02 ถึง 2025-04-15",
        purpose: "ใช้ในโครงการวิจัย"
      }
    },
    {
      id: 3,
      title: "ครุภัณฑ์",
      username: "user003",
      fullname: "อนุชา สุขใจ",
      tranid: "BORROW0114",
      details: {
        items: [
          { name: "โทรทัศน์", assetNumber: "C12345" },  // เลขครุภัณฑ์ที่ไม่ซ้ำ
          { name: "จอภาพ", assetNumber: "C12346" }  // เลขครุภัณฑ์ที่ไม่ซ้ำ
        ],
        borrower: "อนุชา สุขใจ",
        borrowDates: "2025-04-03 ถึง 2025-04-20",
        purpose: "ใช้ในการสอนออนไลน์"
      }
    },
    // เพิ่มรายการเพิ่มเติมตามต้องการ
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [rowsToShow, setRowsToShow] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredRequests = requests
    .filter(req =>
      req.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tranid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, rowsToShow);

  const handleShowPopup = (req) => {
    setPopupData({
      ...req.details,
      tranid: req.tranid,
      fullname: req.fullname
    });
    setShowPopup(true);
    setShowRejectReason(false);
    setRejectReason('');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData(null);
    setShowRejectReason(false);
    setRejectReason('');
  };

  const handleRejectClick = () => {
    setShowRejectReason(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert('กรุณากรอกเหตุผลการไม่อนุมัติ');
      return;
    }
    // Here you would typically send the rejection reason to your backend
    console.log('Rejecting request with reason:', rejectReason);
    alert(`ไม่อนุมัติการยืมเนื่องจาก: ${rejectReason}`);
    handleClosePopup();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-black">
      <h1 className="text-2xl font-bold text-center mb-6">ตรวจสอบข้อมูล</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-4xl mx-auto mb-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ, username หรือรหัส"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-2/3"
        />
        <div>
          <label className="mr-2">แสดง:</label>
          <select
            value={rowsToShow}
            onChange={(e) => setRowsToShow(parseInt(e.target.value))}
            className="px-3 py-2 rounded-md border border-gray-300"
          >
            <option value={5}>5 รายการ</option>
            <option value={10}>10 รายการ</option>
            <option value={20}>20 รายการ</option>
          </select>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        filteredRequests.map((req) => (
          <div key={req.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md border-2 border-blue-400 max-w-4xl mx-auto mb-4">
            <div className="flex items-center">
              <img 
                src="/lo.png" 
                alt="thumbnail" 
                className="w-16 h-16 bg-white rounded mr-4" 
              />
              <div className="flex-1">
                <p className="text-lg font-semibold">{req.id} {req.title}</p>
                <p className="text-sm">
                  ผู้ขอยืม : <span className="font-medium">ชื่อ-{req.fullname}</span>
                </p>
                <p className="text-sm text-gray-300">{req.tranid}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded">
                  อนุมัติ
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded">
                  ไม่อนุมัติ
                </button>
              </div>
            </div>
            <div
                className="text-sm mt-2 cursor-pointer hover:bg-green-500 bg-green-600 text-white font-bold py-1 px-4 rounded max-w-max mx-auto text-center"
                onClick={() => handleShowPopup(req)}
              >
                รายละเอียดการยืม
              </div>



          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 mt-10">ไม่พบข้อมูลที่ค้นหา</div>
      )}

      {/* Popup ที่ปรับปรุงสีโทนใหม่และพื้นหลังเบลอ */}
      {showPopup && popupData && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-70 flex justify-center items-center z-50 p-4">
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
                    <div className="font-bold text-gray-800 text-lg">{popupData.tranid || 'ข้อมูลไม่พร้อม'}</div>
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
                  <p className="text-gray-700"><span className="font-medium">ชื่อผู้ขอยืม:</span> {popupData.borrower || 'ข้อมูลไม่พร้อม'}</p>
                  <p className="text-gray-700"><span className="font-medium">ระยะเวลายืม:</span> {popupData.borrowDates || 'ข้อมูลไม่พร้อม'}</p>
                  <p className="text-gray-700"><span className="font-medium">วัตถุประสงค์:</span> {popupData.purpose || 'ข้อมูลไม่พร้อม'}</p>
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
                  {popupData.items.map((item, index) => (
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
                  >
                    อนุมัติ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInfo;