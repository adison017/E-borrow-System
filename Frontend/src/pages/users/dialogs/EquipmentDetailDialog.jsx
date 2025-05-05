import { MdClose } from "react-icons/md";

const EquipmentDetailDialog = ({ 
  showDetailDialog, 
  setShowDetailDialog, 
  selectedEquipment, 
  historyData,
  showImageModal,
  getStatusBadge
}) => {
  return (
    showDetailDialog && selectedEquipment && (
      <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl xl:max-w-6xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">รายละเอียดครุภัณฑ์</h2>
                <p className="text-sm text-gray-500 mt-1">รหัส: {selectedEquipment.code}</p>
              </div>
              <button
                onClick={() => setShowDetailDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Image Column */}
              <div className="lg:col-span-1 mt-10">
                <div className="rounded-lg overflow-hidden hover:shadow-md transition-shadow flex items-center justify-center">
                  <img
                    src={selectedEquipment.image}
                    alt={selectedEquipment.name}
                    className="w-full max-w-full h-full max-h-[80vh] object-contain"
                    onClick={() => showImageModal(selectedEquipment.image)}
                  />
                </div>
              </div>

              {/* Details Column */}
              <div className="lg:col-span-2">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedEquipment.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-200 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนคงเหลือ</p>
                      <p className="text-md font-semibold mt-1">{selectedEquipment.available} ชิ้น</p>
                    </div>
                    
                    <div className="bg-gray-200 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</p>
                      <p className="text-md font-semibold mt-1">{selectedEquipment.price}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-200 p-4 rounded-lg"> 
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่จัดซื้อ</p>
                      <p className="text-md font-semibold mt-1">{selectedEquipment.purchaseDate}</p>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">สถานที่จัดเก็บ</p>
                      <p className="text-md font-semibold mt-1">{selectedEquipment.location}</p>
                    </div>
                  </div>

                  <div className="bg-gray-200 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</p>
                    <p className="text-md font-semibold mt-1">{selectedEquipment.specifications}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800">ประวัติการใช้งาน</h3>
              <div className="space-y-4">
                {historyData[selectedEquipment.id]?.length > 0 ? (
                  historyData[selectedEquipment.id].map((history, index) => (
                    <div 
                      key={index} 
                      className={`rounded-lg p-4 shadow-sm ${history.type === 'borrow' ? 'bg-gray-200 border-l-4 border-gray-500' : 'bg-gray-200 border-l-4 border-gray-500'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center  rounded-full text-lg font-medium ${
                              history.type === 'borrow' ? 'text-black' : 'text-black'
                            }`}>
                              {history.type === 'borrow' ? 'การยืม' : 'การซ่อมบำรุง'}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                              history.status === 'คืนแล้ว' || history.status === 'ซ่อมเสร็จแล้ว' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-yellow-400 '
                            }`}>
                              {history.status}
                            </span>
                          </div>
                          
                          {history.type === 'borrow' ? (
                            <>
                              <p className="text-sm"><span className="font-medium">ผู้ยืม:</span> {history.borrower}</p>
                              <p className="text-sm"><span className="font-medium">วันที่ยืม:</span> {history.date}</p>
                              <p className="text-sm"><span className="font-medium">วันที่คืน:</span> {history.returnDate || '-'}</p>
                              <p className="text-sm"><span className="font-medium">เหตุผล:</span> {history.reason}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm"><span className="font-medium">วันที่ซ่อม:</span> {history.date}</p>
                              <p className="text-sm"><span className="font-medium">รายละเอียด:</span> {history.description}</p>
                              <p className="text-sm"><span className="font-medium">ค่าใช้จ่าย:</span> {history.cost}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">ไม่มีประวัติการใช้งาน</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default EquipmentDetailDialog;