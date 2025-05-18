import {
  EventAvailable as EventAvailableIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const DashboardUser = () => {
  const [stats] = useState({
    totalBorrowed: 12,
    currentBorrowed: 3,
    pendingRequests: 2,
    overdueItems: 0
  });

  // Data สำหรับกราฟ
  const requestStatusData = [
    { name: 'อนุมัติแล้ว', value: 8, color: '#4CAF50' },
    { name: 'รออนุมัติ', value: 2, color: '#FFC107' },
    { name: 'ปฏิเสธ', value: 2, color: '#F44336' }
  ];

  const currentBorrowedItems = [
    { id: 1, item: 'โน้ตบุ๊ค Dell XPS', borrowDate: '15/04/2025', returnDate: '22/04/2025', status: 'ปกติ' },
    { id: 2, item: 'โปรเจกเตอร์ Epson', borrowDate: '18/04/2025', returnDate: '25/04/2025', status: 'ปกติ' },
    { id: 3, item: 'ไมโครโฟนไร้สาย', borrowDate: '20/04/2025', returnDate: '27/04/2025', status: 'ปกติ' },
  ];

  const recentActivities = [
    { id: 1, action: 'ยืมอุปกรณ์', item: 'โน้ตบุ๊ค Dell XPS', date: '15/04/2025', status: 'สำเร็จ' },
    { id: 2, action: 'ขออนุมัติ', item: 'โปรเจกเตอร์ Epson', date: '18/04/2025', status: 'อนุมัติ' },
    { id: 3, action: 'คืนอุปกรณ์', item: 'กล้อง Canon EOS', date: '10/04/2025', status: 'สำเร็จ' },
    { id: 4, action: 'ขออนุมัติ', item: 'ไมโครโฟนไร้สาย', date: '20/04/2025', status: 'อนุมัติ' },
  ];

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
      className="p-6 flex-grow text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        แดชบอร์ดผู้ใช้งาน
      </motion.h1>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Borrowed */}
        <motion.div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-gray-500 text-sm">ยืมทั้งหมด</p>
          <p className="text-3xl font-bold my-2">{stats.totalBorrowed}</p>
          <div className="flex items-center">
            <HistoryIcon className="text-blue-500" />
          </div>
        </motion.div>

        {/* Current Borrowed */}
        <motion.div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-gray-500 text-sm">กำลังยืม</p>
          <p className="text-3xl font-bold my-2 text-blue-500">{stats.currentBorrowed}</p>
          <div className="flex items-center">
            <InventoryIcon className="text-blue-500" />
          </div>
        </motion.div>

        {/* Pending Requests */}
        <motion.div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-gray-500 text-sm">รออนุมัติ</p>
          <p className="text-3xl font-bold my-2 text-yellow-500">{stats.pendingRequests}</p>
          <div className="flex items-center">
            <PendingIcon className="text-yellow-500" />
          </div>
        </motion.div>

        {/* Overdue Items */}
        <motion.div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-gray-500 text-sm">เกินกำหนด</p>
          <p className="text-3xl font-bold my-2 text-red-500">{stats.overdueItems}</p>
          <div className="flex items-center">
            <EventAvailableIcon className="text-red-500" />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Request Status Chart */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-4">สถานะคำขอ</h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={requestStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {requestStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Current Borrowed Items */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-4">อุปกรณ์ที่กำลังยืม</h2>
          <div className="space-y-4 mt-4 max-h-[280px] overflow-y-auto">
            {currentBorrowedItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">{item.item}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-gray-500">วันที่ยืม:</p>
                    <p>{item.borrowDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">วันที่คืน:</p>
                    <p>{item.returnDate}</p>
                  </div>
                </div>
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  item.status === 'ปกติ' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-4">กิจกรรมล่าสุด</h2>
          <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                className="flex items-start pb-3 border-b border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`flex-shrink-0 mt-1 w-3 h-3 rounded-full ${
                  activity.status === 'สำเร็จ' || activity.status === 'อนุมัติ' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="ml-3">
                  <p className="font-medium">{activity.action}: {activity.item}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                    activity.status === 'สำเร็จ' || activity.status === 'อนุมัติ' ? 
                    'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="mt-6 bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-xl font-semibold mb-4">ดำเนินการด่วน</h2>
        <div className="flex flex-wrap gap-4">
          <motion.button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ยื่นคำขอยืมอุปกรณ์
          </motion.button>
          <motion.button 
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            แจ้งคืนอุปกรณ์
          </motion.button>
          <motion.button 
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ดูอุปกรณ์ที่มี
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardUser;