import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MdAdd, MdRemove, MdSearch, MdShoppingCart } from "react-icons/md";
import { getCategories, getEquipment } from '../../utils/api'; // เพิ่ม getCategories
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
  const [equipmentData, setEquipmentData] = useState([]);
  const [categories, setCategories] = useState(['ทั้งหมด']); // default 'ทั้งหมด'
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลจาก API
  useEffect(() => {
    setLoading(true);
    getEquipment()
      .then(data => {
        // map field ให้ตรงกับ UI เดิม
        const mapped = data.map(item => ({
          id: item.id,
          name: item.name,
          code: item.id, // ใช้ id เป็น code ถ้าไม่มี field code
          category: item.category,
          status: item.status, // ต้องตรงกับค่าที่ใช้ในปุ่ม
          dueDate: '', // ไม่มีใน db, ใส่ค่าว่าง
          image: item.pic, // ใช้ pic จาก db
          available: item.quantity, // ใช้ quantity เป็น available
          specifications: item.description, // ใช้ description เป็น specifications
          location: '', // ไม่มีใน db, ใส่ค่าว่าง
          purchaseDate: '', // ไม่มีใน db, ใส่ค่าว่าง
          price: '', // ไม่มีใน db, ใส่ค่าว่าง
          unit: item.unit // เพิ่ม unit ถ้าต้องใช้
        }));
        setEquipmentData(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  // โหลด category จาก API
  useEffect(() => {
    getCategories().then(data => {
      // สมมติ field ชื่อหมวดหมู่คือ name
      const names = data.map(item => item.name);
      setCategories(['ทั้งหมด', ...names]);
    });
  }, []);

  // Extract unique categories from equipment data
  const categoryOptions = ['ทั้งหมด', ...new Set(equipmentData.map(item => item.category))];

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
      case 'พร้อมใช้งาน':
        return <span className={`${baseClasses} badge-success text-white`}>พร้อมใช้งาน</span>;
      case 'ถูกยืม':
        return <span className={`${baseClasses} badge-warning text-black`}>ถูกยืม</span>;
      case 'รออนุมัติซ่อม':
      case 'ชำรุด':
      case 'ระหว่างซ่อม':
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
    const selectedList = Object.entries(quantities).map(([id, qty]) => {
      const equipment = equipmentData.find(item => item.id === parseInt(id));
      return {
        id: equipment.id,
        name: equipment.name,
        qty,
        unit: equipment.unit
      };
    });
    // ส่ง selectedList และ borrowData ไป backend ได้เลย
    // เช่น
    // fetch('/api/borrow', { method: 'POST', body: JSON.stringify({ items: selectedList, ...borrowData }) })
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.header 
        className="bg-white"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-gray-900">ระบบยืมคืนครุภัณฑ์</h1>
            <p className="mt-2 text-lg text-gray-600">คณะวิทยาการสารสนเทศ</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-auto mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white">
        {loading ? (
          <div className="text-center py-12 text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : (
          <>
            {/* Search and Filter Section */}
            <motion.div 
              className="mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Search Bar */}
              <motion.div 
                className="mb-6"
                variants={itemVariants}
              >
                <div className="relative max-w-3xl mx-auto">
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
              </motion.div>

              {/* Filter Controls */}
              <motion.div 
                className="bg-white p-6 mb-6 bg-gradient-to-r from-indigo-950 to-blue-700 rounded-2xl"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex flex-col px-6 md:flex-row md:items-center md:justify-between gap-4">
                  {/* Status Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">สถานะ</h3>
                    <div className="flex flex-wrap gap-2">
                      {['ทั้งหมด', 'พร้อมยืม', 'ถูกยืม', 'กำลังซ่อม'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilter(status)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedStatus === status
                              ? 'bg-blue-700 text-white'
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
                    <h3 className="text-sm font-medium text-white mb-2">หมวดหมู่</h3>
                    <select
                      className="block w-full pl-3 pr-10 py-2 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 text-sm rounded-xl"
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
              </motion.div>
            </motion.div>

            {/* Equipment Grid */}
            <motion.div 
              className="mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {filteredEquipment.map((equipment, index) => (
                    <motion.div 
                      key={equipment.id} 
                      className="card rounded-2xl shadow-md hover:shadow-xl bg-white"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
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
                          <p className="text-sm">{equipment.code}</p>
                        </div>
                        
                        <div className="flex flex-col items-center w-full mt-4">
                          {/* เพิ่มข้อความจำนวนคงเหลือ */}
                          <p className="text-sm font-medium text-gray-700">
                            จำนวนคงเหลือ {equipment.available} {equipment.unit || ''}
                          </p>
                          {equipment.status === 'พร้อมยืม' && (
                            <p className="text-sm">คงเหลือ {equipment.available} ชิ้น</p>
                          )}
                          {equipment.dueDate && equipment.status !== 'พร้อมยืม' && (
                            <p className="text-sm">กำหนดคืน {equipment.dueDate}</p>
                          )}
                        </div>

                        <div className="card-actions justify-center">
                          {(equipment.status === 'พร้อมยืม' || equipment.status === 'พร้อมใช้งาน') ? (
                            quantities[equipment.id] ? (
                              <div className="join gap-2">
                                <motion.button 
                                  className={`join-item btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700 ${quantities[equipment.id] >= equipment.available ? 'btn-disabled' : 'btn-ghost'}`}
                                  onClick={() => handleIncrease(equipment.id)}
                                  disabled={quantities[equipment.id] >= equipment.available}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <MdAdd className="w-4 h-4" />
                                </motion.button>
                                <span className="join-item btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700">
                                  {quantities[equipment.id]}
                                </span>
                                <motion.button 
                                  className="join-item btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700" 
                                  onClick={() => handleDecrease(equipment.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <MdRemove className="w-4 h-4" />
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button 
                                className={`btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700 ${equipment.available <= 0 ? 'btn-disabled' : 'btn-ghost'}`}
                                onClick={() => handleIncrease(equipment.id)}
                                disabled={equipment.available <= 0}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {equipment.available > 0 ? (
                                  <MdAdd className="w-4 h-4" />
                                ) : 'ไม่พร้อมให้ยืม'}
                              </motion.button>
                            )
                          ) : (
                            <motion.button 
                              className="btn btn-sm btn-ghost px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-700"
                              onClick={() => showEquipmentDetail(equipment)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MdSearch className="w-4 h-4" />
                              รายละเอียด
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12 bg-white rounded-lg shadow-sm"
                  variants={itemVariants}
                >
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
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </main>

      {/* Floating Cart Summary */}
      {totalSelectedItems > 0 && (
        <motion.div 
          className="fixed bottom-6 right-11 md:bottom-6 md:right-6 bg-white shadow-xl p-4 z-10 rounded-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <MdShoppingCart className="h-6 w-6 text-blue-600" />
              </motion.div>
              <span className="font-medium">
                {totalSelectedItems} รายการที่เลือก
              </span>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setQuantities({})}
                className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ยกเลิก
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ยืนยันการยืม
              </motion.button>
            </div>
          </div>
        </motion.div>
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
    </motion.div>
  );
};

export default Home;