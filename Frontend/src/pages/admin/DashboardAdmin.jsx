import {
  AssignmentReturn as AssignmentReturnIcon,
  CheckCircle as DoneIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Notifications as NotificationsIcon,
  PieChartOutline as PieChartOutlineIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const DashboardAdmin = () => {
  const [stats] = useState({
    totalEquipment: 270,
    availableEquipment: 150,
    borrowedEquipment: 75,
    pendingRequests: 12,
    lateReturns: 8
  });

  const equipmentStatusData = [
    { name: 'พร้อมใช้งาน', value: 150, color: '#4CAF50' },
    { name: 'ถูกยืม', value: 75, color: '#2196F3' },
    { name: 'ซ่อมบำรุง', value: 30, color: '#FF9800' },
    { name: 'ชำรุด', value: 15, color: '#F44336' }
  ];

  const borrowReturnData = [
    { month: 'ม.ค.', การยืม: 45, การคืน: 40 },
    { month: 'ก.พ.', การยืม: 52, การคืน: 48 },
    { month: 'มี.ค.', การยืม: 48, การคืน: 50 },
    { month: 'เม.ย.', การยืม: 60, การคืน: 55 },
    { month: 'พ.ค.', การยืม: 55, การคืน: 58 },
    { month: 'มิ.ย.', การยืม: 65, การคืน: 60 }
  ];

  const topBorrowedItems = [
    { name: 'โน้ตบุ๊ค Dell XPS', count: 38 },
    { name: 'โปรเจกเตอร์ Epson', count: 32 },
    { name: 'กล้อง Canon EOS', count: 28 },
    { name: 'เครื่องพิมพ์ HP LaserJet', count: 25 },
    { name: 'ไมโครโฟนไร้สาย', count: 20 }
  ];

  const pendingRequestsColumns = [
    { field: 'id', headerName: 'รหัสคำขอ', width: 100 },
    { field: 'user', headerName: 'ผู้ขอยืม', width: 170 },
    { field: 'item', headerName: 'รายการ', width: 200 },
    { field: 'requestDate', headerName: 'วันที่ขอ', width: 120 },
    { field: 'borrowDate', headerName: 'วันที่ยืม', width: 120 },
    { field: 'returnDate', headerName: 'วันที่คืน', width: 120 },
    { 
      field: 'actions', 
      headerName: 'การจัดการ', 
      width: 180,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            อนุมัติ
          </button>
          <button className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 text-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5">
            ปฏิเสธ
          </button>
        </div>
      )
    },
  ];

  const recentActivitiesData = [
    { id: 1, user: 'พัชรา วิชัย', action: 'คืนอุปกรณ์', item: 'โน้ตบุ๊ค ASUS', timestamp: '21/04/2025 14:30', type: 'return' },
    { id: 2, user: 'อนันต์ ศรีสมบูรณ์', action: 'ยืมอุปกรณ์', item: 'กล้องวิดีโอ Sony', timestamp: '21/04/2025 13:45', type: 'borrow' },
    { id: 3, user: 'แอดมิน', action: 'เพิ่มครุภัณฑ์ใหม่', item: 'เครื่องพิมพ์ Canon', timestamp: '21/04/2025 11:20', type: 'new_item' },
    { id: 4, user: 'แอดมิน', action: 'อัปเดตสถานะครุภัณฑ์', item: 'โปรเจกเตอร์ BenQ', timestamp: '21/04/2025 10:15', type: 'update_status' },
    { id: 5, user: 'สุนิสา รักดี', action: 'ยืมอุปกรณ์', item: 'ลำโพง JBL', timestamp: '21/04/2025 09:30', type: 'borrow' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'borrow': return <AssignmentReturnIcon className="text-blue-500" />;
      case 'return': return <DoneIcon className="text-green-500" />;
      case 'new_item': return <InventoryIcon className="text-purple-500" />;
      case 'update_status': return <TrendingUpIcon className="text-indigo-500" />;
      default: return <ListAltIcon className="text-gray-500" />;
    }
  };

  const statCards = [
    { title: 'ครุภัณฑ์ทั้งหมด', value: stats.totalEquipment, icon: <InventoryIcon className="text-blue-500" />, color: "blue" },
    { title: 'พร้อมใช้งาน', value: stats.availableEquipment, icon: <DoneIcon className="text-green-500" />, color: "green" },
    { title: 'ถูกยืม', value: stats.borrowedEquipment, icon: <AssignmentReturnIcon className="text-sky-500" />, color: "sky" },
    { title: 'คำขอรออนุมัติ', value: stats.pendingRequests, icon: <NotificationsIcon className="text-yellow-500" />, color: "yellow" },
    { title: 'คืนเกินกำหนด', value: stats.lateReturns, icon: <WarningIcon className="text-red-500" />, color: "red" }
  ];

  return (
    <motion.div 
      className="p-6 md:p-8 flex-grow bg-white text-gray-800 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-gray-800 pb-4"
          variants={itemVariants}
        >
          แดชบอร์ดผู้ดูแลระบบ
        </motion.h1>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-8 justify-center"
          variants={containerVariants}
        >
          {statCards.map(stat => (
            <motion.div 
              key={stat.title} 
              className={`bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-${stat.color}-500`}
              variants={itemVariants} 
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className={`text-3xl font-bold my-1 text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      {stat.icon}
                  </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Tables */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" variants={containerVariants}>
          {/* Equipment Status Chart */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-[400px]"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
              <PieChartOutlineIcon className="mr-2 text-indigo-500" />
              สถานะครุภัณฑ์
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={equipmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend verticalAlign="bottom" height={36} iconSize={14} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Borrow/Return Trends */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-[400px]"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
              <TrendingUpIcon className="mr-2 text-teal-500" />
              แนวโน้มการยืม-คืน
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={borrowReturnData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend verticalAlign="bottom" height={36} iconSize={14} />
                <Bar dataKey="การยืม" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="การคืน" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        
        {/* Bottom Row */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={containerVariants}>
          {/* Top Borrowed Items */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-[400px]"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
              <AssignmentReturnIcon className="mr-2 text-sky-500" />
              อุปกรณ์ที่ถูกยืมบ่อย
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                layout="vertical"
                data={topBorrowedItems}
                margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" width={120} fontSize={12} tick={{ textAnchor: 'end' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activities */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-[400px]"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
              <HistoryIcon className="mr-2 text-purple-500" />
              กิจกรรมล่าสุด
            </h2>
            <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {recentActivitiesData.map((activity) => (
                <motion.div 
                    key={activity.id} 
                    className="flex items-start p-3 last:border-b-0 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ x: 3 }}
                >
                  <div className="flex-shrink-0 mt-1 mr-3 p-2 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{activity.action} - <span className="font-normal text-gray-600">{activity.item}</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">ผู้ดำเนินการ: {activity.user}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
              {recentActivitiesData.length === 0 && (
                <motion.p className="text-gray-500 text-center py-4" variants={itemVariants}>
                  ไม่มีกิจกรรมล่าสุด
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardAdmin;