import React, { useState } from 'react';
import { MdShoppingCart } from "react-icons/md";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');
  const [quantities, setQuantities] = useState({});

  // Sample equipment data (with unique IDs and available quantities)
  const equipmentData = [
    {
      id: 1,
      name: 'โน๊ตบุ๊ค Dell XPS 15',
      code: 'IT-001',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png',
      available: 5
    },
    {
      id: 2,
      name: 'โปรเจคเตอร์ Epson EB-U05',
      code: 'AV-002',
      status: 'ถูกยืม',
      dueDate: '15/06/2023',
      image: 'logo.png',
      available: 0
    },
    {
      id: 3,
      name: 'กล้อง Canon EOS 80D',
      code: 'PH-003',
      status: 'กำลังซ่อม',
      dueDate: '15/06/2023',
      image: 'logo.png',
      available: 2
    },
    {
      id: 4,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png',
      available: 3
    },
    {
      id: 5,
      name: 'กล้อง Canon EOS 80D',
      code: 'PH-005',
      status: 'กำลังซ่อม',
      dueDate: '15/06/2023',
      image: 'logo.png',
      available: 1
    },
    {
      id: 6,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-006',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png',
      available: 4
    },
    {
      id: 7,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-007',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png',
      available: 2
    },
    {
      id: 8,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-008',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png',
      available: 0
    }
  ];

  // Handle quantity increase
  const handleIncrease = (id) => {
    const equipment = equipmentData.find(item => item.id === id);
    if (equipment && (quantities[id] || 0) < equipment.available) {
      setQuantities(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));
    }
  };

  // Handle quantity decrease
  const handleDecrease = (id) => {
    setQuantities(prev => {
      const newQuantity = (prev[id] || 0) - 1;
      if (newQuantity <= 0) {
        const newState = {...prev};
        delete newState[id];
        return newState;
      }
      return {
        ...prev,
        [id]: newQuantity
      };
    });
  };

  // Calculate total selected items
  const totalSelectedItems = Object.keys(quantities).length;

  // Filter equipment based on search and status
  const filteredEquipment = equipmentData.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ทั้งหมด' || equipment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const baseClasses = "badge gap-2 whitespace-nowrap";
    switch (status) {
      case 'พร้อมยืม':
        return <span className={`${baseClasses} badge-success`}>พร้อมยืม</span>;
      case 'ถูกยืม':
        return <span className={`${baseClasses} badge-warning`}>ถูกยืม</span>;
      case 'กำลังซ่อม':
        return <span className={`${baseClasses} badge-error`}>กำลังซ่อม</span>;
      default:
        return <span className={`${baseClasses} badge-info`}>{status}</span>;
    }
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    alert(`ยืนยันการยืม ${totalSelectedItems} รายการ`);
    setQuantities({});
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-center">หน้าหลักระบบยืมคืนครุภัณฑ์</h1>
        <p className="mb-6 text-center">ยินดีต้อนรับเข้าสู่ระบบยืมคืนครุภัณฑ์ คณะวิทยาการสารสนเทศ</p>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none  ">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="ค้นหาชื่อครุภัณฑ์หรือรหัส..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="filter mb-8 flex justify-center gap-3 flex-wrap ">
          <button 
            className={`btn btn-sm transition-transform duration-300 hover:scale-120 rounded-2xl ${selectedStatus === 'ทั้งหมด' ? 'btn-active' : 'btn-outline'}`}
            onClick={() => handleStatusFilter('ทั้งหมด')}
          >
            ทั้งหมด
          </button>
          <button 
            className={`btn btn-sm transition-transform duration-300 hover:scale-120 rounded-2xl ${selectedStatus === 'พร้อมยืม' ? 'btn-active' : 'btn-outline'}`}
            onClick={() => handleStatusFilter('พร้อมยืม')}
          >
            พร้อมยืม
          </button>
          <button 
            className={`btn btn-sm transition-transform duration-300 hover:scale-120 rounded-2xl ${selectedStatus === 'ถูกยืม' ? 'btn-active' : 'btn-outline'}`}
            onClick={() => handleStatusFilter('ถูกยืม')}
          >
            ถูกยืม
          </button>
          <button 
            className={`btn btn-sm transition-transform duration-300 hover:scale-120 rounded-2xl ${selectedStatus === 'กำลังซ่อม' ? 'btn-active' : 'btn-outline'}`}
            onClick={() => handleStatusFilter('กำลังซ่อม')}
          >
            กำลังซ่อม
          </button>
        </div>

        {/* Equipment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 ">
          {filteredEquipment.map((equipment) => (
            <div key={equipment.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white transition-transform duration-300 hover:scale-105">
              <figure className="px-4 pt-4">
                <img 
                  src={equipment.image} 
                  alt={equipment.name} 
                  className="rounded-xl h-40 object-contain w-full" 
                />
              </figure>
              <div className="card-body p-4 md:p-6 ">
              <div className="card-title flex flex-col gap-2 ">
                  <div className="self-center sm:self-center text-white text-sm md:text-base mb-2 mt-2">
                    {getStatusBadge(equipment.status)}
                  </div>
                <h2 className="font-semibold line-clamp-1 text-lg md:text-xl">{equipment.name}</h2>
                <p className="text-sm">รหัสครุภัณฑ์ {equipment.code}</p>
              </div>
                
                
                <div className="flex flex-col items-center w-full mt-4">
                    {equipment.status === 'พร้อมยืม' && (
                      <p className="text-sm">คงเหลือ {equipment.available} ชิ้น</p>
                    )}
                    {equipment.dueDate && equipment.status !== 'พร้อมยืม' && (
                      <p className="text-sm">กำหนดคืน {equipment.dueDate}</p>
                    )}
                </div>

                <div className="card-actions justify-center ">
                {equipment.status === 'พร้อมยืม' ? (
                quantities[equipment.id] ? (
                  <div className="join gap-2">
                    <button 
                      className={`join-item btn btn-sm rounded-xl ${quantities[equipment.id] >= equipment.available ? 'btn-disabled' : 'btn-outline'}`}
                      onClick={() => handleIncrease(equipment.id)}
                      disabled={quantities[equipment.id] >= equipment.available}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <span className="join-item btn btn-sm pointer-events-none rounded-xl">
                      {quantities[equipment.id]}
                    </span>
                    <button 
                      className="join-item btn btn-sm btn-outline rounded-xl" 
                      onClick={() => handleDecrease(equipment.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button 
                    className={`btn btn-sm rounded-xl ${equipment.available <= 0 ? 'btn-disabled' : 'btn-outline'}`}
                    onClick={() => handleIncrease(equipment.id)}
                    disabled={equipment.available <= 0}
                  >
                    {equipment.available > 0 ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </>
                    ) : 'ไม่พร้อมให้ยืม'}
                  </button>
                )
              ) : (
                <button className="btn btn-sm btn-outline rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  รายละเอียด
                </button>
              )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Bar (fixed at bottom) */}
        {totalSelectedItems > 0 && (
        <div className="fixed bottom-10 left-auto right-10 bg-base-100 shadow-lg p-4 rounded-2xl">
          <div className="max-w-8xl mx-auto flex justify-between items-center gap-7">
            <div className="text-lg text-neutral-content font-medium flex items-center gap-2">
              <MdShoppingCart />  
              {totalSelectedItems} รายการที่เลือก
            </div>
            <div className="flex justify-between gap-2">
              <button 
                className="btn btn-error rounded-xl"
                onClick={() => setQuantities({})}
              >
                ยกเลิก
              </button>
              <button 
                className="btn btn-primary rounded-xl"
                onClick={handleConfirm}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

        {filteredEquipment.length === 0 && (
          <div className="text-center py-8 text-gray-500 rounded-xl">
            ไม่พบครุภัณฑ์ที่ตรงกับการค้นหา
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;