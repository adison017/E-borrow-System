import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import BorrowDetailsDialog from "./dialog/BorrowDetailsDialog";

export default function BorrowApprovalList() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // สถานะของคำขอยืม
  const statusOptions = [
    { value: "all", label: "ทั้งหมด" },
    { value: "pending", label: "รอการอนุมัติ" },
    { value: "approved", label: "อนุมัติแล้ว" },
    { value: "rejected", label: "ปฏิเสธ" },
    { value: "borrowing", label: "กำลังยืม" },
    { value: "returned", label: "คืนแล้ว" }
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    borrowing: "bg-blue-100 text-blue-800",
    returned: "bg-purple-100 text-purple-800"
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
      }
    ];

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

    const matchStatus = statusFilter === "all" || request.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // จำนวนคำขอแต่ละสถานะ
  const countByStatus = borrowRequests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">อนุมัติคำขอยืมอุปกรณ์</h1>

      {/* สรุปข้อมูล */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-gray-500">
          <p className="text-gray-500 text-sm">คำขอทั้งหมด</p>
          <p className="text-2xl font-semibold">{borrowRequests.length}</p>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">รอการอนุมัติ</p>
          <p className="text-2xl font-semibold">{countByStatus.pending || 0}</p>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">อนุมัติแล้ว</p>
          <p className="text-2xl font-semibold">{countByStatus.approved || 0}</p>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">กำลังยืม</p>
          <p className="text-2xl font-semibold">{countByStatus.borrowing || 0}</p>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">ปฏิเสธ</p>
          <p className="text-2xl font-semibold">{countByStatus.rejected || 0}</p>
        </div>
      </div>

      {/* ค้นหาและตัวกรอง */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัส, อุปกรณ์, หรือชื่อผู้ขอยืม"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input input-bordered w-full bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 whitespace-nowrap">กรองตามสถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ตารางรายการ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">ไม่พบรายการที่ตรงกับการค้นหา</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 text-black">
                  <th className="px-2">รหัส</th>
                  <th>อุปกรณ์</th>
                  <th>ผู้ขอยืม</th>
                  <th>วันที่ยืม</th>
                  <th>กำหนดคืน</th>
                  <th>สถานะ</th>
                  <th className="text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.borrowId} className="hover:bg-gray-50 border-b">
                    <td className="px-2">
                      <div className="font-medium">{request.borrowId}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 p-1 rounded bg-gray-100">
                            <img
                              src={request.equipment?.image || "/placeholder-equipment.png"}
                              alt={request.equipment?.name}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{request.equipment?.name}</div>
                          <div className="text-sm text-gray-500">{request.equipment?.code}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img
                              src={request.requester?.avatar || "/placeholder-user.png"}
                              alt={request.requester?.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div>{request.requester?.name}</div>
                          <div className="text-sm text-gray-500">{request.requester?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td>{request.borrowDate}</td>
                    <td>{request.dueDate}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-md text-xs ${statusBadgeStyle[request.status]}`}>
                        {statusTranslation[request.status]}
                      </span>
                    </td>
                    <td className="text-right">
                      {request.status === "pending" ? (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleOpenDialog(request)}
                            className="btn btn-sm btn-primary text-white"
                          >
                            พิจารณา
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="btn btn-sm btn-ghost"
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
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          notification.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
          'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            )}
            {notification.type === 'error' && (
              <XCircleIcon className="w-6 h-6 text-red-500" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}