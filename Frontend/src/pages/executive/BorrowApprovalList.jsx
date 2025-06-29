import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { getAllBorrows, updateBorrowStatus } from "../../utils/api";
import BorrowDetailsDialog from "./dialogs/BorrowDetailsDialog";

const API_BASE = "http://localhost:5000";

export default function BorrowApprovalList() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_approval");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // สถานะของคำขอยืม
  const statusOptions = [
    { value: "all", label: "ทั้งหมด", count: 0 },
    { value: "pending_approval", label: "รออนุมัติ (ใหม่)", count: 0 },
    { value: "pending", label: "รอการอนุมัติ", count: 0 },
    { value: "approved", label: "อนุมัติแล้ว", count: 0 },
    { value: "rejected", label: "ปฏิเสธ", count: 0 },
    { value: "borrowing", label: "กำลังยืม", count: 0 },
    { value: "returned", label: "คืนแล้ว", count: 0 }
  ];

  const statusBadgeStyle = {
    pending_approval: "bg-orange-50 text-orange-800 border-orange-200",
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
    pending_approval: "รออนุมัติ",
    pending: "รอการอนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ",
    borrowing: "กำลังยืม",
    returned: "คืนแล้ว"
  };

  useEffect(() => {
    setLoading(true);
    getAllBorrows()
      .then(data => {
        setBorrowRequests(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        showNotification("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
      });
  }, []);

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApproveRequest = async (approvedData) => {
    try {
      await updateBorrowStatus(approvedData.borrow_id, "approved", approvedData.approvalNotes);
      setBorrowRequests(prevRequests =>
        prevRequests.map(req =>
          req.borrow_id === approvedData.borrow_id
            ? { ...req, ...approvedData, status: "approved" }
            : req
        )
      );
      showNotification("อนุมัติคำขอยืมเรียบร้อยแล้ว", "success");
    } catch (err) {
      showNotification("เกิดข้อผิดพลาดในการอนุมัติ", "error");
    }
  };

  const handleRejectRequest = async (rejectedData) => {
    try {
      await updateBorrowStatus(rejectedData.borrow_id, "rejected", rejectedData.rejectReason);
      setBorrowRequests(prevRequests =>
        prevRequests.map(req =>
          req.borrow_id === rejectedData.borrow_id
            ? { ...req, ...rejectedData, status: "rejected" }
            : req
        )
      );
      showNotification("ปฏิเสธคำขอยืมเรียบร้อยแล้ว", "error");
    } catch (err) {
      showNotification("เกิดข้อผิดพลาดในการปฏิเสธ", "error");
    }
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
    // รองรับ equipment เป็น array หรือ object
    let equipmentNames = [];
    if (Array.isArray(request.equipment)) {
      equipmentNames = request.equipment.map(eq => eq?.name || "");
    } else if (request.equipment && request.equipment.name) {
      equipmentNames = [request.equipment.name];
    }
    const matchSearch =
      (request.borrow_code && request.borrow_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      equipmentNames.some(name => name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.borrower?.name && request.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === "all" || request.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
                  <tr key={request.borrow_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.borrow_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-18 w-18 rounded-lg">
                          <img
                            className="h-full w-full object-contain"
                            src={Array.isArray(request.equipment) && request.equipment[0]?.pic ? `${request.equipment[0].pic.startsWith('http') ? request.equipment[0].pic : '/lo.png'}` : '/placeholder-equipment.png'}
                            alt={Array.isArray(request.equipment) && request.equipment[0]?.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {Array.isArray(request.equipment) && request.equipment.length > 0 ? request.equipment[0].name : '-'}
                            {Array.isArray(request.equipment) && request.equipment.length > 1 && (
                              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                                +{request.equipment.length - 1} รายการ
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Array.isArray(request.equipment) && request.equipment[0]?.item_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-13 w-13">
                          <img
                            className="h-full w-full rounded-full bg-white shadow-sm"
                            src={
                              request.borrower?.avatar
                                ? (request.borrower.avatar.startsWith('http')
                                    ? request.borrower.avatar
                                    : `${API_BASE}/uploads/user/${request.borrower.avatar}`)
                                : "/profile.png"
                            }
                            alt={request.borrower?.name}
                            onError={e => { e.target.onerror = null; e.target.src = '/profile.png'; }}
                          />
                        </div>
                        <div className="ml-3 overflow-hidden">
                          <div className="text-sm font-medium text-gray-900 truncate">{request.borrower?.name}</div>
                          <div className="text-xs text-gray-500">{request.borrower?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.borrow_date ? new Date(request.borrow_date).toLocaleDateString('th-TH') : '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.due_date ? new Date(request.due_date).toLocaleDateString('th-TH') : '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs flex-center justify-center leading-5 font-semibold rounded-full border ${statusBadgeStyle[request.status]}`}>
                        {statusTranslation[request.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {request.status === "pending_approval" ? (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                        >
                          พิจารณา
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 hover:text-blue-700 transition-all duration-200"
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