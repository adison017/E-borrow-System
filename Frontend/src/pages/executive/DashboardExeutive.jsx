import {
  AssignmentReturn as AssignmentReturnIcon,
  CheckCircle as DoneIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  NotificationsActive as NotificationsActiveIcon,
  Pending as PendingIcon,
  PieChartOutline as PieChartOutlineIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Derived data based on analysis of BorrowApprovalList.jsx, Historyborrow.jsx, 
// RepairApprovalList.jsx, and HistoryRepair.jsx mockData
const borrowingCount = 1; // From Historyborrow.jsx (1 item with status "borrowing")
const pendingBorrowCount = 2; // From BorrowApprovalList.jsx (2 items with status "pending")
const pendingRepairCount = 2; // From RepairApprovalList.jsx (2 items with status "pending")
const approvedRepairCount = 1; // From RepairApprovalList.jsx (1 item with status "approved")
const inProgressRepairCount = 1; // From HistoryRepair.jsx (1 item with status "inprogress")

const itemsInRepairTotal = inProgressRepairCount + approvedRepairCount; // 1 + 1 = 2

const initialDashboardStats = {
  totalEquipment: 180, 
  borrowedEquipment: borrowingCount,
  myPendingRequests: pendingBorrowCount + pendingRepairCount, 
  itemsInRepair: itemsInRepairTotal,
  upcomingReturns: 5,   
  overdueItems: 1,      
  reservedEquipment: 5, 
};
initialDashboardStats.availableEquipment = 
  initialDashboardStats.totalEquipment - 
  initialDashboardStats.borrowedEquipment - 
  initialDashboardStats.itemsInRepair - 
  initialDashboardStats.reservedEquipment; 

const newMyRequestsData = [
  { id: "BOR-2025-0001", item: "โน๊ตบุ๊ค Dell XPS 15", user: "ชัยวัฒน์ มีสุข", status: "รออนุมัติ", requestDate: "2025-05-05", borrowDate: "2025-05-05", returnDate: "2025-05-12" },
  { id: "BOR-2025-0002", item: "เครื่องพิมพ์ HP LaserJet", user: "สุดารัตน์ แสงทอง", status: "รออนุมัติ", requestDate: "2025-05-06", borrowDate: "2025-05-06", returnDate: "2025-05-09" },
];

const DashboardExeutive = () => {
  const [stats] = useState(initialDashboardStats);

  const equipmentStatusData = [
    { name: 'พร้อมใช้งาน', value: stats.availableEquipment, color: '#4CAF50' }, // Green
    { name: 'ถูกยืม', value: stats.borrowedEquipment, color: '#2196F3' },     // Blue
    { name: 'ซ่อมบำรุง', value: stats.itemsInRepair, color: '#FF9800' },   // Orange
    { name: 'จองล่วงหน้า', value: stats.reservedEquipment, color: '#9C27B0'} // Purple for reserved
  ];

  const myRequestsColumns = [
    { field: 'id', headerName: 'รหัสคำขอ', width: 100, cellClassName: 'font-medium' },
    { field: 'item', headerName: 'รายการ', width: 180 },
    { field: 'user', headerName: 'ผู้ขอ', width: 150 },
    { field: 'status', headerName: 'สถานะ', width: 120, renderCell: (params) => {
      let colorClass = 'text-gray-700';
      let bgColorClass = 'bg-gray-100';
      if (params.value === 'อนุมัติแล้ว') { colorClass = 'text-green-700'; bgColorClass = 'bg-green-100'; }
      else if (params.value === 'รออนุมัติ') { colorClass = 'text-yellow-700'; bgColorClass = 'bg-yellow-100'; }
      else if (params.value === 'ปฏิเสธ') { colorClass = 'text-red-700'; bgColorClass = 'bg-red-100'; }
      return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClass} ${bgColorClass}`}>{params.value}</span>;
    }},
    { field: 'requestDate', headerName: 'วันที่ขอ', width: 110 },
    { field: 'borrowDate', headerName: 'วันที่ยืม', width: 110 },
    { field: 'returnDate', headerName: 'วันที่คืน', width: 110 },
  ];

  const upcomingReturnsData = [
    { id: 1, item: 'โน้ตบุ๊ค ASUS', user: 'วันดี มีสุข', returnDate: '22/04/2025', status: 'ปกติ' },
    { id: 2, item: 'กล้องวิดีโอ Sony', user: 'ปรีชา ใจงาม', returnDate: '23/04/2025', status: 'ปกติ' },
    { id: 3, item: 'ลำโพง JBL', user: 'สุชาติ แคล้วรอด', returnDate: '24/04/2025', status: 'ใกล้เกินกำหนด' },
    { id: 4, item: 'iPad Pro', user: 'นารี รักษ์ดี', returnDate: '25/04/2025', status: 'ปกติ' },
    { id: 5, item: 'Macbook Pro 16"', user: 'ทรงพล ตั้งจริง', returnDate: '21/04/2025', status: 'เกินกำหนด' },
  ];

  const recentActivitiesData = [
    { id: 1, type: 'อนุมัติคำขอ', description: 'อนุมัติคำขอยืม Macbook Pro', timestamp: '2 ชั่วโมงที่แล้ว', user: 'คุณหญิง สุขใจ', item: 'Macbook Pro' },
    { id: 2, type: 'แจ้งเตือน', description: 'iPad Pro ครบกำหนดคืนวันนี้', timestamp: '3 ชั่วโมงที่แล้ว', item: 'iPad Pro' },
    { id: 3, type: 'คำขอใหม่', description: 'คำขอยืมโดรนถ่ายภาพ', timestamp: 'เมื่อวานนี้', user: 'แผนกการตลาด', item: 'โดรนถ่ายภาพ' },
    { id: 4, type: 'ครุภัณฑ์ใหม่', description: 'เพิ่มโปรเจคเตอร์ Epson ใหม่', timestamp: '2 วันที่แล้ว', item: 'Projector Epson EB-L200SW' },
    { id: 5, type: 'เกินกำหนด', description: 'Macbook Pro เกินกำหนดคืน', timestamp: 'วันนี้', item: 'Macbook Pro 16"' }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const getStatusColor = (status) => {
    if (status === 'ใกล้เกินกำหนด') return 'border-yellow-500 bg-yellow-50 hover:shadow-yellow-200/50';
    if (status === 'เกินกำหนด') return 'border-red-500 bg-red-50 hover:shadow-red-200/50';
    return 'border-gray-300 bg-white hover:shadow-blue-200/30';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'อนุมัติคำขอ': return <DoneIcon className="text-green-500" />;
      case 'แจ้งเตือน': return <NotificationsActiveIcon className="text-yellow-500" />;
      case 'คำขอใหม่': return <PendingIcon className="text-blue-500" />;
      case 'ครุภัณฑ์ใหม่': return <InventoryIcon className="text-purple-500" />;
      case 'เกินกำหนด': return <ScheduleIcon className="text-red-500" />;
      default: return <ListAltIcon className="text-gray-500" />;
    }
  };

  const statCardsData = [
      { title: 'ครุภัณฑ์ทั้งหมด', value: stats.totalEquipment, icon: <InventoryIcon className="text-blue-500" />, color: "blue" },
      { title: 'พร้อมใช้งาน', value: stats.availableEquipment, icon: <DoneIcon className="text-green-500" />, color: "green" },
      { title: 'ถูกยืม', value: stats.borrowedEquipment, icon: <AssignmentReturnIcon className="text-sky-500" />, color: "sky" },
      { title: 'คำขอรอดำเนินการ', value: stats.myPendingRequests, icon: <PendingIcon className="text-purple-500" />, color: "purple" },
      { title: 'จะครบกำหนดคืน', value: stats.upcomingReturns, icon: <ScheduleIcon className="text-orange-500" />, color: "orange" },
      { title: 'เกินกำหนดคืน', value: stats.overdueItems, icon: <NotificationsActiveIcon className="text-red-500" />, color: "red" }
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
            แดชบอร์ดผู้บริหาร
        </motion.h1>

        {/* Stats Cards */}
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8"
            variants={containerVariants}
        >
          {statCardsData.map(stat => (
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

        {/* Main Content Area - Two Column Layout */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
          {/* Left Column (Span 2) - Equipment Status & My Requests */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            {/* Equipment Status Chart */}
            <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-[420px]"
                variants={itemVariants} 
                whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
                <PieChartOutlineIcon className="mr-2 text-indigo-500" />
                สถานะครุภัณฑ์โดยรวม
              </h2>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={equipmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={40} // Donut chart
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
                  <Legend verticalAlign="bottom" height={36} iconSize={14}/>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* My Requests Table */}
            <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants} 
                whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
                <ListAltIcon className="mr-2 text-blue-500" />
                คำขอยืมของฉัน ({newMyRequestsData.length})
              </h2>
              <div className="h-[350px] w-full">
                <DataGrid
                  rows={newMyRequestsData}
                  columns={myRequestsColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  className="border-none rounded-lg"
                  sx={{
                    fontSize: '0.875rem',
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f9fafb',
                      color: '#374151',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      borderBottom: 'none' 
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: 'none', 
                      padding: '8px 16px',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none' 
                    },
                    '& .MuiDataGrid-virtualScroller': {
                       borderTop: '1px solid #e5e7eb' 
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Span 1) - Upcoming Returns & Recent Activities */}
          <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
            {/* Upcoming Returns - Enhanced */}
            <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-auto min-h-[420px]"
                variants={itemVariants} 
                whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
                <ScheduleIcon className="mr-2 text-orange-500" />
                รายการที่จะครบกำหนดคืน
              </h2>
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {upcomingReturnsData.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${getStatusColor(item.status)} shadow-md hover:shadow-lg`}
                    variants={itemVariants} 
                    whileHover={{ scale: 1.02}}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.item}</p>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${ 
                        item.status === 'เกินกำหนด' ? 'bg-red-100 text-red-700' : 
                        item.status === 'ใกล้เกินกำหนด' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">ผู้ยืม: {item.user}</p>
                    <p className="text-xs text-gray-500">คืนวันที่: {item.returnDate}</p>
                  </motion.div>
                ))}
                {upcomingReturnsData.length === 0 && 
                  <motion.p className="text-gray-500 text-center py-4" variants={itemVariants}>
                    ไม่มีรายการที่ใกล้ครบกำหนดคืน
                  </motion.p>
                }
              </div>
            </motion.div>

            {/* Recent Activities - New Section */}
            <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-auto min-h-[420px]"
                variants={itemVariants} 
                whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
                <HistoryIcon className="mr-2 text-purple-500" />
                กิจกรรมล่าสุดในระบบ
              </h2>
              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {recentActivitiesData.map((activity) => (
                  <motion.div 
                      key={activity.id} 
                      className="flex items-start p-3 last:border-b-0 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                  >
                    <div className="flex-shrink-0 mt-0.5 mr-3 p-2 bg-gray-100 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm leading-tight">{activity.description} {activity.item && <span className="font-normal text-gray-600">({activity.item})</span>}</p>
                      {activity.user && <p className="text-xs text-gray-500">โดย: {activity.user}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
                {recentActivitiesData.length === 0 && 
                  <motion.p className="text-gray-500 text-center py-4" variants={itemVariants}>
                    ไม่มีกิจกรรมล่าสุด
                  </motion.p>
                }
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardExeutive;