import {
  Assignment as AssignmentIcon,
  AssignmentReturn as AssignmentReturnIcon,
  BarChart as BarChartIcon,
  Build as BuildIcon,
  BusinessCenter as BusinessCenterIcon,
  Category as CategoryIcon,
  CheckCircle as DoneIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Notifications as NotificationsIcon,
  Pending as PendingIcon,
  PieChartOutline as PieChartOutlineIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Derived data based on analysis of BorrowApprovalList.jsx, Historyborrow.jsx, 
// RepairApprovalList.jsx, and HistoryRepair.jsx mockData
const borrowingCount = 1; // From Historyborrow.jsx (1 item with status "borrowing")
const pendingBorrowCount = 2; // From BorrowApprovalList.jsx (2 items with status "pending")
const pendingRepairCount = 2; // From RepairApprovalList.jsx (2 items with status "pending")
const approvedRepairCount = 1; // From RepairApprovalList.jsx (1 item with status "approved")
const inProgressRepairCount = 1; // From HistoryRepair.jsx (1 item with status "inprogress")

const itemsInRepairTotal = inProgressRepairCount + approvedRepairCount; // 1 + 1 = 2

const initialDashboardStats = {
  totalEquipment: 270,
  availableEquipment: 150,
  borrowedEquipment: 75,
  pendingRequests: pendingBorrowCount + pendingRepairCount,
  lateReturns: 8
};

// Reporting data derived from executive files
// Equipment categories data (most borrowed by category)
const equipmentCategoryData = [
  { name: 'อุปกรณ์คอมพิวเตอร์', count: 28, color: '#8884d8' },
  { name: 'อุปกรณ์สำนักงาน', count: 23, color: '#82ca9d' },
  { name: 'อุปกรณ์การประชุม', count: 15, color: '#ffc658' },
  { name: 'อุปกรณ์มัลติมีเดีย', count: 12, color: '#ff8042' },
  { name: 'อุปกรณ์พกพา', count: 10, color: '#0088fe' }
];

// Department borrowing statistics
const departmentBorrowData = [
  { name: 'แผนกไอที', count: 25, color: '#8884d8' },
  { name: 'แผนกการตลาด', count: 18, color: '#82ca9d' },
  { name: 'แผนกบัญชี', count: 15, color: '#ffc658' },
  { name: 'แผนกบริหาร', count: 12, color: '#ff8042' },
  { name: 'แผนกทรัพยากรบุคคล', count: 10, color: '#0088fe' }
];

// Monthly trends data (borrowing and repairs)
const monthlyTrendsData = [
  { month: 'ม.ค.', borrowCount: 30, repairCount: 5 },
  { month: 'ก.พ.', borrowCount: 25, repairCount: 8 },
  { month: 'มี.ค.', borrowCount: 35, repairCount: 7 },
  { month: 'เม.ย.', borrowCount: 28, repairCount: 10 },
  { month: 'พ.ค.', borrowCount: 32, repairCount: 6 }
];

// Equipment repair frequency
const equipmentRepairData = [
  { name: 'เครื่องคอมพิวเตอร์', count: 8, color: '#8884d8' },
  { name: 'เครื่องพิมพ์', count: 6, color: '#82ca9d' },
  { name: 'เครื่องปรับอากาศ', count: 5, color: '#ffc658' },
  { name: 'โปรเจคเตอร์', count: 4, color: '#ff8042' },
  { name: 'ไมโครโฟน', count: 2, color: '#0088fe' }
];

// Sample data from BorrowApprovalList.jsx
const pendingBorrowRequests = [
  { 
    id: "BOR-2025-0001", 
    equipmentName: "โน๊ตบุ๊ค Dell XPS 15", 
    requesterName: "ชัยวัฒน์ มีสุข", 
    department: "แผนกไอที",
    borrowDate: "2025-05-05", 
    dueDate: "2025-05-12",
    status: "รออนุมัติ" 
  },
  { 
    id: "BOR-2025-0002", 
    equipmentName: "เครื่องพิมพ์ HP LaserJet", 
    requesterName: "สุดารัตน์ แสงทอง", 
    department: "แผนกบัญชี",
    borrowDate: "2025-05-06", 
    dueDate: "2025-05-09",
    status: "รออนุมัติ" 
  }
];

// Sample data from RepairApprovalList.jsx
const pendingRepairRequests = [
  { 
    id: "REP-2025-0001", 
    equipmentName: "เครื่องคอมพิวเตอร์ Dell", 
    requesterName: "ชัยวัฒน์ มีสุข", 
    department: "แผนกไอที",
    requestDate: "2025-05-01", 
    estimatedCost: "2,500",
    status: "รออนุมัติ",
    priority: "ปานกลาง"
  },
  { 
    id: "REP-2025-0002", 
    equipmentName: "เครื่องพิมพ์ HP LaserJet", 
    requesterName: "สุดารัตน์ แสงทอง", 
    department: "แผนกบัญชี",
    requestDate: "2025-05-03", 
    estimatedCost: "1,200",
    status: "รออนุมัติ",
    priority: "ต่ำ"
  }
];

const newMyRequestsData = [
  { id: "BOR-2025-0001", item: "โน๊ตบุ๊ค Dell XPS 15", user: "ชัยวัฒน์ มีสุข", status: "รออนุมัติ", requestDate: "2025-05-05", borrowDate: "2025-05-05", returnDate: "2025-05-12" },
  { id: "BOR-2025-0002", item: "เครื่องพิมพ์ HP LaserJet", user: "สุดารัตน์ แสงทอง", status: "รออนุมัติ", requestDate: "2025-05-06", borrowDate: "2025-05-06", returnDate: "2025-05-09" },
];

const DashboardExeutive = () => {
  const [stats] = useState(initialDashboardStats);

  const equipmentStatusData = [
    { name: 'พร้อมใช้งาน', value: stats.availableEquipment, color: '#4CAF50' },
    { name: 'ถูกยืม', value: stats.borrowedEquipment, color: '#2196F3' },
    { name: 'ซ่อมบำรุง', value: itemsInRepairTotal, color: '#FF9800' }
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

  // Custom columns for approval tables
  const borrowApprovalColumns = [
    { field: 'id', headerName: 'รหัสคำขอ', width: 130 },
    { field: 'equipmentName', headerName: 'อุปกรณ์', width: 200 },
    { field: 'requesterName', headerName: 'ผู้ขอ', width: 150 },
    { field: 'status', headerName: 'สถานะ', width: 110, renderCell: (params) => (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full text-yellow-700 bg-yellow-100">
        {params.value}
      </span>
    )},
    { field: 'borrowDate', headerName: 'วันที่ยืม', width: 100 },
    { field: 'dueDate', headerName: 'วันที่คืน', width: 100 }
  ];
  
  const repairApprovalColumns = [
    { field: 'id', headerName: 'รหัสคำขอ', width: 130 },
    { field: 'equipmentName', headerName: 'อุปกรณ์', width: 200 },
    { field: 'requesterName', headerName: 'ผู้ขอ', width: 150 },
    { field: 'status', headerName: 'สถานะ', width: 110, renderCell: (params) => (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full text-yellow-700 bg-yellow-100">
        {params.value}
      </span>
    )},
    { field: 'requestDate', headerName: 'วันที่แจ้ง', width: 100 },
    { field: 'estimatedCost', headerName: 'ค่าใช้จ่าย (บาท)', width: 130 },
    { field: 'priority', headerName: 'ความสำคัญ', width: 110 }
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
      case 'แจ้งเตือน': return <NotificationsIcon className="text-yellow-500" />;
      case 'คำขอใหม่': return <PendingIcon className="text-blue-500" />;
      case 'ครุภัณฑ์ใหม่': return <InventoryIcon className="text-purple-500" />;
      case 'เกินกำหนด': return <WarningIcon className="text-red-500" />;
      default: return <ListAltIcon className="text-gray-500" />;
    }
  };

  const statCardsData = [
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
            แดชบอร์ดผู้บริหาร
        </motion.h1>

        {/* Stats Cards */}
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8"
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

        {/* New Approval Sections */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Borrow Approval List */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <AssignmentIcon className="mr-2 text-blue-500" />
                คำขอยืมรออนุมัติ ({pendingBorrowRequests.length})
              </h2>
              <Link 
                to="/BorrowApprovalList"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                ดูทั้งหมด
              </Link>
            </div>
            <div className="h-[300px] w-full">
              <DataGrid
                rows={pendingBorrowRequests}
                columns={borrowApprovalColumns}
                pageSize={4}
                rowsPerPageOptions={[4]}
                disableSelectionOnClick
                autoHeight={false}
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

          {/* Repair Approval List */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <BuildIcon className="mr-2 text-orange-500" />
                คำขอซ่อมรออนุมัติ ({pendingRepairRequests.length})
              </h2>
              <Link 
                to="/Repair"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                ดูทั้งหมด
              </Link>
            </div>
            <div className="h-[300px] w-full">
              <DataGrid
                rows={pendingRepairRequests}
                columns={repairApprovalColumns}
                pageSize={4}
                rowsPerPageOptions={[4]}
                disableSelectionOnClick
                autoHeight={false}
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

        {/* Main Content Area - Two Column Layout */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8" variants={containerVariants}>
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

            {/* Reports and Analytics Section */}
            <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants} 
                whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-xl font-semibold mb-5 text-gray-700 pb-3 flex items-center">
                <BarChartIcon className="mr-2 text-indigo-600" />
                รายงานและวิเคราะห์การใช้งาน
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Trends Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                    <TrendingUpIcon className="mr-1 text-blue-500 h-4 w-4" />
                    แนวโน้มการยืมและซ่อมรายเดือน
                  </h3>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyTrendsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="borrowCount" name="จำนวนการยืม" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="repairCount" name="จำนวนการซ่อม" stroke="#F97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Department Borrowing Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                    <BusinessCenterIcon className="mr-1 text-purple-500 h-4 w-4" />
                    สถิติการยืมตามแผนก
                  </h3>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentBorrowData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" name="จำนวนการยืม" fill="#8884d8" radius={[0, 4, 4, 0]}>
                          {departmentBorrowData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Second row of charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Equipment Categories Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                    <CategoryIcon className="mr-1 text-green-500 h-4 w-4" />
                    หมวดหมู่อุปกรณ์ที่ถูกยืมมากที่สุด
                  </h3>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={equipmentCategoryData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" name="จำนวนการยืม" radius={[4, 4, 0, 0]}>
                          {equipmentCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Equipment Repair Frequency */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                    <BuildIcon className="mr-1 text-orange-500 h-4 w-4" />
                    อุปกรณ์ที่มีการซ่อมบำรุงบ่อยที่สุด
                  </h3>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={equipmentRepairData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {equipmentRepairData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Span 1) - Upcoming Returns & Recent Activities */}
          <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
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