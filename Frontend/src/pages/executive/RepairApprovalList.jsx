import { CheckCircleIcon, MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import { useEffect, useState } from "react";
import RepairApprovalDialog from "./dialogs/RepairApprovalDialog";

export default function RepairApprovalList() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // สถานะของคำขอซ่อม
  const statusOptions = [
    { value: "all", label: "ทั้งหมด", count: 0 },
    { value: "รออนุมัติซ่อม", label: "รออนุมัติซ่อม", count: 0 },
    { value: "approved", label: "อนุมัติแล้ว", count: 0 },
    { value: "rejected", label: "ปฏิเสธ", count: 0 },
    { value: "inprogress", label: "กำลังซ่อม", count: 0 },
    { value: "completed", label: "เสร็จสิ้น", count: 0 }
  ];

  const statusBadgeStyle = {
    "รออนุมัติซ่อม": "bg-yellow-50 text-yellow-800 border-yellow-200",
    approved: "bg-green-50 text-green-800 border-green-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    inprogress: "bg-blue-50 text-blue-800 border-blue-200",
    completed: "bg-purple-50 text-purple-800 border-purple-200"
  };

  const statusIconStyle = {
    "รออนุมัติซ่อม": "text-yellow-500",
    approved: "text-green-500",
    rejected: "text-red-500",
    inprogress: "text-blue-500",
    completed: "text-purple-500"
  };

  const statusTranslation = {
    "รออนุมัติซ่อม": "รออนุมัติซ่อม",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ",
    inprogress: "กำลังซ่อม",
    completed: "เสร็จสิ้น"
  };

  useEffect(() => {
    fetchRepairRequests();
  }, []);

  const fetchRepairRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/repair-requests');
      console.log('=== API Response Debug ===');
      console.log('Raw API response:', response.data);
      console.log('First item sample:', response.data[0]);

      // แปลงข้อมูลจาก API ให้ตรงกับรูปแบบที่ใช้ใน component
      const formattedData = response.data.map(request => {
        console.log('Processing request:', request);
        console.log('repair_pic value:', request.repair_pic);
        console.log('repair_pic type:', typeof request.repair_pic);
        console.log('repair_pic_raw:', request.repair_pic_raw);

        return {
          requestId: request.id.toString(), // Changed from request.repair_id to request.id
          requester_name: request.requester_name,
          branch_name: request.branch_name,
          equipment_name: request.equipment_name,
          equipment_code: request.equipment_code,
          equipment_category: request.equipment_category,
          problem_description: request.problem_description,
          request_date: request.request_date,
          estimated_cost: request.estimated_cost,
          equipment_pic: request.equipment_pic,
          equipment_pic_filename: request.equipment_pic_filename,
          pic_filename: request.repair_pic, // รูปภาพความเสียหาย (array ที่ถูก parse แล้ว)
          pic_filename_raw: request.repair_pic_raw, // ข้อมูลดิบสำหรับ debug
          status: request.status,
          repair_code: request.repair_code,
          avatar: request.avatar
        };
      });

      console.log('=== Formatted Data Debug ===');
      console.log('Formatted data:', formattedData);
      console.log('First formatted item:', formattedData[0]);
      setRepairRequests(formattedData);

      // Calculate counts for each status
      const counts = formattedData.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {});

      // Update status options with counts
      const updatedOptions = statusOptions.map(option => ({
        ...option,
        count: counts[option.value] || 0
      }));

    } catch (error) {
      console.error('Error fetching repair requests:', error);
      showNotification("เกิดข้อผิดพลาดในการดึงข้อมูลคำขอซ่อม", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApproveRequest = async (approvedData) => {
    try {
      // The dialog already makes the API call with all necessary data
      // No need to make another API call here as it would overwrite the data

      // รีเฟรชข้อมูลใหม่
      await fetchRepairRequests();

      // แสดงการแจ้งเตือน
      showNotification("อนุมัติคำขอซ่อมเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error('Error approving request:', error);
      showNotification("เกิดข้อผิดพลาดในการอนุมัติคำขอซ่อม", "error");
    }
  };

  const handleRejectRequest = async (rejectedData) => {
    try {
      // The dialog should handle the API call for rejection
      // No need to make another API call here as it would overwrite the data

      // รีเฟรชข้อมูลใหม่
      await fetchRepairRequests();

      // แสดงการแจ้งเตือน
      showNotification("ปฏิเสธคำขอซ่อมเรียบร้อยแล้ว", "error");
    } catch (error) {
      console.error('Error rejecting request:', error);
      showNotification("เกิดข้อผิดพลาดในการปฏิเสธคำขอซ่อม", "error");
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
  const filteredRequests = repairRequests.filter(request => {
    const matchSearch =
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "all" || request.status === statusFilter;

    return matchSearch && matchStatus;
  });

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

      {/* ตารางรายการ */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : repairRequests.length === 0 ? (
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
                {repairRequests.map((request) => (
                  <tr key={request.requestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.repair_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 object-contain p-1 bg-gray-100 rounded"
                            src={request.equipment_pic || (request.equipment_pic_filename ? `http://localhost:5000/uploads/${request.equipment_pic_filename}` : "/placeholder-equipment.png")}
                            alt={request.equipment_name}
                            onError={(e) => {
                              e.target.src = "/placeholder-equipment.png";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.equipment_name}</div>
                          <div className="text-xs text-gray-500">{request.equipment_category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={request.avatar ? `http://localhost:5000/uploads/${request.avatar}` : "/placeholder-user.png"}
                            alt={request.requester_name}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.requester_name}</div>
                          <div className="text-xs text-gray-500">{request.branch_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.request_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.estimated_cost?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs flex-center justify-center leading-5 font-semibold rounded-full border ${statusBadgeStyle[request.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {statusTranslation[request.status] || request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {request.status === "รออนุมัติซ่อม" ? (
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