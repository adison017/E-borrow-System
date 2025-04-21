import React, { useState } from 'react';
import { useTable } from 'react-table';

const ManageUser = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // ข้อมูลตัวอย่างผู้ใช้
  const userData = [
    {
      user_id: 1,
      role_name: 'Admin',
      pic_pro: 'lo.png',
      username: 'John Doe',
      password: 'hashed_password_123',
      email: 'john@example.com',
      phone: '0812345678',
    },
    {
      user_id: 2,
      role_name: 'Member',
      pic_pro: 'lo.png',
      username: 'Jane Smith',
      password: 'hashed_password_456',
      email: 'jane@example.com',
      phone: '0898765432',
    },
    {
      user_id: 3,
      role_name: 'Executive',
      pic_pro: 'lo.png',
      username: 'Alex Brown',
      password: 'hashed_password_789',
      email: 'alex@example.com',
      phone: '0976543210',
    },
  ];

  const filteredUsers = userData.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'รหัสสมาชิก',
        accessor: 'user_id',
      },
      {
        Header: 'ชื่อบทบาท',
        accessor: 'role_name',
        Cell: ({ value }) => {
          const getRoleColor = (role) => {
            switch (role) {
              case 'Admin':
                return 'bg-purple-100 text-purple-800';
              case 'Executive':
                return 'bg-blue-100 text-blue-800';
              case 'Member':
                return 'bg-gray-100 text-gray-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          };
          return (
            <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(value)}`}>
              {value}
            </span>
          );
        },
      },
      {
        Header: 'รูปผู้ใช้งาน',
        accessor: 'pic_pro',
        Cell: ({ value }) => <img src={value} alt="User" className="w-10 h-10 rounded-full" />,
      },
      {
        Header: 'ชื่อ-สกุล',
        accessor: 'username',
      },
      {
        Header: 'อีเมล์',
        accessor: 'email',
      },
      {
        Header: 'เบอร์โทรศัพท์',
        accessor: 'phone',
      },
      {
        Header: 'การจัดการ',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleEdit(row.original.user_id)}
            >
              แก้ไข
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleDelete(row.original.user_id)}
            >
              ลบ
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: filteredUsers,
  });

  const handleEdit = (id) => {
    console.log('Edit user with ID:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete user with ID:', id);
  };

  const handleAdd = () => {
    console.log('Add new user');
  };

  return (
    <div className="p-6 mx-auto max-w-7xl text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">จัดการผู้ใช้งานระบบ</h1>
      <p className="mb-6 text-center">จัดการข้อมูลผู้ใช้งานทั้งหมดในระบบ</p>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ค้นหาชื่อ อีเมล์ หรือบทบาท..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white border-collapse border border-gray-200 shadow-md">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className="py-2 px-4 border-b text-left"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="py-2 px-4 border-b"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          ไม่พบผู้ใช้งานที่ตรงกับการค้นหา
        </div>
      )}

      {/* Add User Button */}
      <div className="mt-6 text-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          onClick={handleAdd}
        >
          เพิ่มผู้ใช้งาน
        </button>
      </div>
    </div>
  );
};

export default ManageUser;