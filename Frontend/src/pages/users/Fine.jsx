import React from "react";

const RequirementList = () => {
  const borrowingRequests = [
    {
      id: "IT-2023-001",
      status: "รออนุมัติ",
      statusColor: "badge-warning",
      image: "https://media-cdn.bnn.in.th/366788/lenovo-notebook-ideapad-duet-5-12iru8-83b30058ta-storm-grey-1-square_medium.jpg",
      reason: "ต้องการใช้สำหรับการจัดกิจกรรมสัปดาห์วิทยาศาสตร์ ระหว่างวันที่ 15-20 สิงหาคม 2566",
      items: [
        { name: "โน้ตบุ๊ก", quantity: 3 },
        { name: "โปรเจคเตอร์", quantity: 1 },
        { name: "ลำโพง", quantity: 2 }
      ],
      total: 6
    },
    {
      id: "IT-2023-002",
      status: "อนุมัติแล้ว",
      statusColor: "badge-success",
      image: "https://audiocity.co.th/pub/media/catalog/product/cache/765fdf86a9e550514b9df31691b36e7f/n/t/nt1-5th-generation-silver.jpg",
      reason: "ใช้สำหรับการประชุมสัมมนาวิชาการ วันที่ 10 กันยายน 2566",
      items: [
        { name: "ไมโครโฟน", quantity: 2 },
        { name: "จอภาพ", quantity: 1 }
      ],
      total: 3
    },
    {
      id: "IT-2023-003",
      status: "ค่าปรับ",
      statusColor: "badge-error",
      image: "https://res.cloudinary.com/itcity-production/image/upload/f_jpg,q_80,w_1000/v1723098360/products/PRD202408008046/skus/r3hzg2mfxtjyid8w9e1f.avif",
      reason: "ใช้สำหรับกิจกรรมค่ายพัฒนาทักษะด้านไอที",
      penaltyReason: "คืนอุปกรณ์ล่าช้ากว่ากำหนด 3 วัน",
      penaltyAmount: 1500,
      items: [
        { name: "แท็บเล็ต", quantity: 5 },
        { name: "กล้องถ่ายรูป", quantity: 2 }
      ],
      total: 7,
      dueDate: "20 สิงหาคม 2566",
      borrowedDate: "15 สิงหาคม 2566"
    }
  ];

  const penaltyRequests = borrowingRequests.filter(request => request.status === "ค่าปรับ");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">รายการค่าปรับครุภัณฑ์</h1>
      
      {penaltyRequests.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">ไม่มีรายการค่าปรับในขณะนี้</p>
        </div>
      ) : (
        <div className="space-y-6">
          {penaltyRequests.map((request) => (
            <div key={request.id} className="card bg-white shadow-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
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
                  
                    <div className="my-1">
                      <h3 className="font-semibold text-gray-700 mb-1">เหตุผลการขอยืม</h3>
                      <p className="text-gray-600 text-sm md:text-base">{request.reason}</p>
                    </div>

                    {/* ส่วนแสดงเหตุผลค่าปรับ */}
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-red-700 mb-1">เหตุผลค่าปรับ</h3>
                      <p className="text-red-800 text-xl font-bold">{request.penaltyReason}</p>
                    </div>

                    {/* ส่วนแสดงจำนวนเงินค่าปรับ */}
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-yellow-700 mb-1">จำนวนเงินค่าปรับ</h3>
                      <p className="text-yellow-800 text-xl font-bold">
                        {request.penaltyAmount?.toLocaleString('th-TH')} บาท
                      </p>
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
                          <button className="btn btn-neutral btn-sm md:btn-md flex-1 md:flex-none rounded-xl">
                            ชำระเงิน
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
      )}
    </div>
  );
};

export default RequirementList;