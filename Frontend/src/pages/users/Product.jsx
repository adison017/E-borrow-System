import React, { useState } from 'react';
import { MdShoppingCart, MdClose, MdSearch, MdAdd, MdRemove, MdSend } from "react-icons/md";
import BorrowDialog from './dialogs/BorrowDialog';
import EquipmentDetailDialog from './dialogs/EquipmentDetailDialog';
import ImageModal from './dialogs/ImageModal';

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
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
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

  // Sample equipment data with image references and categories
  const equipmentData = [
    {
      id: 1,
      name: 'โน๊ตบุ๊ค Dell XPS 15',
      code: 'IT-001',
      category: 'คอมพิวเตอร์',
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
      category: 'อุปกรณ์มัลติมีเดีย',
      status: 'ถูกยืม',
      dueDate: '15/06/2023',
      image: 'https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2024/11/Computer/OIN5640101101GTH-1.jpg',
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
      category: 'กล้องและอุปกรณ์ถ่ายภาพ',
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
      category: 'อุปกรณ์มัลติมีเดีย',
      status: 'พร้อมยืม',
      dueDate: '',
      image: '/logo.png',
      available: 3,
      specifications: 'ไมโครโฟนแบบคอนเดนเซอร์, USB, ความถี่ 20Hz-20kHz',
      location: 'ห้องบันทึกเสียง อาคาร 2 ชั้น 2',
      purchaseDate: '20/11/2021',
      price: '5,900 บาท'
    },
    {
      id: 5,
      name: 'เครื่องพิมพ์ HP LaserJet Pro',
      code: 'IT-005',
      category: 'อุปกรณ์สำนักงาน',
      status: 'พร้อมยืม',
      dueDate: '',
      image: '/logo.png',
      available: 2,
      specifications: 'ความเร็วพิมพ์ 30 หน้า/นาที, ความละเอียด 1200x1200 dpi',
      location: 'ห้องสำนักงาน อาคาร 1 ชั้น 1',
      purchaseDate: '15/09/2021',
      price: '8,500 บาท'
    }
  ];

  // Extract unique categories from equipment data
  const categories = ['ทั้งหมด', ...new Set(equipmentData.map(item => item.category))];

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

  // Filter equipment based on search, status and category
  const filteredEquipment = equipmentData.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ทั้งหมด' || equipment.status === selectedStatus;
    const matchesCategory = selectedCategory === 'ทั้งหมด' || equipment.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const baseClasses = "badge px-4 py-4 rounded-full text-sm font-medium ";
    switch (status) {
      case 'พร้อมยืม':
        return <span className={`${baseClasses} badge-success text-white`}>พร้อมยืม</span>;
      case 'ถูกยืม':
        return <span className={`${baseClasses} badge-warning text-black`}>ถูกยืม</span>;
      case 'กำลังซ่อม':
        return <span className={`${baseClasses} badge-error text-white`}>กำลังซ่อม</span>;
      default:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
    }
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  // Handle category filter change
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-gray-900">ระบบยืมคืนครุภัณฑ์</h1>
            <p className="mt-2 text-lg text-gray-600">คณะวิทยาการสารสนเทศ</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white">
        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-3xl mx-auto ">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl text-sm"
                placeholder="ค้นหาชื่อครุภัณฑ์หรือรหัส..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">สถานะ</h3>
                <div className="flex flex-wrap gap-2">
                  {['ทั้งหมด', 'พร้อมยืม', 'ถูกยืม', 'กำลังซ่อม'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">หมวดหมู่</h3>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm rounded-xl"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="mb-16 ">
          {filteredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {filteredEquipment.map((equipment) => (
                <div key={equipment.id} className="card rounded-xl shadow-sm hover:shadow-md bg-white transition-transform duration-300 hover:scale-105  ">
                  <figure className="px-4 pt-4 relative">
                    <img 
                      src={equipment.image} 
                      alt={equipment.name} 
                      className="rounded-xl h-40 w-full object-contain cursor-pointer" 
                      onClick={() => showImageModal(equipment.image)}
                    />
                    <div className="absolute top-6 right-6 ">
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
                              className={`join-item btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700 ${quantities[equipment.id] >= equipment.available ? 'btn-disabled' : 'btn-ghost'}`}
                              onClick={() => handleIncrease(equipment.id)}
                              disabled={quantities[equipment.id] >= equipment.available}
                            >
                              <MdAdd className="w-4 h-4" />
                            </button>
                            <span className="join-item btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700">
                              {quantities[equipment.id]}
                            </span>
                            <button 
                              className="join-item btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700" 
                              onClick={() => handleDecrease(equipment.id)}
                            >
                              <MdRemove className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            className={`btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700 ${equipment.available <= 0 ? 'btn-disabled' : 'btn-ghost'}`}
                            onClick={() => handleIncrease(equipment.id)}
                            disabled={equipment.available <= 0}
                          >
                            {equipment.available > 0 ? (
                              <MdAdd className="w-4 h-4 " />
                            ) : 'ไม่พร้อมให้ยืม'}
                          </button>
                        )
                      ) : (
                        <button 
                          className="btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700"
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
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">ไม่พบครุภัณฑ์ที่ตรงกับการค้นหา</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('ทั้งหมด');
                  setSelectedCategory('ทั้งหมด');
                }}
                className="mt-4 btn btn-md btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700 transition-colors"
              >
                ล้างการค้นหา
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Cart Summary */}
      {totalSelectedItems > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl p-4 z-10 animate-bounce-once">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MdShoppingCart className="h-6 w-6 text-blue-600" />
              <span className="font-medium">
                {totalSelectedItems} รายการที่เลือก
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setQuantities({})}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ยืนยันการยืม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <BorrowDialog
        showBorrowDialog={showBorrowDialog}
        setShowBorrowDialog={setShowBorrowDialog}
        quantities={quantities}
        equipmentData={equipmentData}
        borrowData={borrowData}
        handleInputChange={handleInputChange}
        handleReturnDateChange={handleReturnDateChange}
        handleSubmitBorrow={handleSubmitBorrow}
        calculateMaxReturnDate={calculateMaxReturnDate}
        showImageModal={showImageModal}
      />

      <EquipmentDetailDialog
        showDetailDialog={showDetailDialog}
        setShowDetailDialog={setShowDetailDialog}
        selectedEquipment={selectedEquipment}
        historyData={historyData}
        showImageModal={showImageModal}
        getStatusBadge={getStatusBadge}
      />

      <ImageModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default Home;