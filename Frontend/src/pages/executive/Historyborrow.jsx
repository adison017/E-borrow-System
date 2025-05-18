import { BiSearchAlt2 } from "react-icons/bi"; 
import { FaClock } from "react-icons/fa"; 
import { useState, useEffect } from "react";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import BorrowDetailsDialog from "./dialogs/BorrowDetailsDialog";

export default function BorrowApprovalList() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(["returned" , "rejected" , "borrowing"]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // สถานะของคำขอยืม
  const statusOptions = [
    { value: "rejected", label: "ปฏิเสธ", count: 0 },
    { value: "borrowing", label: "กำลังยืม", count: 0 },
    { value: "returned", label: "คืนแล้ว", count: 0 }
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
    approved: "bg-green-50 text-green-800 border-green-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    borrowing: "bg-blue-50 text-blue-800 border-blue-200",
    returned: "bg-purple-50 text-purple-800 border-purple-200"
  };

  const statusIconStyle = {
    pending: "text-yellow-500",
    approved: "text-green-500",
    rejected: "text-red-500",
    borrowing: "text-blue-500",
    returned: "text-purple-500"
  };

  const statusTranslation = {
    pending: "รอการอนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ",
    borrowing: "กำลังยืม",
    returned: "คืนแล้ว"
  };

  useEffect(() => {
    // ข้อมูลตัวอย่าง - ในโปรเจ็กต์จริงควรดึงจาก API
    const mockData = [
      {
        borrowId: "BOR-2025-0001",
        equipment: {
          id: "EQP-001",
          code: "LT-001",
          name: "โน๊ตบุ๊ค Dell XPS 15",
          category: "อุปกรณ์คอมพิวเตอร์",
          image: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
        },
        requester: {
          id: "USR-001",
          name: "ชัยวัฒน์ มีสุข",
          department: "แผนกไอที",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        purpose: "ใช้งานนอกสถานที่สำหรับงานประชุมที่ต่างจังหวัด",
        status: "pending",
        requestDate: "2025-05-01",
        borrowDate: "2025-05-05",
        dueDate: "2025-05-12",
        priority: "medium"
      },
      {
        borrowId: "BOR-2025-0002",
        equipment: {
          id: "EQP-002",
          code: "PR-005",
          name: "เครื่องพิมพ์ HP LaserJet",
          category: "อุปกรณ์สำนักงาน",
          image: "https://cdn-icons-png.flaticon.com/512/4299/4299443.png"
        },
        requester: {
          id: "USR-002",
          name: "สุดารัตน์ แสงทอง",
          department: "แผนกบัญชี",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        purpose: "พิมพ์เอกสารสำคัญในงานประชุม",
        status: "pending",
        requestDate: "2025-05-03",
        borrowDate: "2025-05-06",
        dueDate: "2025-05-09",
        priority: "low"
      },
      {
        borrowId: "BOR-2025-0003",
        equipment: {
          id: "EQP-003",
          code: "PJ-010",
          name: "โปรเจคเตอร์ Epson",
          category: "อุปกรณ์การประชุม",
          image: "https://cdn-icons-png.flaticon.com/512/3474/3474348.png"
        },
        requester: {
          id: "USR-003",
          name: "วิชัย รักเรียน",
          department: "แผนกทรัพยากรบุคคล",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        purpose: "ใช้นำเสนองานในการประชุมผู้บริหาร",
        status: "approved",
        requestDate: "2025-04-28",
        borrowDate: "2025-05-02",
        dueDate: "2025-05-03",
        approvalDate: "2025-04-29",
        approvalNotes: "อนุมัติตามคำขอ",
        priority: "high"
      },
      {
        borrowId: "BOR-2025-0004",
        equipment: {
          id: "EQP-004",
          code: "CAM-007",
          name: "กล้องถ่ายรูป Canon",
          category: "อุปกรณ์มัลติมีเดีย",
          image: "https://cdn-icons-png.flaticon.com/512/3063/3063190.png"
        },
        requester: {
          id: "USR-001",
          name: "ชัยวัฒน์ มีสุข",
          department: "แผนกไอที",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        purpose: "ถ่ายภาพกิจกรรมประจำเดือนของบริษัทและงานสัมมนา",
        status: "borrowing",
        requestDate: "2025-04-25",
        borrowDate: "2025-04-28",
        dueDate: "2025-05-10",
        approvalDate: "2025-04-26",
        approvalNotes: "อนุมัติตามคำขอ และขอให้ดูแลรักษาอุปกรณ์เป็นอย่างดี",
        priority: "medium"
      },
      {
        borrowId: "BOR-2025-0005",
        equipment: {
          id: "EQP-005",
          code: "IPAD-023",
          name: "iPad Pro",
          category: "อุปกรณ์พกพา",
          image: "https://cdn-icons-png.flaticon.com/512/149/149427.png"
        },
        requester: {
          id: "USR-004",
          name: "มานะ ใจดี",
          department: "แผนกบริหาร",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        purpose: "ขอยืมใช้ในการเดินทางไปอบรมต่างประเทศ",
        status: "rejected",
        requestDate: "2025-04-30",
        borrowDate: "2025-05-05",
        dueDate: "2025-05-20",
        approvalDate: "2025-05-01",
        approvalNotes: "ขออนุญาตปฏิเสธ เนื่องจากมีการจองใช้งานในช่วงเวลาเดียวกันแล้ว กรุณาเลือกอุปกรณ์อื่นหรือเปลี่ยนวันที่ยืม",
        priority: "low"
      },
      {
        borrowId: "BOR-2025-0006",
        equipment: {
          id: "EQP-006",
          code: "MIC-012",
          name: "ไมโครโฟนไร้สาย",
          category: "อุปกรณ์เสียง",
          image: "https://cdn-icons-png.flaticon.com/512/3659/3659898.png"
        },
        requester: {
          id: "USR-005",
          name: "สมหญิง จริงใจ",
          department: "แผนกการตลาด",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        purpose: "ใช้ในการจัดงานสัมมนาลูกค้า",
        status: "returned",
        requestDate: "2025-04-20",
        borrowDate: "2025-04-22",
        dueDate: "2025-04-25",
        returnDate: "2025-04-24",
        approvalDate: "2025-04-21",
        approvalNotes: "อนุมัติตามคำขอ",
        priority: "medium"
      }
    ];

    // Calculate counts for each status
    const counts = mockData.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});

    // Update status options with counts
    const updatedOptions = statusOptions.map(option => ({
      ...option,
      count: counts[option.value] || 0
    }));

    setBorrowRequests(mockData);
    setLoading(false);
  }, []);

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApproveRequest = (approvedData) => {
    // ในโปรเจ็กต์จริงควรส่งข้อมูลไปยัง API
    console.log("อนุมัติคำขอยืม:", approvedData);

    // อัปเดตสถานะในรายการ
    setBorrowRequests(prevRequests =>
      prevRequests.map(req =>
        req.borrowId === approvedData.borrowId
          ? { ...req, ...approvedData, status: "approved" }
          : req
      )
    );

    // แสดงการแจ้งเตือน
    showNotification("อนุมัติคำขอยืมเรียบร้อยแล้ว", "success");
  };

  const handleRejectRequest = (rejectedData) => {
    // ในโปรเจ็กต์จริงควรส่งข้อมูลไปยัง API
    console.log("ปฏิเสธคำขอยืม:", rejectedData);

    // อัปเดตสถานะในรายการ
    setBorrowRequests(prevRequests =>
      prevRequests.map(req =>
        req.borrowId === rejectedData.borrowId
          ? { ...req, ...rejectedData, status: "rejected" }
          : req
      )
    );

    // แสดงการแจ้งเตือน
    showNotification("ปฏิเสธคำขอยืมเรียบร้อยแล้ว", "error");
  };

  // แสดงการแจ้งเตือน
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // กรองข้อมูลตามการค้นหาและตัวกรองสถานะ
  const filteredRequests = borrowRequests.filter(request => {
    const matchSearch =
      request.borrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter.includes(request.status);

    return matchSearch && matchStatus;
  });

  const handleStatusFilterChange = (status) => {
    setStatusFilter(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status) // ถ้ามีอยู่แล้วให้ลบออก
        : [...prev, status] // ถ้าไม่มีให้เพิ่มเข้าไป
    );
  };

  // จำนวนคำขอแต่ละสถานะ
  const countByStatus = borrowRequests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-6 max-w-8xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">อนุมัติคำขอยืมอุปกรณ์</h1>
          <p className="text-gray-500 text-sm">จัดการคำขอยืมอุปกรณ์ทั้งหมดขององค์กร</p>
        </div>
      </div>

      {/* สรุปข้อมูล */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-400">
          <p className="text-gray-500 text-sm">กำลังยืม</p>
          <p className="text-2xl font-semibold text-gray-800">{countByStatus.borrowing || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
          <p className="text-gray-500 text-sm">ปฏิเสธ</p>
          <p className="text-2xl font-semibold text-gray-800">{countByStatus.rejected || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-400">
          <p className="text-gray-500 text-sm">คืนแล้ว</p>
          <p className="text-2xl font-semibold text-gray-800">{countByStatus.returned || 0}</p>
        </div>
      </div>

      {/* ค้นหาและตัวกรอง */}
      <div className="p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearchAlt2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัส, อุปกรณ์, หรือชื่อผู้ขอยืม"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl text-sm border-gray-200"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn btn-outline flex items-center gap-2 shadow-md bg-white rounded-2xl transition-colors border-gray-200 hover:text-white hover:bg-blue-700 hover:border-blue-700"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>กรองสถานะ</span>
              {isFilterOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 mb-1">สถานะคำขอ</label>
                  {statusOptions.map(option => (
                    <label key={option.value} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox" // เปลี่ยนจาก radio เป็น checkbox
                          checked={statusFilter.includes(option.value)}
                          onChange={() => handleStatusFilterChange(option.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{option.label}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {option.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ตารางรายการ */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">ไม่พบรายการที่ตรงกับการค้นหา</h3>
            <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    รหัสคำขอ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    อุปกรณ์
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    ผู้ขอยืม
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    วันที่ยืม
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    กำหนดคืน
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.borrowId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.borrowId}</div>
                      <div className="text-xs text-gray-500">{request.requestDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 object-contain p-1 bg-gray-100 rounded"
                            src={request.equipment?.image || "/placeholder-equipment.png"}
                            alt={request.equipment?.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.equipment?.name}</div>
                          <div className="text-xs text-gray-500">{request.equipment?.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={request.requester?.avatar || "/placeholder-user.png"}
                            alt={request.requester?.name}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.requester?.name}</div>
                          <div className="text-xs text-gray-500">{request.requester?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.borrowDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs flex-center justify-center leading-5 font-semibold rounded-full border ${statusBadgeStyle[request.status]}`}>
                        {request.status === "pending" }  
                        {request.status === "approved"}
                        {request.status === "rejected"}
                        {statusTranslation[request.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {request.status === "pending" ? (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="cursor-pointer text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm mx-auto"
                        >
                          พิจารณา
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className=" cursor-pointer text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-md text-sm mx-auto"
                        >
                          ดูรายละเอียด
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog สำหรับอนุมัติคำขอ */}
      <BorrowDetailsDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        borrowRequest={selectedRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      {/* Notification Component */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transition-all duration-300 transform ${
          notification.show ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        } ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
          notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
          'bg-blue-50 border border-blue-200 text-blue-700'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${
              notification.type === 'success' ? 'text-green-400' :
              notification.type === 'error' ? 'text-red-400' :
              'text-blue-400'
            }`}>
              {notification.type === 'success' && (
                <CheckCircleIcon className="w-5 h-5" />
              )}
              {notification.type === 'error' && (
                <XCircleIcon className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}