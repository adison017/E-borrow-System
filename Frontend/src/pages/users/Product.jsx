import React, { useState } from 'react';
import { MdShoppingCart, MdClose, MdSearch, MdAdd, MdRemove, MdSend } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

// Sample borrowing and repair history data
const historyData = {
  1: [
    { 
      type: 'borrow', 
      date: '10/05/2023', 
      returnDate: '17/05/2023', 
      borrower: 'นายสมชาย ใจดี', 
      status: 'คืนแล้ว',
      reason: 'ใช้ในการนำเสนอโครงการ'
    },
    { 
      type: 'borrow', 
      date: '20/05/2023', 
      returnDate: '27/05/2023', 
      borrower: 'นางสาวสมหญิง ใจกว้าง', 
      status: 'คืนแล้ว',
      reason: 'ใช้ในการประชุมวิชาการ'
    }
  ],
  2: [
    { 
      type: 'borrow', 
      date: '01/06/2023', 
      returnDate: '15/06/2023', 
      borrower: 'นายทดสอบ ระบบ', 
      status: 'กำลังยืม',
      reason: 'ใช้ในการสอนวิชาการโปรแกรมมิ่ง'
    },
    { 
      type: 'repair', 
      date: '15/04/2023', 
      description: 'เปลี่ยนหลอดไฟโปรเจคเตอร์', 
      status: 'ซ่อมเสร็จแล้ว',
      cost: '2,500 บาท'
    }
  ],
  3: [
    { 
      type: 'repair', 
      date: '10/06/2023', 
      description: 'ตรวจสอบระบบเซ็นเซอร์กล้อง', 
      status: 'กำลังซ่อม',
      cost: 'ประมาณ 1,800 บาท'
    },
    { 
      type: 'borrow', 
      date: '01/05/2023', 
      returnDate: '08/05/2023', 
      borrower: 'นางสาวทดสอบ ระบบ', 
      status: 'คืนแล้ว',
      reason: 'ใช้ในการถ่ายภาพกิจกรรม'
    }
  ]
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');
  const [quantities, setQuantities] = useState({});
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [borrowData, setBorrowData] = useState({
    reason: '',
    borrowDate: '',
    returnDate: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample equipment data with image references
  const equipmentData = [
    {
      id: 1,
      name: 'โน๊ตบุ๊ค Dell XPS 15',
      code: 'IT-001',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2024/11/Computer/OIN5640101101GTH-1.jpg',
      available: 5,
      specifications: 'หน้าจอ 15.6 นิ้ว, CPU Intel Core i7, RAM 16GB, SSD 512GB',
      location: 'ห้อง Server อาคาร 1 ชั้น 3',
      purchaseDate: '10/01/2022',
      price: '45,000 บาท'
    },
    {
      id: 2,
      name: 'โปรเจคเตอร์ Epson EB-U05',
      code: 'AV-002',
      status: 'ถูกยืม',
      dueDate: '15/06/2023',
      image: '/logo.png',
      available: 0,
      specifications: 'ความสว่าง 3,500 ลูเมน, ความละเอียด Full HD, ขนาด 3.2 กก.',
      location: 'ห้องสื่อการสอน อาคาร 2 ชั้น 1',
      purchaseDate: '15/03/2021',
      price: '22,500 บาท'
    },
    {
      id: 3,
      name: 'กล้อง Canon EOS 80D',
      code: 'PH-003',
      status: 'กำลังซ่อม',
      dueDate: '15/06/2023',
      image: '/logo.png',
      available: 2,
      specifications: 'เซ็นเซอร์ APS-C 24.2MP, ระบบโฟกัส 45 จุด, ถ่ายวิดีโอ Full HD',
      location: 'ห้องกิจกรรม อาคาร 1 ชั้น 1',
      purchaseDate: '05/08/2020',
      price: '32,000 บาท'
    },
    {
      id: 4,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '',
      image: '/logo.png',
      available: 3,
      specifications: 'ไมโครโฟนแบบคอนเดนเซอร์, USB, ความถี่ 20Hz-20kHz',
      location: 'ห้องบันทึกเสียง อาคาร 2 ชั้น 2',
      purchaseDate: '20/11/2021',
      price: '5,900 บาท'
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
    setShowBorrowDialog(true);
    // Set default dates
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 7);
    
    setBorrowData({
      reason: '',
      borrowDate: today.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0]
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle return date change with validation (max 7 days from borrow date)
  const handleReturnDateChange = (e) => {
    const returnDate = new Date(e.target.value);
    const borrowDate = new Date(borrowData.borrowDate);
    const maxReturnDate = new Date(borrowDate);
    maxReturnDate.setDate(borrowDate.getDate() + 7);
    
    if (returnDate > maxReturnDate) {
      alert('วันที่คืนต้องไม่เกิน 7 วันนับจากวันที่ยืม');
      return;
    }
    
    setBorrowData(prev => ({
      ...prev,
      returnDate: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmitBorrow = (e) => {
    e.preventDefault();
    
    // Prepare selected equipment list
    const selectedEquipmentList = Object.entries(quantities).map(([id, qty]) => {
      const equipment = equipmentData.find(item => item.id === parseInt(id));
      return `${equipment.name} (${equipment.code}) ${qty} ชิ้น`;
    }).join('\n');
    
    alert(`ยืนยันการยืมครุภัณฑ์\n\nรายการที่ยืม:\n${selectedEquipmentList}\n\nเหตุผล: ${borrowData.reason}\nวันที่ยืม: ${borrowData.borrowDate}\nวันที่คืน: ${borrowData.returnDate}`);
    
    // Reset everything
    setQuantities({});
    setShowBorrowDialog(false);
  };

  // Calculate max return date (7 days from borrow date)
  const calculateMaxReturnDate = () => {
    if (!borrowData.borrowDate) return '';
    const maxDate = new Date(borrowData.borrowDate);
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split('T')[0];
  };

  // Show image modal
  const showImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Show equipment detail dialog
  const showEquipmentDetail = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDetailDialog(true);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-center">หน้าหลักระบบยืมคืนครุภัณฑ์</h1>
        <p className="mb-6 text-center">ยินดีต้อนรับเข้าสู่ระบบยืมคืนครุภัณฑ์ คณะวิทยาการสารสนเทศ</p>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ค้นหาชื่อครุภัณฑ์หรือรหัส..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="filter mb-8 flex justify-center gap-3 flex-wrap">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredEquipment.map((equipment) => (
            <div key={equipment.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white transition-transform duration-300 hover:scale-105">
              <figure className="px-4 pt-4 relative">
                <img 
                  src={equipment.image} 
                  alt={equipment.name} 
                  className="rounded-xl h-40 w-full object-contain cursor-pointer" 
                  onClick={() => showImageModal(equipment.image)}
                />
                <div className="absolute top-6 right-6">
                  {getStatusBadge(equipment.status)}
                </div>
              </figure>
              <div className="card-body p-4 md:p-6">
                <div className="card-title flex flex-col gap-2">
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

                <div className="card-actions justify-center">
                  {equipment.status === 'พร้อมยืม' ? (
                    quantities[equipment.id] ? (
                      <div className="join gap-2">
                        <button 
                          className={`join-item btn btn-sm rounded-xl ${quantities[equipment.id] >= equipment.available ? 'btn-disabled' : 'btn-outline'}`}
                          onClick={() => handleIncrease(equipment.id)}
                          disabled={quantities[equipment.id] >= equipment.available}
                        >
                          <MdAdd className="w-4 h-4" />
                        </button>
                        <span className="join-item btn btn-sm pointer-events-none rounded-xl">
                          {quantities[equipment.id]}
                        </span>
                        <button 
                          className="join-item btn btn-sm btn-outline rounded-xl" 
                          onClick={() => handleDecrease(equipment.id)}
                        >
                          <MdRemove className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className={`btn btn-sm rounded-xl ${equipment.available <= 0 ? 'btn-disabled' : 'btn-outline'}`}
                        onClick={() => handleIncrease(equipment.id)}
                        disabled={equipment.available <= 0}
                      >
                        {equipment.available > 0 ? (
                          <MdAdd className="w-4 h-4" />
                        ) : 'ไม่พร้อมให้ยืม'}
                      </button>
                    )
                  ) : (
                    <button 
                      className="btn btn-sm btn-outline rounded-xl"
                      onClick={() => showEquipmentDetail(equipment)}
                    >
                      <MdSearch className="w-4 h-4" />
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

        {/* Borrow Dialog */}
        {showBorrowDialog && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
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
                    {Object.entries(quantities).map(([id, qty]) => {
                      const equipment = equipmentData.find(item => item.id === parseInt(id));
                      return (
                        <div key={id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <div 
                            className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => showImageModal(equipment.image)}
                          >
                            <img
                              src={equipment.image}
                              alt={equipment.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{equipment.name}</p>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span className="truncate">รหัส: {equipment.code}</span>
                              <span className="font-semibold">จำนวน: {qty} ชิ้น</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                      <label className="block text-gray-700 font-medium mb-2">วันที่ยืม</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="borrowDate"
                          value={borrowData.borrowDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => document.querySelector('input[name="borrowDate"]').showPicker()}
                        >
                          <FaCalendarAlt />
                        </button>
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
                    >
                      ส่งคำขอยืม
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Detail Dialog */}
        {showDetailDialog && selectedEquipment && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">รายละเอียดครุภัณฑ์</h2>
                  <button
                    onClick={() => setShowDetailDialog(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MdClose className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={selectedEquipment.image}
                        alt={selectedEquipment.name}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => showImageModal(selectedEquipment.image)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedEquipment.name}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">รหัสครุภัณฑ์</p>
                        <p className="font-medium">{selectedEquipment.code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">สถานะ</p>
                        <div className="mt-1">{getStatusBadge(selectedEquipment.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">จำนวนคงเหลือ</p>
                        <p className="font-medium">{selectedEquipment.available} ชิ้น</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">รายละเอียด</p>
                        <p className="font-medium">{selectedEquipment.specifications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">สถานที่จัดเก็บ</p>
                        <p className="font-medium">{selectedEquipment.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">วันที่จัดซื้อ</p>
                        <p className="font-medium">{selectedEquipment.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ราคา</p>
                        <p className="font-medium">{selectedEquipment.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">ประวัติการใช้งาน</h3>
                  <div className="space-y-4">
                    {historyData[selectedEquipment.id]?.length > 0 ? (
                      historyData[selectedEquipment.id].map((history, index) => (
                        <div key={index} className="border-l-4 pl-4 py-2" 
                          style={{ 
                            borderLeftColor: history.type === 'borrow' ? '#383838' : '#383838',
                            backgroundColor: history.type === 'borrow' ? '#e3e3e3' : '#e3e3e3'
                          }}>
                          {history.type === 'borrow' ? (
                            <>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-md text">การยืม <span className={`font-medium ${
                                    history.status === 'คืนแล้ว' ? 'text-sm text-white bg-green-600 rounded-lg px-3 py-1' : 'text-sm bg-yellow-400 rounded-lg px-3 py-1'
                                  }`}>{history.status}</span></p>
                                  <p className="text-md mt-2">ผู้ยืม: {history.borrower}</p>
                                  <p className="text-md">วันที่ยืม: {history.date}</p>
                                  <p className="text-md ">วันที่คืน: {history.returnDate}</p>
                                  <p className="text-md">เหตุผล: {history.reason}</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text">การซ่อมบำรุง <span className={`font-medium ${
                                    history.status === 'ซ่อมเสร็จแล้ว' ? 'text-sm text-white bg-green-600 rounded-lg px-3 py-1' : 'text-sm text-white bg-red-600 rounded-lg px-3 py-1'
                                  }`}>{history.status}</span></p>
                                  <p className="text-md mt-2">วันที่ซ่อม: {history.date}</p>
                                  <p className="text-md">รายละเอียด: {history.description}</p>
                                  <p className="text-md">ค่าใช้จ่าย: {history.cost}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">ไม่มีประวัติการใช้งาน</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 backdrop-blur bg-opacity-90 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh]">
              <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
                onClick={() => setSelectedImage(null)}
              >
                <MdClose className="w-6 h-6" />
              </button>
              <div className="bg-white w-full h-full flex items-center justify-center rounded-lg shadow-xl">
                <img
                  src={selectedImage}
                  alt="Equipment preview"
                  className="w-full max-w-full h-full max-h-[80vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;