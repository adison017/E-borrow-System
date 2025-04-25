import React, { useState } from "react";

const requirementList = () => {
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
      status: "ปฏิเสธ",
      statusColor: "badge-error",
      image: "https://res.cloudinary.com/itcity-production/image/upload/f_jpg,q_80,w_1000/v1723098360/products/PRD202408008046/skus/r3hzg2mfxtjyid8w9e1f.avif",
      reason: "ใช้สำหรับกิจกรรมค่ายพัฒนาทักษะด้านไอที",
      items: [
        { name: "แท็บเล็ต", quantity: 5 },
        { name: "กล้องถ่ายรูป", quantity: 2 }
      ],
      total: 7
    }
  ];

  return (
    <div className="flex flex-col justify-center items-center px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 self-start">รายการขอยืมครุภัณฑ์</h1>
      
      <div className="w-full max-w-8xl space-y-4">
        {borrowingRequests.map((request, index) => (
          <div key={index} className="card bg-base-200 shadow-xl w-full bg-white">
            <div className="flex flex-col md:flex-row">
              {/* Image section */}
              <figure className="md:w-1/3 w-full relative aspect-video md:aspect-auto">
                <img
                  src={request.image}
                  alt={`อุปกรณ์ที่ยืม ${request.id}`}
                  className="object-cover w-full h-90 md:min-h-[250px]"
                />
              </figure>
              
              {/* Content section */}
              <div className="flex flex-col md:w-2/3 w-full">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title text-gray-800">{request.id}</h2>
                    <div className={`badge ${request.statusColor} text-white`}>
                      {request.status}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700">เหตุผลการขอยืม</h3>
                    <p className="text-gray-600 mt-1">
                      {request.reason}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700">รายการครุภัณฑ์</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {request.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="badge badge-outline text-gray-700">
                          {item.name} ({item.quantity} {item.quantity > 1 ? 'เครื่อง' : 'ชุด'})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer section */}
                <div className="card-body border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-700 font-medium">รวมทั้งหมด: {request.total} ชิ้น</div>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-error">ยกเลิก</button>
                      <button className="btn btn-info text-white">ดูรายละเอียด</button>
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

export default requirementList;