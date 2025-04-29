import React from "react";

const All_doneList = () => {
  const borrowingRequests = [
    {
      id: "IT-2023-002",
      status: "เสร็จสิ้น",
      statusColor: "badge-primary-content",
      image: "https://audiocity.co.th/pub/media/catalog/product/cache/765fdf86a9e550514b9df31691b36e7f/n/t/nt1-5th-generation-silver.jpg",
      reason: "ใช้สำหรับการประชุมสัมมนาวิชาการ วันที่ 10 กันยายน 2566",
      items: [
        { name: "ไมโครโฟน", quantity: 2 },
        { name: "จอภาพ", quantity: 1 }
      ],
      total: 3,
      dueDate: "20 สิงหาคม 2566",
      borrowedDate: "15 สิงหาคม 2566"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">รายการขอยืมครุภัณฑ์</h1>
      
      <div className="space-y-6">
        {borrowingRequests.map((request) => (
          <div key={request.id} className="card bg-white shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="md:w-1/3 w-full h-90 md:h-auto flex items-center justify-center">
                <img
                  src={request.image}
                  alt={`อุปกรณ์ที่ยืม ${request.id}`}
                  className="object-cover w-full h-full md:max-h-80 md:max-w-90"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    e.target.className = "object-contain p-4";
                  }}
                />
              </div>
              
              {/* Content section */}
              <div className="md:w-2/3 w-full">
                <div className="card-body p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <h2 className="card-title text-gray-800 text-lg md:text-xl">
                      {request.id}
                    </h2>
                    <div className={`badge ${request.statusColor} text-white text-sm md:text-base`}>
                      {request.status}
                    </div>
                  </div>
                
                  <div className="my-4">
                    <h3 className="font-semibold text-gray-700 mb-1">เหตุผลการขอยืม</h3>
                    <p className="text-gray-600 text-sm md:text-base">{request.reason}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">รายการครุภัณฑ์</h3>
                    <div className="flex flex-wrap gap-2">
                      {request.items.map((item, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs md:text-sm text-gray-700"
                        >
                          {item.name} ({item.quantity} {item.quantity > 1 ? 'เครื่อง' : 'ชุด'})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">วันที่ยืม</h3>
                      <p className="text-gray-600 text-sm md:text-base">{request.borrowedDate}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">วันที่ครบกำหนดคืน</h3>
                      <p className="text-gray-600 text-sm md:text-base">{request.dueDate}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200 mt-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="text-gray-700 font-medium text-sm md:text-base">
                        รวมทั้งหมด {request.total} ชิ้น
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button className={`btn rounded-xl ${request.status === "อนุมัติแล้ว" ? "btn-primary" : "btn-outline"} btn-sm md:btn-md flex-2 md:flex-none`}>
                          {request.status === "อนุมัติแล้ว" ? (
                            "รับครุภัณฑ์"
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              ดูรายละเอียด
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default All_doneList;