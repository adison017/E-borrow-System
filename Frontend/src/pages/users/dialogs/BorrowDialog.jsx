import { FaCalendarAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useEffect } from 'react';

// ฟังก์ชันดึงวันพรุ่งนี้ของไทย (string YYYY-MM-DD)
function getTomorrowTH() {
  const now = new Date();
  const bangkokNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  bangkokNow.setUTCHours(0, 0, 0, 0);
  bangkokNow.setUTCDate(bangkokNow.getUTCDate() + 1);
  const yyyy = bangkokNow.getUTCFullYear();
  const mm = String(bangkokNow.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(bangkokNow.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const BorrowDialog = ({
  showBorrowDialog,
  setShowBorrowDialog,
  quantities,
  equipmentData,
  borrowData,
  setBorrowData, // เพิ่ม prop นี้
  handleInputChange,
  handleReturnDateChange,
  handleSubmitBorrow,
  calculateMaxReturnDate,
  showImageModal
}) => {
  // ฟังก์ชันดึงวันพรุ่งนี้ของไทย (string YYYY-MM-DD)
  function getTomorrowTH() {
    const now = new Date();
    const bangkokNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    bangkokNow.setUTCHours(0, 0, 0, 0);
    bangkokNow.setUTCDate(bangkokNow.getUTCDate() + 1);
    const yyyy = bangkokNow.getUTCFullYear();
    const mm = String(bangkokNow.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(bangkokNow.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Autofill borrowDate เป็นวันพรุ่งนี้เมื่อ dialog ถูกเปิด
  useEffect(() => {
    if (showBorrowDialog) {
      const tomorrow = getTomorrowTH();
      if (!borrowData.borrowDate || borrowData.borrowDate !== tomorrow) {
        setBorrowData(prev => ({
          ...prev,
          borrowDate: tomorrow
        }));
      }
    }
    // eslint-disable-next-line
  }, [showBorrowDialog]);

  const isBorrowDateValid = !!borrowData.borrowDate && borrowData.borrowDate >= getTomorrowTH();
  return (
    showBorrowDialog && (
      <div className="modal modal-open">
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">แบบฟอร์มขอยืมครุภัณฑ์</h2>
                <button
                  onClick={() => setShowBorrowDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">รายการที่เลือก</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {Object.entries(quantities).map(([item_code, qty]) => {
                    // ใช้ item_id เป็น string ทั้งคู่
                    const equipment = equipmentData.find(item => String(item.id) === String(item_code));
                    if (!equipment) return null;
                    return (
                      <div key={item_code} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <div
                          className="w-10 h-full rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => showImageModal(equipment.image)}
                        >
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            className="w-full h-full object-cover "
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{equipment.name}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span className="truncate">รหัส: {equipment.id}</span>
                            <span className="font-semibold">จำนวน {qty} {equipment.unit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* กรณีไม่มีรายการที่เลือก */}
                  {Object.keys(quantities).length === 0 && (
                    <div className="text-gray-400 text-center py-4">ไม่มีรายการที่เลือก</div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmitBorrow}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">เหตุผลการขอยืม</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="กรุณากรอกเหตุผลการขอยืม..."
                    rows={4}
                    name="reason"
                    value={borrowData.reason}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex-none justify-start">
                      <span>วันที่ยืม</span>
                      <span className="text-xs text-blue-600 font-normal"> ( Set เป็นหลังวันที่ส่งคำขอ 1 วัน เพื่อรออนุมัติ)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        name="borrowDate"
                        value={borrowData.borrowDate}
                        onChange={handleInputChange}
                        min={getTomorrowTH()}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => document.querySelector('input[name="borrowDate"]').showPicker()}
                      >
                        <FaCalendarAlt />
                      </button>
                      {!isBorrowDateValid && borrowData.borrowDate && (
                        <p className="text-xs text-red-600 mt-1">กรุณาเลือกวันที่ยืมหลังวันส่งคำขอ 1 วันขึ้นไป</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex-none justify-start">
                      <span>วันที่คืน</span>
                      <span className="text-xs text-blue-600 font-normal"> (ไม่เกิน 7 วัน)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        name="returnDate"
                        value={borrowData.returnDate}
                        onChange={handleReturnDateChange}
                        min={borrowData.borrowDate}
                        max={calculateMaxReturnDate()}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => document.querySelector('input[name="returnDate"]').showPicker()}
                      >
                        <FaCalendarAlt />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBorrowDialog(false)}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-1"
                    disabled={!isBorrowDateValid}
                  >
                    ส่งคำขอยืม
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BorrowDialog;