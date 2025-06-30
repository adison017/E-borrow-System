import {
  EyeIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon
} from "@heroicons/react/24/solid";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  ThemeProvider,
  Tooltip,
  Typography
} from "@material-tailwind/react";

// Import components
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Notification";
import ScannerDialog from "../../components/ScannerDialog";
import { getAllBorrows, updateBorrowStatus } from "../../utils/api";
import EquipmentDeliveryDialog from "./dialog/EquipmentDeliveryDialog";

// กำหนด theme สีพื้นฐานเป็นสีดำ
const theme = {
  typography: {
    defaultProps: {
      color: "black",
      textGradient: false,
    },
  }
};

const TABLE_HEAD = [
  "รหัสการยืม",
  "ผู้ยืม",
  "ครุภัณฑ์",
  "วันที่ยืม",
  "กำหนดส่งคืน",
  "วัตถุประสงค์",
  "สถานะ",
  "จัดการ"
];

const statusConfig = {
  carry: {
    label: "รอส่งมอบ",
    color: "yellow",
    icon: ClockIcon,
    backgroundColor: "bg-yellow-50",
    borderColor: "border-yellow-100"
  },
  delivered: {
    label: "ส่งมอบแล้ว",
    color: "green",
    icon: CheckCircleSolidIcon,
    backgroundColor: "bg-green-50",
    borderColor: "border-green-100"
  }
};

