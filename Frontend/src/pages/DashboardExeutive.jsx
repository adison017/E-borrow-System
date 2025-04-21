import React, { useState } from 'react';
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import {
  Inventory as InventoryIcon,
  CheckCircle as DoneIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const DashboardExeutive = () => {
  const [stats] = useState({
    totalEquipment: 180,
    availableEquipment: 95,
    borrowedEquipment: 65,
    myPendingRequests: 3,
    upcomingReturns: 5
  });

  // Data สำหรับกราฟ
  const equipmentStatusData = [
    { name: 'พร้อมใช้งาน', value: 95, color: '#4CAF50' },
    { name: 'ถูกยืม', value: 65, color: '#2196F3' },
    { name: 'ซ่อมบำรุง', value: 15, color: '#FF9800' },
    { name: 'จองล่วงหน้า', value: 5, color: '#9C27B0' }
  ];

  const myRequestsData = [
    { id: 'REQ101', item: 'โน้ตบุ๊ค Dell XPS', status: 'อนุมัติแล้ว', requestDate: '18/04/2025', borrowDate: '22/04/2025', returnDate: '25/04/2025' },
    { id: 'REQ102', item: 'โปรเจกเตอร์ Epson', status: 'รออนุมัติ', requestDate: '20/04/2025', borrowDate: '25/04/2025', returnDate: '27/04/2025' },
    { id: 'REQ103', item: 'ไมโครโฟนไร้สาย', status: 'ปฏิเสธ', requestDate: '15/04/2025', borrowDate: '18/04/2025', returnDate: '20/04/2025' },
  ];

  const myRequestsColumns = [
    { field: 'id', headerName: 'รหัสคำขอ', width: 100 },
    { field: 'item', headerName: 'รายการ', width: 200 },
    { field: 'status', headerName: 'สถานะ', width: 150 },
    { field: 'requestDate', headerName: 'วันที่ขอ', width: 120 },
    { field: 'borrowDate', headerName: 'วันที่ยืม', width: 120 },
    { field: 'returnDate', headerName: 'วันที่คืน', width: 120 },
  ];

  const upcomingReturnsData = [
    { id: 1, item: 'โน้ตบุ๊ค ASUS', returnDate: '22/04/2025', status: 'ปกติ' },
    { id: 2, item: 'กล้องวิดีโอ Sony', returnDate: '23/04/2025', status: 'ปกติ' },
    { id: 3, item: 'ลำโพง JBL', returnDate: '24/04/2025', status: 'ใกล้เกินกำหนด' },
    { id: 4, item: 'iPad Pro', returnDate: '25/04/2025', status: 'ปกติ' },
  ];

  return (
    <div className="p-6 flex-grow text-black">
      <h1 className="text-3xl font-bold mb-8">แดชบอร์ดเจ้าหน้าที่</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {/* Total Equipment */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">ครุภัณฑ์ทั้งหมด</p>
          <p className="text-3xl font-bold my-2">{stats.totalEquipment}</p>
          <div className="flex items-center">
            <InventoryIcon className="text-blue-500" />
          </div>
        </div>

        {/* Available Equipment */}
        <div className="bg-white p-4 rounded-lg shadow">
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

        {/* My Pending Requests */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">คำขอของฉัน</p>
          <p className="text-3xl font-bold my-2 text-purple-500">{stats.myPendingRequests}</p>
          <div className="flex items-center">
            <PendingIcon className="text-purple-500" />
          </div>
        </div>

        {/* Upcoming Returns */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">คืนเร็วๆนี้</p>
          <p className="text-3xl font-bold my-2 text-orange-500">{stats.upcomingReturns}</p>
          <div className="flex items-center">
            <ScheduleIcon className="text-orange-500" />
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

        {/* My Requests */}
        <div className="bg-white p-6 rounded-lg shadow h-[360px]">
          <h2 className="text-xl font-semibold mb-4">คำขอของฉัน</h2>
          <div className="h-[280px] w-full">
            <DataGrid
              rows={myRequestsData}
              columns={myRequestsColumns}
              pageSize={3}
              rowsPerPageOptions={[3]}
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>

      {/* Upcoming Returns */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">การคืนเร็วๆนี้</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {upcomingReturnsData.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border ${
              item.status === 'ใกล้เกินกำหนด' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
            }`}>
              <p className="font-medium">{item.item}</p>
              <p className="text-sm text-gray-600 mt-1">คืนวันที่: {item.returnDate}</p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                item.status === 'ใกล้เกินกำหนด' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardExeutive;