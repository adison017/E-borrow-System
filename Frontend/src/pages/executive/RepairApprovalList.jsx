import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
    { value: "pending", label: "รอการอนุมัติ", count: 0 },
    { value: "approved", label: "อนุมัติแล้ว", count: 0 },
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
    // ข้อมูลตัวอย่าง - ในโปรเจ็กต์จริงควรดึงจาก API
    const mockData = [
      {
        requestId: "REP-2025-0001",
        equipment: {
          id: "EQP-001",
          code: "MN-001",
          name: "เครื่องคอมพิวเตอร์ Dell",
          category: "อุปกรณ์คอมพิวเตอร์",
          image: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
        },
        requester: {
          id: "USR-001",
          name: "ชัยวัฒน์ มีสุข",
          department: "แผนกไอที",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        description: "เครื่องคอมพิวเตอร์เปิดไม่ติด หน้าจอขึ้นข้อความ Error Code 0x0000098",
        status: "pending",
        requestDate: "2025-05-01",
        estimatedCost: 2500,
        priority: "medium",
        images: [
          "https://media.istockphoto.com/id/1458149697/photo/pc-error-on-blue-screen-hardware-problem-during-windows-installation-close-up.jpg?s=1024x1024&w=is&k=20&c=1Uc7-VHUo8G4Q08XJjvIlWCYCDI9NMlwK1wn2QAEhak="
        ]
      },
      {
        requestId: "REP-2025-0002",
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
        description: "เครื่องพิมพ์มีเสียงดังผิดปกติเวลาพิมพ์งาน และกระดาษติดบ่อยมาก",
        status: "pending",
        requestDate: "2025-05-03",
        estimatedCost: 1200,
        priority: "low",
        images: [
          "https://media.istockphoto.com/id/1340549421/photo/multifunction-printer-or-copy-machine-with-paper-jam-error-in-office.jpg?s=1024x1024&w=is&k=20&c=5AZ5MXRNGrVDv8rGSUKbkfmFiYQcxk8zNIZGXkVHuQA="
        ]
      },
      {
        requestId: "REP-2025-0003",
        equipment: {
          id: "EQP-003",
          code: "AC-010",
          name: "เครื่องปรับอากาศ Mitsubishi",
          category: "เครื่องใช้ไฟฟ้า",
          image: "https://cdn-icons-png.flaticon.com/512/1530/1530297.png"
        },
        requester: {
          id: "USR-003",
          name: "วิชัย รักเรียน",
          department: "แผนกทรัพยากรบุคคล",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        description: "แอร์ไม่เย็น มีน้ำหยดจากเครื่อง และมีกลิ่นอับชื้นเวลาเปิดเครื่อง",
        status: "approved",
        requestDate: "2025-04-28",
        estimatedCost: 4500,
        approvalDate: "2025-04-29",
        assignedTo: "ช่างวิชัย",
        budgetApproved: 5000,
        priority: "high",
        images: [
          "https://media.istockphoto.com/id/521811168/photo/air-conditioner-with-water-leaking.jpg?s=1024x1024&w=is&k=20&c=vZPBSxeB4x9lsEhAQUjVVVw2HEOKiEw_vPzzzq73k0k="
        ]
      },
      {
        requestId: "REP-2025-0004",
        equipment: {
          id: "EQP-004",
          code: "NET-007",
          name: "อุปกรณ์กระจายสัญญาณ",
          category: "อุปกรณ์เครือข่าย",
          image: "https://cdn-icons-png.flaticon.com/512/2329/2329087.png"
        },
        requester: {
          id: "USR-001",
          name: "ชัยวัฒน์ มีสุข",
          department: "แผนกไอที",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        description: "อุปกรณ์กระจายสัญญาณ Switch ชั้น 2 ทำงานไม่เสถียร สัญญาณขาดหายเป็นช่วงๆ",
        status: "inprogress",
        requestDate: "2025-04-25",
        estimatedCost: 8500,
        approvalDate: "2025-04-26",
        assignedTo: "ทีมเน็ตเวิร์ค",
        budgetApproved: 9000,
        priority: "urgent",
        estimatedCompletionDate: "2025-05-10",
        images: [
          "https://media.istockphoto.com/id/1333772625/photo/internet-router-with-ethernet-cables-connected-networking-equipment-with-blinking-lights.jpg?s=1024x1024&w=is&k=20&c=UNkRMrm0HkiBHXRZSEiYwdxufTM5Bkz5ftGXwQqxh2E="
        ]
      },
      {
        requestId: "REP-2025-0005",
        equipment: {
          id: "EQP-005",
          code: "FUR-023",
          name: "โต๊ะประชุม",
          category: "เฟอร์นิเจอร์",
          image: "https://cdn-icons-png.flaticon.com/512/7798/7798347.png"
        },
        requester: {
          id: "USR-004",
          name: "มานะ ใจดี",
          department: "แผนกบริหาร",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        description: "โต๊ะประชุมห้องประชุมใหญ่มีรอยแตกที่ขอบโต๊ะ และขาโต๊ะไม่มั่นคง",
        status: "rejected",
        requestDate: "2025-04-30",
        estimatedCost: 12000,
        approvalDate: "2025-05-02",
        approvalNotes: "งบประมาณจำกัด ให้ใช้โต๊ะสำรองไปก่อน",
        priority: "low",
        images: [
          "https://media.istockphoto.com/id/1213066789/photo/broken-wooden-table-with-cracks.jpg?s=1024x1024&w=is&k=20&c=d5-I4W5Sfk9BRoFBlPyP7XU9O79oNgkKLbgrxMGZzSE="
        ]
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

    setRepairRequests(mockData);
    setLoading(false);
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
                          className="cursor-pointer text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm mx-auto"
                        >
                          พิจารณา
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDialog(request)}
                          className="cursor-pointer text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-md text-sm mx-auto"
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