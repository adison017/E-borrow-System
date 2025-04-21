import React, { useState } from 'react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample equipment data
  const equipmentData = [
    {
      id: 1,
      name: 'โน๊ตบุ๊ค Dell XPS 15',
      code: 'IT-001',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png'
    },
    {
      id: 2,
      name: 'โปรเจคเตอร์ Epson EB-U05',
      code: 'AV-002',
      status: 'ถูกยืม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    },
    {
      id: 3,
      name: 'กล้อง Canon EOS 80D',
      code: 'PH-003',
      status: 'กำลังซ่อม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    },
    {
      id: 4,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    },
    {
      id: 5,
      name: 'กล้อง Canon EOS 80D',
      code: 'PH-003',
      status: 'กำลังซ่อม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    },
    {
      id: 6,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    },
    {
      id: 6,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    },
    {
      id: 6,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '15/06/2023',
      image: 'logo.png'
    }
  ];

  const filteredEquipment = equipmentData.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'พร้อมยืม':
        return 'bg-green-100 text-green-800';
      case 'ถูกยืม':
        return 'bg-yellow-100 text-yellow-800';
      case 'กำลังซ่อม':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        
        {/* Equipment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((equipment) => (
            <div key={equipment.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-4">
                <div className="flex justify-center mb-4">
                  <img src={equipment.image} alt={equipment.name} className="h-32 object-contain" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{equipment.name}</h3>
                <p className="text-gray-600 text-sm mb-2">รหัส: {equipment.code}</p>
                <div className="flex items-center mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(equipment.status)}`}>
                    {equipment.status}
                  </span>
                </div>
                {equipment.dueDate && (
                  <p className="text-sm text-gray-500">กำหนดคืน: {equipment.dueDate}</p>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-300">
                  {equipment.status === 'พร้อมยืม' ? 'ยืมครุภัณฑ์' : 'รายละเอียด'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredEquipment.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่พบครุภัณฑ์ที่ตรงกับการค้นหา
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
