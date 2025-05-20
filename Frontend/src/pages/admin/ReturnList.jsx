import {
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid"; // ไอคอนแบบทึบ (ใช้กับ badge สถานะ)

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
import ReturnFormDialog from "./dialog/ReturnFormDialog";
import ReturndetailsDialog from "./dialog/ReturndetailsDialog";


// Import services
import { calculateReturnStatus, createNewReturn } from "../../components/returnService";

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
  "รหัสการคืน",
  "รหัสการยืม",
  "ผู้ยืม",
  "ครุภัณฑ์",
  "วันที่ยืม",
  "กำหนดคืน",
  "วันที่คืนจริง",
  "สถานะ",
  "ค่าปรับ",
  "จัดการ"
];

const initialReturns = [
  {
    return_id: 1,
    return_code: "RT-001",
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
    return_date: "2023-10-14",
    status: "completed",
    condition: "ปกติ",
    fine_amount: 0,
    notes: ""
  },
  {
    return_id: 2,
    return_code: "RT-002",
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
    return_date: "2023-10-25",
    status: "overdue",
    condition: "ชำรุดเล็กน้อย",
    fine_amount: 250,
    notes: "คืนช้า 5 วัน"
  },
  {
    return_id: 3,
    return_code: "RT-003",
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
    return_date: null,
    status: "pending",
    condition: null,
    fine_amount: 0,
    notes: ""
  }
];

const initialBorrowedItems = [
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
    status: "active"
  },
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
    status: "active"
  }
];

const statusConfig = {
  completed: {
    label: "คืนแล้ว",
    color: "green",
    icon: CheckCircleSolidIcon,
    backgroundColor: "bg-green-50",
    borderColor: "border-green-100"
  },
  overdue: {
    label: "เกินกำหนด",
    color: "red",
    icon: ExclamationTriangleIcon,
    backgroundColor: "bg-red-50",
    borderColor: "border-red-100"
  },
  pending: {
    label: "รอคืน",
    color: "yellow",
    icon: ClockIcon,
    backgroundColor: "bg-yellow-50",
    borderColor: "border-yellow-100"
  }
};

