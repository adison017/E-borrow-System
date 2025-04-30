import React, { useState } from "react";

const RequirementList = () => {
  const borrowingRequests = [
    {
      id: "IT-2023-001",
      status: "รออนุมัติ",
      statusColor: "badge-warning",
      reason: "ต้องการใช้สำหรับการจัดกิจกรรมสัปดาห์วิทยาศาสตร์ ระหว่างวันที่ 15-20 สิงหาคม 2566",
      items: [
        { 
          name: "โน้ตบุ๊ก", 
          quantity: 3,
          image: "https://media-cdn.bnn.in.th/366788/lenovo-notebook-ideapad-duet-5-12iru8-83b30058ta-storm-grey-1-square_medium.jpg"
        },
        { 
          name: "โปรเจคเตอร์", 
          quantity: 1,
          image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        { 
          name: "ลำโพง", 
          quantity: 2,
          image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      ],
      total: 6,
      dueDate: "20 สิงหาคม 2566",
      borrowedDate: "15 สิงหาคม 2566"
    },
    {
      id: "IT-2023-002",
      status: "อนุมัติ",
      statusColor: "badge-success",
      reason: "ใช้สำหรับการประชุมสัมมนาวิชาการ วันที่ 10 กันยายน 2566",
      items: [
        { 
          name: "ไมโครโฟน", 
          quantity: 2,
          image: "https://audiocity.co.th/pub/media/catalog/product/cache/765fdf86a9e550514b9df31691b36e7f/n/t/nt1-5th-generation-silver.jpg"
        },
        { 
          name: "จอภาพ", 
          quantity: 1,
          image: "https://ihcupload.s3.ap-southeast-1.amazonaws.com/img/product/product33238_150.png"
        }
      ],
      total: 3,
      dueDate: "20 สิงหาคม 2566",
      borrowedDate: "15 สิงหาคม 2566"
    }
  ];

  const pendingRequests = borrowingRequests.filter(request => request.status === "อนุมัติ");
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  const handleNext = (requestId) => {
    setCurrentImageIndices(prev => {
      const currentIndex = prev[requestId] || 0;
      const items = borrowingRequests.find(req => req.id === requestId)?.items || [];
      return {
        ...prev,
        [requestId]: currentIndex === items.length - 1 ? 0 : currentIndex + 1
      };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">รายการอนุมัติการยืมครุภัณฑ์</h1>
      
      <div className="space-y-6">
        {pendingRequests.map((request) => {
          const currentIndex = currentImageIndices[request.id] || 0;
          const currentItem = request.items[currentIndex];
          
          return (
            <div key={request.id} className="card bg-white shadow-xl overflow-hidden ">
              <div className="flex flex-col md:flex-row">
                {/* Image Carousel Section */}
                <div className="relative group md:w-1/3 w-full h-full md:h-auto flex items-center justify-center transition-transform duration-300 hover:scale-[1.01]">
                  <div>
                    <img
                      src={currentItem?.image || "https://via.placeholder.com/500?text=No+Image"}
                      alt="ครุภัณฑ์"
                      className="object-cover w-90 h-full md:max-h-80 md:max-w-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/500?text=No+Image";
                      }}
                    />
                    
                    {/* Navigation Arrows - Right Side */}
                    <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext(request.id);
                        }}
                        className="h-full w-full bg-black/20 hover:bg-black/30 flex items-center justify-center"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-8 w-8 text-white" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
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
                            className={`px-3 py-1 rounded-full text-xs md:text-sm ${
                              index === currentIndex 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
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
                          <button className={`btn rounded-xl ${request.status === "อนุมัติ" ? "btn-neutral" : "btn-outline"} btn-sm md:btn-md flex-2 md:flex-none`}>
                            {request.status === "อนุมัติ" ? (
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
          );
        })}
      </div>
    </div>
  );
};

export default RequirementList;