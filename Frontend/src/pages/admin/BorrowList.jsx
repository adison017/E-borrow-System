import React from 'react';

const BorrowList = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">รายการยืม</h1>
      {/* ตารางรายการยืม */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">ชื่อครุภัณฑ์</th>
              <th className="py-3 px-6 text-left">วันที่ยืม</th>
              <th className="py-3 px-6 text-left">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {/* ตัวอย่างข้อมูลรายการยืม */}
            <tr className="hover:bg-gray-100">
              <td className="py-3 px-6 border-b">1</td>
              <td className="py-3 px-6 border-b">คอมพิวเตอร์</td>
              <td className="py-3 px-6 border-b">01/04/2025</td>
              <td className="py-3 px-6 border-b">ยืม</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="py-3 px-6 border-b">2</td>
              <td className="py-3 px-6 border-b">โปรเจ็กเตอร์</td>
              <td className="py-3 px-6 border-b">01/04/2025</td>
              <td className="py-3 px-6 border-b">คืนแล้ว</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowList;
