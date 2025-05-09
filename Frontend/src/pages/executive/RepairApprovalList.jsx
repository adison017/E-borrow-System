import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import RepairApprovalDialog from "./dialog/RepairApprovalDialog";

export default function RepairApprovalList() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // สถานะของคำขอซ่อม
  const statusOptions = [
    { value: "all", label: "ทั้งหมด" },
    { value: "pending", label: "รอการอนุมัติ" },
    { value: "approved", label: "อนุมัติแล้ว" },
    { value: "rejected", label: "ปฏิเสธ" },
    { value: "inprogress", label: "กำลังซ่อม" },
    { value: "completed", label: "เสร็จสิ้น" }
  ];

  const statusBadgeStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    inprogress: "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800"
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">อนุมัติคำขอแจ้งซ่อม</h1>

      {/* สรุปข้อมูล */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-gray-500">
          <p className="text-gray-500 text-sm">คำขอทั้งหมด</p>
          <p className="text-2xl font-semibold">{repairRequests.length}</p>
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
          <p className="text-gray-500 text-sm">กำลังดำเนินการ</p>
          <p className="text-2xl font-semibold">{countByStatus.inprogress || 0}</p>
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
              placeholder="ค้นหาด้วยรหัส, อุปกรณ์, หรือชื่อผู้แจ้ง"
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
                  <th>ผู้แจ้ง</th>
                  <th>วันที่แจ้ง</th>
                  <th>ค่าใช้จ่าย (บาท)</th>
                  <th>สถานะ</th>
                  <th className="text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.requestId} className="hover:bg-gray-50 border-b">
                    <td className="px-2">
                      <div className="font-medium">{request.requestId}</div>
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
                    <td>{request.requestDate}</td>
                    <td>{request.estimatedCost?.toLocaleString()}</td>
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
      <RepairApprovalDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        repairRequest={selectedRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </div>
  );
}