const ReturnList = () => {
  const [returns, setReturns] = useState(initialReturns);
  const [borrowedItems, setBorrowedItems] = useState(initialBorrowedItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  // Dialog states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReturnFormOpen, setIsReturnFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Current data states
  const [selectedBorrowedItem, setSelectedBorrowedItem] = useState(null);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  // Return processing states
  const [returnStatus, setReturnStatus] = useState({
    isOverdue: false,
    overdayCount: 0,
    fineAmount: 0
  });

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScanComplete = (code) => {
    setIsScannerOpen(false);

    // Check if code matches a borrowed item
    const borrowedItem = borrowedItems.find(item =>
      item.borrow_code === code || item.equipment.code === code
    );

    if (borrowedItem) {
      // Calculate overdue status
      const status = calculateReturnStatus(borrowedItem);
      setReturnStatus(status);
      setSelectedBorrowedItem(borrowedItem);
      setIsReturnFormOpen(true);
    } else {
      // If no match, show error notification
      showNotification("ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่สแกน", "error");
    }
  };

  const handleManualSearch = (code) => {
    setIsScannerOpen(false);

    if (!code.trim()) return;

    // Check if code matches a borrowed item
    const borrowedItem = borrowedItems.find(item =>
      item.borrow_code.toLowerCase() === code.toLowerCase() ||
      item.equipment.code.toLowerCase() === code.toLowerCase()
    );

    if (borrowedItem) {
      // Calculate overdue status
      const status = calculateReturnStatus(borrowedItem);
      setReturnStatus(status);
      setSelectedBorrowedItem(borrowedItem);
      setIsReturnFormOpen(true);
    } else {
      // If no match, show error notification
      showNotification("ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่ป้อน", "error");
    }
  };

  const handleReturnConfirm = (returnData) => {
    // Create new return record
    const newReturn = createNewReturn(returnData.borrowedItem, {
      returnCondition: returnData.returnCondition,
      returnNotes: returnData.returnNotes,
      fineAmount: returnData.fineAmount
    }, returns);

    // Add new return to returns list
    setReturns([newReturn, ...returns]);

    // Remove returned item from borrowed items list
    const updatedBorrowedItems = borrowedItems.filter(
      item => item.borrow_code !== returnData.borrowedItem.borrow_code
    );
    setBorrowedItems(updatedBorrowedItems);

    // Close return form
    setIsReturnFormOpen(false);

    // Show success notification
    showNotification("บันทึกการคืนครุภัณฑ์เรียบร้อยแล้ว", "success");
  };

  const handleViewDetails = (returnItem) => {
    setSelectedReturnItem(returnItem);
    setIsDetailsOpen(true);
  };

  const handleDeleteReturn = (returnId) => {
    setSelectedReturnId(returnId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    // Find the deleted return item
    const deletedItem = returns.find(item => item.return_id === selectedReturnId);

    // Filter out the deleted item
    const updatedReturns = returns.filter(item => item.return_id !== selectedReturnId);
    setReturns(updatedReturns);

    // Add the item back to borrowed items if it's not in there already
    const isAlreadyInBorrowed = borrowedItems.some(
      item => item.borrow_code === deletedItem.borrow_code
    );

    if (!isAlreadyInBorrowed) {
      const returnedToBorrowed = {
        borrow_id: deletedItem.return_id,
        borrow_code: deletedItem.borrow_code,
        borrower: deletedItem.borrower,
        equipment: deletedItem.equipment,
        borrow_date: deletedItem.borrow_date,
        due_date: deletedItem.due_date,
        status: "active"
      };

      setBorrowedItems([...borrowedItems, returnedToBorrowed]);
    }

    // Close confirm dialog
    setIsDeleteConfirmOpen(false);

    // Show success notification
    showNotification("ลบรายการคืนเรียบร้อยแล้ว", "success");
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });

    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-green-700 text-xs font-semibold">
            <CheckCircleSolidIcon className="w-4 h-4" /> คืนแล้ว
          </div>
        );
      case "overdue":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-red-700 text-xs font-semibold">
            <ExclamationTriangleIcon className="w-4 h-4" /> เกินกำหนด
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 text-xs font-semibold">
            <ClockIcon className="w-4 h-4" /> รอคืน
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-gray-700 text-xs font-semibold">
            ไม่ทราบสถานะ
          </div>
        );
    }
  };

  const handleStatusFilter = (status) => setStatusFilter(status);
  const countByStatus = returns.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const filteredReturns = returns
    .filter(item => {
      const matchesSearch =
        item.return_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ทั้งหมด" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

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
                รายการคืนครุภัณฑ์
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm text-gray-600">
                จัดการและติดตามการคืนครุภัณฑ์ทั้งหมดภายในระบบ
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
                    {statusFilter !== "ทั้งหมด" && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-1.5">
                        {statusConfig[statusFilter]?.label || statusFilter} ({countByStatus[statusFilter] || 0})
                      </span>
                    )}
                  </Button>
                </MenuHandler>
                <MenuList className="min-w-[200px] bg-white text-gray-800 rounded-lg border border-gray-100 p-2">
                  <MenuItem
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${statusFilter === "ทั้งหมด" ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                    onClick={() => handleStatusFilter("ทั้งหมด")}
                  >
                    <span>ทั้งหมด</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{returns.length}</span>
                  </MenuItem>
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
                <QrCodeIcon strokeWidth={2} className="h-4 w-4" /> สแกนเพื่อคืน
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>
                  {TABLE_HEAD.map((head, idx) => (
                    <th
                      key={head}
                      className={
                        "px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider " +
                        (idx === 2 || idx === 3 ? "max-w-xs min-w-0 truncate" : "whitespace-nowrap")
                      }
                      style={idx === 2 || idx === 3 ? {width: '180px'} : {}}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReturns.length > 0 ? (
                  filteredReturns.map((item, index) => (
                    <tr key={item.return_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{item.return_code}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{item.borrow_code}</td>
                      <td className="px-4 py-3 min-w-0 max-w-xs truncate">
                        <Typography variant="small" className="font-semibold text-gray-900 truncate">{item.borrower.name}</Typography>
                        <Typography variant="small" className="font-normal text-gray-600 text-xs truncate">{item.borrower.department}</Typography>
                      </td>
                      <td className="px-4 py-3 min-w-0 max-w-xs truncate">
                        <Typography variant="small" className="font-semibold text-gray-900 truncate">{item.equipment.name}</Typography>
                        <Typography variant="small" className="font-normal text-gray-600 text-xs truncate">{item.equipment.code}</Typography>
                      </td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{item.borrow_date}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{item.due_date}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{item.return_date || "-"}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex justify-center leading-5 font-semibold rounded-full border text-xs ${statusConfig[item.status]?.backgroundColor || "bg-gray-200"} ${statusConfig[item.status]?.borderColor || "border-gray-200"} text-${statusConfig[item.status]?.color || "gray"}-800`}>
                          {statusConfig[item.status]?.label || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{item.fine_amount > 0 ? `${item.fine_amount} บาท` : "-"}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Tooltip content="ดูรายละเอียด" placement="top">
                            <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleViewDetails(item)}>
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="ลบ" placement="top">
                            <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleDeleteReturn(item.return_id)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
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
                        ไม่พบรายการคืนที่ตรงกับการค้นหา
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
            แสดง {filteredReturns.length > 0 ? '1' : '0'} ถึง {filteredReturns.length} จากทั้งหมด {returns.length} รายการ
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

        {/* Return Form Dialog */}
        <ReturnFormDialog
          borrowedItem={selectedBorrowedItem}
          isOpen={isReturnFormOpen}
          onClose={() => setIsReturnFormOpen(false)}
          onConfirm={handleReturnConfirm}
          isOverdue={returnStatus.isOverdue}
          overdayCount={returnStatus.overdayCount}
          fineAmount={returnStatus.fineAmount}
          setFineAmount={(amount) => setReturnStatus(prev => ({ ...prev, fineAmount: amount }))}
        />

        {/* Return Details Dialog */}
        <ReturndetailsDialog
          returnItem={selectedReturnItem}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="ยืนยันการลบ"
          message="คุณต้องการลบรายการคืนนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        />
      </Card>
    </ThemeProvider>
  );
};

export default ReturnList;