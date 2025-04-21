import React, { useState } from 'react';
import { useTable } from 'react-table';

const Managepro = () => {
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
      dueDate: '',
      image: 'logo.png'
    },
    {
      id: 4,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png'
    },
    {
      id: 5,
      name: 'กล้อง Canon EOS 80D',
      code: 'PH-003',
      status: 'กำลังซ่อม',
      dueDate: '',
      image: 'logo.png'
    },
    {
      id: 6,
      name: 'ไมโครโฟน Rode NT-USB',
      code: 'AV-004',
      status: 'พร้อมยืม',
      dueDate: '',
      image: 'logo.png'
    }
  ];

  const filteredEquipment = equipmentData.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ชื่อครุภัณฑ์',
        accessor: 'name',
      },
      {
        Header: 'รหัส',
        accessor: 'code',
      },
      {
        Header: 'สถานะ',
        accessor: 'status',
        Cell: ({ value }) => {
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
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          );
        },
      },
      {
        Header: 'กำหนดคืน',
        accessor: 'dueDate',
        Cell: ({ value }) => (value ? value : 'N/A'),
      },
      {
        Header: 'การจัดการ',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleEdit(row.original.id)}
            >
              แก้ไข
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleDelete(row.original.id)}
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
    data: filteredEquipment,
  });

  const handleEdit = (id) => {
    console.log('Edit equipment with ID:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete equipment with ID:', id);
  };

  const handleAdd = () => {
    console.log('Add new equipment');
  };

  return (
    <div className="flex justify-center items-center p-6 md:ml-64 text-black">
    <div className="w-full max-w-4xl"> {/* กำหนดความกว้างสูงสุดให้กับเนื้อหาภายใน */}
    <h1 className="text-2xl font-bold mb-4">หน้าหลักระบบยืมคืนครุภัณฑ์</h1>
    <p className="mb-6">ยินดีต้อนรับเข้าสู่ระบบยืมคืนครุภัณฑ์</p>

    {/* Search Bar */}
    <div className="mb-8">
      <div className="relative max-w-md">
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

    {/* Equipment Table */}
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

    {filteredEquipment.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        ไม่พบครุภัณฑ์ที่ตรงกับการค้นหา
      </div>
    )}

    {/* Add Equipment Button */}
    <div className="mt-6 text-right">
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        onClick={handleAdd}
      >
        เพิ่มครุภัณฑ์
      </button>
    </div>
  </div>
</div>

  );
};

export default Managepro;