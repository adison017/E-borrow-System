import {
  EyeIcon,
  FunnelIcon,
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
  MenuHandler,
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

const initialPendingDeliveries = [
  {
    borrow_id: 1,
    borrow_code: "BR-001",
    borrower: {
      name: "John Doe",
      department: "แผนก IT",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    equipment: {
      name: "โน๊ตบุ๊ค Dell XPS 15",
      code: "EQ-1001",
      image: "/lo.png"
    },
    borrow_date: "2023-10-01",
    due_date: "2023-10-15",
    purpose: "ใช้ในการนำเสนองาน",
    status: "pending_delivery",
    delivery_date: null
  },
  {
    borrow_id: 2,
    borrow_code: "BR-002",
    borrower: {
      name: "Jane Smith",
      department: "แผนกการเงิน",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    equipment: {
      name: "เครื่องพิมพ์ HP LaserJet",
      code: "EQ-2001",
      image: "/lo.png"
    },
    borrow_date: "2023-10-05",
    due_date: "2023-10-20",
    purpose: "พิมพ์รายงานประจำเดือน",
    status: "pending_delivery",
    delivery_date: null
  },
  {
    borrow_id: 3,
    borrow_code: "BR-003",
    borrower: {
      name: "Robert Johnson",
      department: "แผนกการตลาด",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    equipment: {
      name: "กล้อง Canon EOS",
      code: "EQ-3001",
      image: "/lo.png"
    },
    borrow_date: "2023-10-10",
    due_date: "2023-10-25",
    purpose: "ถ่ายภาพงานอีเวนท์",
    status: "pending_delivery",
    delivery_date: null
  }
];

const initialCompletedDeliveries = [
  {
    borrow_id: 4,
    borrow_code: "BR-004",
    borrower: {
      name: "Mary Williams",
      department: "แผนกทรัพยากรบุคคล",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    equipment: {
      name: "โปรเจคเตอร์ Epson",
      code: "EQ-4001",
      image: "/lo.png"
    },
    borrow_date: "2023-10-15",
    due_date: "2023-10-30",
    purpose: "ใช้ในการอบรมพนักงานใหม่",
    status: "delivered",
    delivery_date: "2023-10-15",
    delivery_note: "ส่งมอบเรียบร้อย",
    receiver_signature: "signature.png"
  }
];

const statusConfig = {
  "pending_delivery": {
    label: "รอส่งมอบ",
    color: "yellow",
    icon: ClockIcon,
    backgroundColor: "bg-yellow-50",
    borderColor: "border-yellow-100"
  },
  "delivered": {
    label: "ส่งมอบแล้ว",
    color: "green",
    icon: CheckCircleSolidIcon,
    backgroundColor: "bg-green-50",
    borderColor: "border-green-100"
  }
};

const ReceiveItem = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState(initialPendingDeliveries);
  const [completedDeliveries, setCompletedDeliveries] = useState(initialCompletedDeliveries);
  const [allDeliveries, setAllDeliveries] = useState([...initialPendingDeliveries, ...initialCompletedDeliveries]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([...initialPendingDeliveries, ...initialCompletedDeliveries]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_delivery");

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
    // รวมรายการทั้งหมดเข้าด้วยกัน
    const combined = [...pendingDeliveries, ...completedDeliveries];
    setAllDeliveries(combined);

    // กรองตาม tab ที่เลือก
    if (statusFilter === "pending_delivery") {
      setFilteredDeliveries(pendingDeliveries);
    } else {
      setFilteredDeliveries(completedDeliveries);
    }
  }, [pendingDeliveries, completedDeliveries, statusFilter]);

  useEffect(() => {
    // กรองตามคำค้นหา
    if (searchTerm.trim() === "") {
      if (statusFilter === "pending_delivery") {
        setFilteredDeliveries(pendingDeliveries);
      } else {
        setFilteredDeliveries(completedDeliveries);
      }
    } else {
      const toFilter = statusFilter === "pending_delivery" ? pendingDeliveries : completedDeliveries;
      const filtered = toFilter.filter(item =>
        item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeliveries(filtered);
    }
  }, [searchTerm, statusFilter, pendingDeliveries, completedDeliveries]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScanComplete = (code) => {
    setIsScannerOpen(false);

    // ตรวจสอบว่ารหัสที่สแกนตรงกับรายการยืมหรือไม่
    const borrowedItem = allDeliveries.find(item =>
      item.borrow_code === code || item.equipment.code === code
    );

    if (borrowedItem) {
      setSelectedBorrow(borrowedItem);
      setIsDeliveryDialogOpen(true);
    } else {
      // ถ้าไม่พบ แสดงข้อความแจ้งเตือน
      showNotification("ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่สแกน", "error");
    }
  };

  const handleManualSearch = (code) => {
    setIsScannerOpen(false);

    if (!code.trim()) return;

    // ตรวจสอบว่ารหัสที่ป้อนตรงกับรายการยืมหรือไม่
    const borrowedItem = allDeliveries.find(item =>
      item.borrow_code.toLowerCase() === code.toLowerCase() ||
      item.equipment.code.toLowerCase() === code.toLowerCase()
    );

    if (borrowedItem) {
      setSelectedBorrow(borrowedItem);
      setIsDeliveryDialogOpen(true);
    } else {
      // ถ้าไม่พบ แสดงข้อความแจ้งเตือน
      showNotification("ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่ป้อน", "error");
    }
  };

  const handleViewDetails = (borrowItem) => {
    setSelectedBorrow(borrowItem);
    setIsDeliveryDialogOpen(true);
  };

  const handleDeliveryConfirm = (deliveryData) => {
    // อัปเดตสถานะรายการยืม
    const updatedItem = {
      ...deliveryData.borrowItem,
      status: "delivered",
      delivery_date: new Date().toISOString().split('T')[0], // วันที่ปัจจุบัน
      delivery_note: deliveryData.deliveryNote,
      receiver_signature: deliveryData.signature || "signature.png" // สมมติว่ามีการเซ็นต์รับ
    };

    // ลบรายการจาก pending และเพิ่มเข้า completed
    const updatedPending = pendingDeliveries.filter(
      item => item.borrow_id !== updatedItem.borrow_id
    );
    setPendingDeliveries(updatedPending);
    setCompletedDeliveries([updatedItem, ...completedDeliveries]);

    // ปิด dialog
    setIsDeliveryDialogOpen(false);

    // แสดงข้อความแจ้งเตือนสำเร็จ
    showNotification("ส่งมอบครุภัณฑ์เรียบร้อยแล้ว", "success");
  };

  const handleCancelBorrow = (borrowId) => {
    setSelectedBorrowId(borrowId);
    setIsConfirmDialogOpen(true);
  };

  const confirmCancel = () => {
    // ลบรายการยืมออกจากระบบ
    const updatedPending = pendingDeliveries.filter(
      item => item.borrow_id !== selectedBorrowId
    );
    setPendingDeliveries(updatedPending);

    // ปิด dialog
    setIsConfirmDialogOpen(false);

    // แสดงข้อความแจ้งเตือนสำเร็จ
    showNotification("ยกเลิกการยืมเรียบร้อยแล้ว", "success");
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });

    // ซ่อนการแจ้งเตือนอัตโนมัติหลังจาก 5 วินาที
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleStatusFilter = (status) => setStatusFilter(status);
  const countByStatus = {
    pending_delivery: pendingDeliveries.length,
    delivered: completedDeliveries.length
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
                  className="w-full h-10 pl-10 pr-4 py-2.5 border border-gray-300 rounded-2xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
                  placeholder="ค้นหาผู้ยืม, ครุภัณฑ์, แผนก..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-x-3 w-full md:w-auto justify-start md:justify-end">
              <Menu>
                <MenuHandler>
                  <Button variant="outlined" className="border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm rounded-xl flex items-center gap-2 px-4 py-2 text-sm font-medium normal-case">
                    <FunnelIcon className="h-4 w-4" />
                    ตัวกรอง
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-1.5">
                      {statusConfig[statusFilter].label} ({countByStatus[statusFilter] || 0})
                    </span>
                  </Button>
                </MenuHandler>
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
                className="flex items-center gap-2"
                color="blue"
                size="sm"
                onClick={() => setIsScannerOpen(true)}
              >
                <QrCodeIcon strokeWidth={2} className="h-4 w-4" /> สแกนเพื่อส่งมอบ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((item, index) => (
                    <tr key={item.borrow_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{item.borrow_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography variant="small" className="font-semibold text-gray-900">{item.borrower.name}</Typography>
                        <Typography variant="small" className="font-normal text-gray-600 text-xs">{item.borrower.department}</Typography>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography variant="small" className="font-semibold text-gray-900">{item.equipment.name}</Typography>
                        <Typography variant="small" className="font-normal text-gray-600 text-xs">{item.equipment.code}</Typography>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.borrow_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.due_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex justify-center leading-5 font-semibold rounded-full border text-xs ${statusConfig[item.status]?.backgroundColor || "bg-gray-200"} ${statusConfig[item.status]?.borderColor || "border-gray-200"} text-${statusConfig[item.status]?.color || "gray"}-800`}>
                          {statusConfig[item.status]?.label || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Tooltip content="ดูรายละเอียด" placement="top">
                            <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleViewDetails(item)}>
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          {item.status === "pending_delivery" && (
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
            แสดง {filteredDeliveries.length > 0 ? '1' : '0'} ถึง {filteredDeliveries.length} จากทั้งหมด {statusFilter === "pending_delivery" ? pendingDeliveries.length : completedDeliveries.length} รายการ
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