const ReceiveItem = () => {
  const [borrows, setBorrows] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("carry");

  // Dialog states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Current data states
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [selectedBorrowId, setSelectedBorrowId] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    // Fetch borrows from backend
    getAllBorrows().then(data => {
      setBorrows(Array.isArray(data) ? data : []);
    });
  }, []);

  useEffect(() => {
    // Filter by status
    const filtered = borrows.filter(b => b.status === statusFilter);
    setFilteredDeliveries(filtered);
  }, [borrows, statusFilter]);

  useEffect(() => {
    // Filter by search term
    if (searchTerm.trim() === "") {
      setFilteredDeliveries(borrows.filter(b => b.status === statusFilter));
    } else {
      const filtered = borrows.filter(item =>
        item.status === statusFilter && (
          item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.borrower?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(item.equipment) && item.equipment.some(eq =>
            eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eq.code?.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        )
      );
      setFilteredDeliveries(filtered);
    }
  }, [searchTerm, statusFilter, borrows]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleScanComplete = (code) => {
    setIsScannerOpen(false);
    const borrowedItem = filteredDeliveries.find(item =>
      item.borrow_code === code ||
      (Array.isArray(item.equipment) && item.equipment.some(eq => eq.code === code))
    );
    if (borrowedItem) {
      setSelectedBorrow(borrowedItem);
      setIsDeliveryDialogOpen(true);
    } else {
      showNotification("ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่สแกน", "error");
    }
  };

  const handleManualSearch = (code) => {
    setIsScannerOpen(false);
    if (!code.trim()) return;
    const borrowedItem = filteredDeliveries.find(item =>
      item.borrow_code.toLowerCase() === code.toLowerCase() ||
      (Array.isArray(item.equipment) && item.equipment.some(eq => eq.code.toLowerCase() === code.toLowerCase()))
    );
    if (borrowedItem) {
      setSelectedBorrow(borrowedItem);
      setIsDeliveryDialogOpen(true);
    } else {
      showNotification("ไม่พบข้อมูลการยืมที่ป้อน", "error");
    }
  };

  const handleViewDetails = (borrowItem) => {
    setSelectedBorrow(borrowItem);
    setIsDeliveryDialogOpen(true);
  };

  const handleDeliveryConfirm = async (deliveryData) => {
    // ตรวจสอบว่า signature_image เป็น base64 หรือ path
    let signatureToSend = deliveryData.signature_image;
    // ถ้า signature_image เป็น path (ไม่ใช่ base64) และไม่ใช่ค่าว่าง ให้ส่ง "" (เพื่อบังคับให้ backend ไม่อัปเดต signature_image ซ้ำ)
    if (signatureToSend && !signatureToSend.startsWith('data:image/')) {
      // ถ้าเป็น path (เช่น uploads/signature/xxx.png) ให้ส่ง ""
      signatureToSend = '';
    }
    await updateBorrowStatus(
      deliveryData.borrow_id,
      "approved",
      signatureToSend
    );
    // Refresh borrows
    getAllBorrows().then(data => setBorrows(Array.isArray(data) ? data : []));
    setIsDeliveryDialogOpen(false);
    showNotification("ส่งมอบครุภัณฑ์เรียบร้อยแล้ว", "success");
  };

  const handleCancelBorrow = async (borrowId) => {
    setSelectedBorrowId(borrowId);
    setIsConfirmDialogOpen(true);
  };

  const confirmCancel = async () => {
    await updateBorrowStatus(selectedBorrowId, "cancelled");
    getAllBorrows().then(data => setBorrows(Array.isArray(data) ? data : []));
    setIsConfirmDialogOpen(false);
    showNotification("ยกเลิกการยืมเรียบร้อยแล้ว", "success");
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleStatusFilter = (status) => setStatusFilter(status);
  const countByStatus = {
    carry: borrows.filter(b => b.status === "carry").length,
    delivered: borrows.filter(b => b.status === "delivered").length
  };

  return (
    <ThemeProvider value={theme}>
      <Card className="h-full w-full text-gray-800 rounded-2xl shadow-lg">
        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
        <CardHeader floated={false} shadow={false} className="rounded-t-2xl bg-white px-8 py-6">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Typography variant="h5" className="text-gray-900 font-semibold tracking-tight">
                รายการส่งมอบครุภัณฑ์
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm text-gray-600">
                จัดการและติดตามการส่งมอบครุภัณฑ์ให้กับผู้ใช้งาน
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-x-4">
            <div className="w-full md:flex-grow relative">
              <label htmlFor="search" className="sr-only">ค้นหาครุภัณฑ์</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  type="text"
                  className="w-full h-10 pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
                  placeholder="ค้นหาผู้ยืม, ครุภัณฑ์, แผนก..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-x-3 w-full md:w-auto justify-start md:justify-end">
              <Menu>
                <MenuList className="min-w-[200px] bg-white text-gray-800 rounded-lg border border-gray-100 p-2">
                  {Object.keys(statusConfig).map(statusKey => (
                    <MenuItem
                      key={statusKey}
                      className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${statusFilter === statusKey ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                      onClick={() => handleStatusFilter(statusKey)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full bg-${statusConfig[statusKey].color}-500`}></span>
                        <span>{statusConfig[statusKey].label}</span>
                      </div>
                      <span className={`text-xs bg-${statusConfig[statusKey].color}-100 text-${statusConfig[statusKey].color}-700 px-1.5 py-0.5 rounded-full`}>{countByStatus[statusKey] || 0}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Button
                className="flex items-center gap-2 px-4 py-3"
                color="blue"
                size="sm"
                onClick={() => setIsScannerOpen(true)}
              >
                <QrCodeIcon strokeWidth={2} className="h-4 w-4" /> สแกนเพื่อส่งมอบ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto ">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>
                  <th className="w-28 px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">รหัสการยืม</th>
                  <th className="w-48 px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">ผู้ยืม</th>
                  <th className="w-64 px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">ครุภัณฑ์</th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">วันที่ยืม</th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">กำหนดส่งคืน</th>
                  <th className="w-56 px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">วัตถุประสงค์</th>
                  <th className="w-20 px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">สถานะ</th>
                  <th className="w-32 px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((item, index) => (
                    <tr key={item.borrow_id} className="hover:bg-gray-50">
                      <td className="w-28 px-4 py-4 whitespace-nowrap font-bold text-gray-900 text-left">{item.borrow_code}</td>
                      <td className="w-48 px-4 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.borrower.avatar ? `http://localhost:5000/uploads/user/${item.borrower.avatar}` : '/profile.png'}
                            alt={item.borrower.name}
                            className="w-10 h-10 rounded-full object-cover bg-white border border-gray-200 shadow-sm"
                          />
                          <div>
                            <Typography variant="small" className="font-semibold text-gray-900">{item.borrower.name}</Typography>
                            <Typography variant="small" className="font-normal text-gray-600 text-xs">
                              {item.borrower.position}
                            </Typography>
                            <Typography variant="small" className="font-normal text-gray-400 text-xs">
                              {item.borrower.department}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="w-64 px-4 py-4 whitespace-normal text-left">
                        <div className="space-y-2">
                          {item.equipment.length > 0 ? (
                            <>
                              <div className="flex items-center justify-between">
                                <Typography variant="small" className="font-semibold text-gray-900 break-words">
                                  {item.equipment[0]?.name || '-'}
                                  {item.equipment.length > 1 &&
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                      +{item.equipment.length - 1} รายการ
                                    </span>
                                  }
                                </Typography>
                              </div>
                              <Typography variant="small" className="font-normal text-gray-600 text-xs">
                                รวม {item.equipment.reduce((total, eq) => total + (eq.quantity || 1), 0)} ชิ้น
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="small" className="font-normal text-gray-400">-</Typography>
                          )}
                        </div>
                      </td>
                      <td className="w-32 px-4 py-4 whitespace-nowrap text-gray-900 text-left">{item.borrow_date ? item.borrow_date.slice(0, 10) : "-"}</td>
                      <td className="w-32 px-4 py-4 whitespace-nowrap text-gray-900 text-left">{item.due_date ? item.due_date.slice(0, 10) : "-"}</td>
                      <td className="w-56 px-4 py-4 whitespace-nowrap truncate text-gray-900 text-left">
                        <Typography variant="small" className="text-xs text-gray-700 whitespace-pre-line break-words">
                          {item.purpose}
                        </Typography>
                      </td>
                      <td className="w-20 px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex justify-center leading-5 font-semibold rounded-full border text-xs ${statusConfig[item.status]?.backgroundColor || "bg-gray-200"} ${statusConfig[item.status]?.borderColor || "border-gray-200"} text-${statusConfig[item.status]?.color || "gray"}-800`}>
                          {statusConfig[item.status]?.label || "-"}
                        </span>
                      </td>
                      <td className="w-32 px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Tooltip content="ดูรายละเอียด" placement="top">
                            <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleViewDetails(item)}>
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          {item.status === "carry" && (
                            <Tooltip content="ยกเลิกการยืม" placement="top">
                              <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleCancelBorrow(item.borrow_id)}>
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={TABLE_HEAD.length} className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center p-5 bg-gray-100 rounded-full mb-5">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                      </div>
                      <Typography variant="h6" className="text-gray-700 font-medium mb-1">
                        ไม่พบรายการที่ตรงกับการค้นหา
                      </Typography>
                      <Typography color="gray" className="text-sm text-gray-500">
                        ลองปรับคำค้นหาหรือตัวกรองสถานะของคุณ
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 p-6 bg-white rounded-b-2xl">
          <Typography variant="small" className="font-normal text-gray-600 mb-3 sm:mb-0 text-sm">
            แสดง {filteredDeliveries.length > 0 ? '1' : '0'} ถึง {filteredDeliveries.length} จากทั้งหมด {statusFilter === "carry" ? borrows.filter(b => b.status === "carry").length : borrows.filter(b => b.status === "delivered").length} รายการ
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" disabled className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case">
              ก่อนหน้า
            </Button>
            <Button variant="outlined" size="sm" disabled className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case">
              ถัดไป
            </Button>
          </div>
        </CardFooter>
        {/* Scanner Dialog */}
        <ScannerDialog
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanComplete={handleScanComplete}
          onManualInput={handleManualSearch}
        />

        {/* Delivery Dialog */}
        <EquipmentDeliveryDialog
          borrow={selectedBorrow}
          isOpen={isDeliveryDialogOpen}
          onClose={() => setIsDeliveryDialogOpen(false)}
          onConfirm={handleDeliveryConfirm}
        />

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={confirmCancel}
          title="ยืนยันการยกเลิก"
          message="คุณต้องการยกเลิกการยืมรายการนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        />
      </Card>
    </ThemeProvider>
  );
};

export default ReceiveItem;