import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import RepairApprovalDialog from "./dialogs/RepairApprovalDialog";

export default function HistoryRepair() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(["inprogress", "rejected", "completed"]); // default: show all 3
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });
  // ...existing code...

  // สถานะของคำขอซ่อม
  const statusOptions = [
    { value: "rejected", label: "ปฏิเสธ", count: 0 },
    { value: "inprogress", label: "กำลังซ่อม", count: 0 },
    { value: "completed", label: "เสร็จสิ้น", count: 0 }
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
    approved: "bg-green-50 text-green-800 border-green-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    inprogress: "bg-blue-50 text-blue-800 border-blue-200",
    completed: "bg-purple-50 text-purple-800 border-purple-200"
  };

  const statusIconStyle = {
    pending: "text-yellow-500",
    approved: "text-green-500",
    rejected: "text-red-500",
    inprogress: "text-blue-500",
    completed: "text-purple-500"
  };

  const statusTranslation = {
    pending: "รอการอนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ",
    inprogress: "กำลังซ่อม",
    completed: "เสร็จสิ้น"
  };

  useEffect(() => {
    // ดึงข้อมูลจาก API ทั้งหมด (เหมือน RepairApprovalList)
    const fetchRepairRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/repair-requests');
        // แปลงข้อมูลจาก API ให้ตรงกับรูปแบบที่ใช้ใน component (เหมือน RepairApprovalList)
        const formattedData = response.data.map(request => ({
          requestId: request.id?.toString() || request.repair_code || "",
          equipment: {
            id: request.equipment_id,
            code: request.equipment_code,
            name: request.equipment_name,
            category: request.equipment_category,
            image: request.equipment_pic ? `http://localhost:5000/uploads/${request.equipment_pic}` : "/placeholder-equipment.png"
          },
          requester: {
            id: request.requester_id,
            name: request.requester_name,
            department: request.branch_name,
            avatar: request.avatar ? `http://localhost:5000/uploads/user/${request.avatar}` : "/placeholder-user.png"
          },
          description: request.problem_description,
          status: request.status === "approved" ? "inprogress" : request.status, // map approved => inprogress
          requestDate: request.request_date ? new Date(request.request_date).toLocaleDateString('th-TH') : "-",
          estimatedCost: request.estimated_cost,
          images: request.repair_pic ? request.repair_pic.split(",") : [],
        }));
        setRepairRequests(formattedData);
      } catch (err) {
        setRepairRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRepairRequests();
  }, []);

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApproveRequest = (approvedData) => {
    // ในโปรเจ็กต์จริงควรส่งข้อมูลไปยัง API
    console.log("อนุมัติคำขอซ่อม:", approvedData);

    // อัปเดตสถานะในรายการ
    setRepairRequests(prevRequests =>
      prevRequests.map(req =>
        req.requestId === approvedData.requestId
          ? { ...req, ...approvedData, status: "approved" }
          : req
      )
    );

    // แสดงการแจ้งเตือน
    showNotification("อนุมัติคำขอซ่อมเรียบร้อยแล้ว", "success");
  };

  const handleRejectRequest = (rejectedData) => {
    // ในโปรเจ็กต์จริงควรส่งข้อมูลไปยัง API
    console.log("ปฏิเสธคำขอซ่อม:", rejectedData);

    // อัปเดตสถานะในรายการ
    setRepairRequests(prevRequests =>
      prevRequests.map(req =>
        req.requestId === rejectedData.requestId
          ? { ...req, ...rejectedData, status: "rejected" }
          : req
      )
    );

    // แสดงการแจ้งเตือน
    showNotification("ปฏิเสธคำขอซ่อมเรียบร้อยแล้ว", "error");
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
  const filteredRequests = repairRequests.filter(request => {
    const matchSearch =
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const countByStatus = repairRequests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-6 max-w-8xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">อนุมัติคำขอแจ้งซ่อม</h1>
          <p className="text-gray-500 text-sm">จัดการคำขอแจ้งซ่อมทั้งหมดขององค์กร</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-400">
          <p className="text-gray-500 text-sm">กำลังซ่อม</p>
          <p className="text-2xl font-semibold text-gray-800">{countByStatus.inprogress || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
          <p className="text-gray-500 text-sm">ปฏิเสธ</p>
          <p className="text-2xl font-semibold text-gray-800">{countByStatus.rejected || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-400">
          <p className="text-gray-500 text-sm">เสร็จสิ้น</p>
          <p className="text-2xl font-semibold text-gray-800">{countByStatus.completed || 0}</p>
        </div>
      </div>

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
                          type="checkbox"
                          checked={statusFilter.includes(option.value)}
                          onChange={() => handleStatusFilterChange(option.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{option.label}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {countByStatus[option.value] || 0}
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
                    ผู้แจ้งซ่อม
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    วันที่แจ้ง
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    ค่าใช้จ่าย (บาท)
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
                  <tr key={request.requestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.requestId}</div>
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
                      <div className="text-sm text-gray-900">{request.requestDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.estimatedCost?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs flex-center justify-center leading-5 font-semibold rounded-full border ${statusBadgeStyle[request.status]}`}>
                        {statusTranslation[request.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {request.status === "pending" ? (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                        >
                          พิจารณา
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 hover:text-gary-700 transition-all duration-200"
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
      <RepairApprovalDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        repairRequest={selectedRequest}
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