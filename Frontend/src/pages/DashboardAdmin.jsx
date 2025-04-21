import React, { useState } from 'react';
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import {
  Inventory as InventoryIcon,
  CheckCircle as DoneIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const DashboardAdmin = () => {
  const [stats] = useState({
    totalEquipment: 270,
    availableEquipment: 150,
    borrowedEquipment: 75,
    pendingRequests: 12,
    lateReturns: 8
  });

  // Data สำหรับกราฟ
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
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            อนุมัติ
          </button>
          <button className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm">
            ปฏิเสธ
          </button>
        </div>
      )
    },
  ];

  const pendingRequestsRows = [
    { id: 'REQ001', user: 'สมชาย ใจดี', item: 'โน้ตบุ๊ค Dell XPS', requestDate: '20/04/2025', borrowDate: '22/04/2025', returnDate: '25/04/2025' },
    { id: 'REQ002', user: 'วิมล ศรีสุข', item: 'โปรเจกเตอร์ Epson', requestDate: '20/04/2025', borrowDate: '21/04/2025', returnDate: '23/04/2025' },
    { id: 'REQ003', user: 'รุ่งนภา แสงทอง', item: 'กล้อง Canon EOS', requestDate: '19/04/2025', borrowDate: '23/04/2025', returnDate: '27/04/2025' },
    { id: 'REQ004', user: 'ภาณุ วงศ์ใหญ่', item: 'iPad Pro', requestDate: '19/04/2025', borrowDate: '22/04/2025', returnDate: '24/04/2025' },
    { id: 'REQ005', user: 'กรรณิการ์ มีสุข', item: 'ไมโครโฟนไร้สาย', requestDate: '18/04/2025', borrowDate: '21/04/2025', returnDate: '22/04/2025' },
  ];

  const recentActivitiesData = [
    { id: 1, user: 'พัชรา วิชัย', action: 'คืนอุปกรณ์', item: 'โน้ตบุ๊ค ASUS', timestamp: '21/04/2025 14:30' },
    { id: 2, user: 'อนันต์ ศรีสมบูรณ์', action: 'ยืมอุปกรณ์', item: 'กล้องวิดีโอ Sony', timestamp: '21/04/2025 13:45' },
    { id: 3, user: 'แอดมิน', action: 'เพิ่มครุภัณฑ์ใหม่', item: 'เครื่องพิมพ์ Canon', timestamp: '21/04/2025 11:20' },
    { id: 4, user: 'แอดมิน', action: 'อัปเดตสถานะครุภัณฑ์', item: 'โปรเจกเตอร์ BenQ', timestamp: '21/04/2025 10:15' },
    { id: 5, user: 'สุนิสา รักดี', action: 'ยืมอุปกรณ์', item: 'ลำโพง JBL', timestamp: '21/04/2025 09:30' },
  ];

  return (
    <div className="p-6 flex-grow text-black">
      <h1 className="text-3xl font-bold mb-8">แดชบอร์ดผู้ดูแลระบบ</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {/* Total Equipment */}
        <div className="bg-blue-300 p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">ครุภัณฑ์ทั้งหมด</p>
          <p className="text-3xl font-bold my-2">{stats.totalEquipment}</p>
          <div className="flex items-center">
            <InventoryIcon className="text-blue-500" />
          </div>
        </div>

        {/* Available Equipment */}
        <div className="bg-green-300 p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">พร้อมใช้งาน</p>
          <p className="text-3xl font-bold my-2 text-green-500">{stats.availableEquipment}</p>
          <div className="flex items-center">
            <DoneIcon className="text-green-500" />
          </div>
        </div>

        {/* Borrowed Equipment */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">ถูกยืม</p>
          <p className="text-3xl font-bold my-2 text-blue-500">{stats.borrowedEquipment}</p>
          <div className="flex items-center">
            <AssignmentReturnIcon className="text-blue-500" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">คำขอรออนุมัติ</p>
          <p className="text-3xl font-bold my-2 text-yellow-500">{stats.pendingRequests}</p>
          <div className="flex items-center">
            <NotificationsIcon className="text-yellow-500" />
          </div>
        </div>

        {/* Late Returns */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">คืนเกินกำหนด</p>
          <p className="text-3xl font-bold my-2 text-red-500">{stats.lateReturns}</p>
          <div className="flex items-center">
            <WarningIcon className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Equipment Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow h-[360px]">
          <h2 className="text-xl font-semibold mb-4">สถานะครุภัณฑ์</h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={equipmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {equipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Borrow/Return Trends */}
        <div className="bg-white p-6 rounded-lg shadow h-[360px]">
          <h2 className="text-xl font-semibold mb-4">แนวโน้มการยืม-คืน</h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={borrowReturnData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="การยืม" fill="#2196F3" />
              <Bar dataKey="การคืน" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">คำขอรออนุมัติ</h2>
        <div className="h-[400px] w-full">
          <DataGrid
            rows={pendingRequestsRows}
            columns={pendingRequestsColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Borrowed Items */}
        <div className="bg-white p-6 rounded-lg shadow h-[360px]">
          <h2 className="text-xl font-semibold mb-4">อุปกรณ์ที่ถูกยืมบ่อย</h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              layout="vertical"
              data={topBorrowedItems}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow h-[360px]">
          <h2 className="text-xl font-semibold mb-4">กิจกรรมล่าสุด</h2>
          <div className="max-h-[280px] overflow-y-auto">
            {recentActivitiesData.map((activity) => (
              <div key={activity.id} className="border-b border-gray-200 py-3">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 text-xs rounded mr-2 ${
                    activity.action === 'ยืมอุปกรณ์' ? 'bg-blue-100 text-blue-800' :
                    activity.action === 'คืนอุปกรณ์' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.action}
                  </span>
                  <p className="text-sm">{activity.item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;