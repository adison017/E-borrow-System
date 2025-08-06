import {
  AssignmentReturn as AssignmentReturnIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  BarChart as BarChartIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  CheckCircle as DoneIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ListAlt as ListAltIcon,
  People as PeopleIcon,
  PieChartOutline as PieChartOutlineIcon,
  ReceiptLong as ReceiptLongIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [stats] = useState({
    totalEquipment: 270,
    availableEquipment: 150,
    borrowedEquipment: 75,
    pendingRequests: 12,
    lateReturns: 8,
    totalUsers: 154,
    totalCategories: 24,
    pendingDelivery: 8,
    pendingReturn: 15,
  });


  const equipmentStatusData = [
    { name: 'พร้อมใช้งาน', value: stats.availableEquipment, color: '#4CAF50' },
    { name: 'ถูกยืม', value: stats.borrowedEquipment, color: '#2196F3' },
    { name: 'ซ่อมบำรุง', value: 30, color: '#FF9800' },
    { name: 'ชำรุด', value: stats.totalEquipment - stats.availableEquipment - stats.borrowedEquipment - 30, color: '#F44336' }
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

  const summaryTableData = [
    {
      id: 1,
      category: 'จัดการครุภัณฑ์',
      icon: <InventoryIcon className="text-blue-500" />,
      count: stats.totalEquipment,
      status: '+5 ใหม่',
      statusColor: 'text-blue-500',
      path: '/equipment'
    },
    {
      id: 3,
      category: 'รายการยืม (รอตรวจสอบ)',
      icon: <ListAltIcon className="text-yellow-500" />,
      count: stats.pendingRequests,
      status: '3 รายการด่วน',
      statusColor: 'text-yellow-500',
      path: '/borrow-list'
    },
    {
      id: 4,
      category: 'รายการส่งมอบ (รอส่งมอบ)',
      icon: <AssignmentTurnedInIcon className="text-indigo-500" />,
      count: stats.pendingDelivery,
      status: '2 วันนี้',
      statusColor: 'text-indigo-500',
      path: '/ReceiveItem'
    },
    {
      id: 5,
      category: 'รายการคืน (รอคืน)',
      icon: <AssignmentReturnIcon className="text-teal-500" />,
      count: stats.pendingReturn,
      status: '4 วันนี้',
      statusColor: 'text-teal-500',
      path: '/return-list'
    },
    {
      id: 8,
      category: 'คืนเกินกำหนด',
      icon: <WarningIcon className="text-red-500" />,
      count: stats.lateReturns,
      status: `${((stats.lateReturns / stats.borrowedEquipment) * 100 || 0).toFixed(0)}% ของที่ยืม`,
      statusColor: 'text-red-500',
      path: '/return-list'
    }
  ];

  // Additional items for the expanded view
  const additionalSummaryItems = [
    {
      id: 2,
      category: 'จัดการผู้ใช้งาน',
      icon: <PeopleIcon className="text-purple-500" />,
      count: stats.totalUsers,
      status: '+2 ใหม่',
      statusColor: 'text-green-500',
      path: '/members'
    },
    {
      id: 6,
      category: 'จัดการหมวดหมู่',
      icon: <CategoryIcon className="text-amber-500" />,
      count: stats.totalCategories,
      status: '',
      statusColor: '',
      path: '/category'
    }
  ];

  const recentActivitiesData = [
    { id: 1, user: 'พัชรา วิชัย', action: 'คืนอุปกรณ์', item: 'โน้ตบุ๊ค ASUS', timestamp: '21/04/2025 14:30', type: 'return' },
    { id: 2, user: 'อนันต์ ศรีสมบูรณ์', action: 'ยืมอุปกรณ์', item: 'กล้องวิดีโอ Sony', timestamp: '21/04/2025 13:45', type: 'borrow' },
    { id: 3, user: 'แอดมิน', action: 'เพิ่มครุภัณฑ์ใหม่', item: 'เครื่องพิมพ์ Canon', timestamp: '21/04/2025 11:20', type: 'new_item' },
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

  return (
    <motion.div
      className="p-6 md:p-8 flex-grow bg-gray-50 text-gray-800 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-3xl font-bold mb-10 text-gray-800 pl-2"
          variants={itemVariants}
        >
          แดชบอร์ดผู้ดูแลระบบ
        </motion.h1>

        {/* Summary Table - Now with integrated navigation */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <ListAltIcon className="mr-2 text-blue-600" />
            ภาพรวมและทางลัด
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {summaryTableData.map((item) => (
              <motion.div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-150 ${item.path ? 'cursor-pointer hover:bg-blue-50/40' : ''}`}
                onClick={() => item.path && navigate(item.path)}
                whileHover={item.path ? { scale: 1.01 } : {}}
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${item.statusColor?.replace('text-', 'bg-').replace('-500', '-100')}`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.category}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center justify-center min-w-[60px]">
                    <span className="font-bold text-xl text-gray-700">{item.count}</span>
                  </div>
                  <div className="min-w-[120px] text-right">
                    {item.status ? (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${item.statusColor?.replace('text-', 'bg-').replace('-500', '-50')} ${item.statusColor}`}>
                        {item.status}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Dashboard Content */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" variants={containerVariants}>
          {/* Equipment Status Chart */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-[370px]"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-700 pb-3 flex items-center border-b border-gray-100">
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
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                <Legend verticalAlign="bottom" height={36} iconSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Borrow/Return Trends */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-[370px]"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-700 pb-3 flex items-center border-b border-gray-100">
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
                <Legend verticalAlign="bottom" height={36} iconSize={12} />
                <Bar dataKey="การยืม" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={15} />
                <Bar dataKey="การคืน" fill="#10b981" radius={[4, 4, 0, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-[370px]"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-700 pb-3 flex items-center border-b border-gray-100">
              <HistoryIcon className="mr-2 text-purple-500" />
              กิจกรรมล่าสุด
            </h2>
            <div className="space-y-3">
              {recentActivitiesData.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  variants={itemVariants}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex-shrink-0 mt-1 mr-3 p-2 bg-gray-50 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{activity.action} - <span className="font-normal text-gray-600">{activity.item}</span></p>
                    <p className="text-xs text-gray-500 mt-1">ผู้ดำเนินการ: {activity.user}</p>
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

        {/* Second Row: Top Borrowed Items */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 mb-12"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-700 pb-3 flex items-center border-b border-gray-100">
            <AssignmentReturnIcon className="mr-2 text-sky-500" />
            อุปกรณ์ที่ถูกยืมบ่อย
          </h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topBorrowedItems}
                margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
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
          </div>
        </motion.div>

        {/* Additional Management Options */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-700 pb-3 flex items-center border-b border-gray-100">
            <CategoryIcon className="mr-2 text-amber-600" />
            การจัดการระบบเพิ่มเติม
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {additionalSummaryItems.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                onClick={() => item.path && navigate(item.path)}
              >
                <div className="p-3 rounded-full bg-gray-100">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.category}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-gray-700">{item.count}</span>
                    <span className={`text-xs ${item.statusColor}`}>{item.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardAdmin;