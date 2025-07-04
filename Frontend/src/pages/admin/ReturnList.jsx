import {
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import {
  BanknotesIcon,
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
import { UPLOAD_BASE } from "../../utils/api";

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
  "กำหนดคืน",
  "สถานะ",
  "จัดการ"
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
  approved: {
    label: "รอคืน",
    color: "yellow",
    icon: ClockIcon,
    backgroundColor: "bg-yellow-50",
    borderColor: "border-yellow-100"
  },
  waiting_payment: {
    label: "รอชำระเงิน",
    color: "amber",
    icon: ClockIcon,
    backgroundColor: "bg-amber-50",
    borderColor: "border-amber-100"
  }
};

const displayableStatusKeys = ["approved", "overdue", "waiting_payment"];

const ReturnList = () => {
  const [returns, setReturns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

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

  useEffect(() => {
    fetch(`${UPLOAD_BASE}/api/returns`)
      .then(res => res.json())
      .then(data => {
        console.log("API returns:", data);

        // Mapping: ให้แน่ใจว่ามี field borrower และ equipment เป็น array
        const mapped = data.map(item => ({
          ...item,
          borrower: item.borrower
            ? item.borrower
            : {
                name: item.fullname,
                position: item.position_name,
                department: item.branch_name,
                avatar: item.avatar,
                role: item.role_name,
              },
          equipment: Array.isArray(item.equipment)
            ? item.equipment
            : item.equipment
              ? [item.equipment]
              : [],
        }));

        setReturns(mapped);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchReturnDetails = async (borrow_id) => {
    const res = await fetch(`${UPLOAD_BASE}/api/returns/by-borrow/${borrow_id}`);
    if (!res.ok) return null;
    const data = await res.json();
    // คืน return ล่าสุด (ถ้ามีหลาย record)
    if (Array.isArray(data) && data.length > 0) {
      // sort by return_date desc
      return data.sort((a, b) => new Date(b.return_date) - new Date(a.return_date))[0];
    }
    return null;
  };

  const handleScanComplete = async (code) => {
    setIsScannerOpen(false);
    let borrowedItem = returns.find(item =>
      item.borrow_code === code || item.equipment.code === code
    );
    if (borrowedItem) {
      if (!borrowedItem.user_id && borrowedItem.borrower?.user_id) {
        borrowedItem = { ...borrowedItem, user_id: borrowedItem.borrower.user_id };
      }
      let paymentDetails = null;
      if (borrowedItem.status === 'waiting_payment') {
        paymentDetails = await fetchReturnDetails(borrowedItem.borrow_id);
      }
      const status = calculateReturnStatus(borrowedItem);
      setReturnStatus(status);
      setSelectedBorrowedItem(borrowedItem);
      setSelectedReturnItem({ ...borrowedItem, paymentDetails });
      setIsReturnFormOpen(true);
    } else {
      showNotification('ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่สแกน', 'error');
    }
  };

  const handleManualSearch = async (code) => {
    setIsScannerOpen(false);
    if (!code.trim()) return;
    let borrowedItem = returns.find(item =>
      (item.borrow_code && item.borrow_code.toLowerCase() === code.toLowerCase()) ||
      (item.equipment?.code && String(item.equipment.code).toLowerCase() === code.toLowerCase())
    );
    if (borrowedItem) {
      if (!borrowedItem.user_id && borrowedItem.borrower?.user_id) {
        borrowedItem = { ...borrowedItem, user_id: borrowedItem.borrower.user_id };
      }
      let paymentDetails = null;
      if (borrowedItem.status === 'waiting_payment') {
        paymentDetails = await fetchReturnDetails(borrowedItem.borrow_id);
      }
      const status = calculateReturnStatus(borrowedItem);
      setReturnStatus(status);
      setSelectedBorrowedItem(borrowedItem);
      setSelectedReturnItem({ ...borrowedItem, paymentDetails });
      setIsReturnFormOpen(true);
    } else {
      showNotification('ไม่พบข้อมูลการยืมที่ตรงกับรหัสที่ค้นหา', 'error');
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

    // Close return form
    setIsReturnFormOpen(false);

    // Show success notification
    showNotification("บันทึกการคืนครุภัณฑ์เรียบร้อยแล้ว", "success");
  };

  const handleViewDetails = (returnItem) => {
    console.log('DEBUG returnItem:', returnItem);
    console.log('DEBUG returnItem.status:', returnItem?.status);
    setSelectedReturnItem(returnItem);
    setIsDetailsOpen(true);
  };

  const handleDeleteReturn = (returnId) => {
    setSelectedReturnId(returnId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    // Find the deleted return item
    const deletedItem = returns.find(item => item.borrow_id === selectedReturnId);

    // Filter out the deleted item
    const updatedReturns = returns.filter(item => item.borrow_id !== selectedReturnId);
    setReturns(updatedReturns);

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
      case "approved":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 text-xs font-semibold">
            <ClockIcon className="w-4 h-4" /> รอคืน
          </div>
        );
      case "waiting_payment":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-blue-800 text-xs font-semibold animate-pulse border border-blue-200">
            <BanknotesIcon className="w-4 h-4" /> รอชำระเงิน
          </div>
        );
      default:
        return <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-gray-700 text-xs font-semibold">ไม่ทราบสถานะ</div>;
    }
  };

  const handleStatusFilter = (status) => setStatusFilter(status);
  const countByStatus = returns.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const filteredReturns = returns.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (item.borrow_code && item.borrow_code.toLowerCase().includes(searchTermLower)) ||
      (item.borrower?.name && item.borrower.name.toLowerCase().includes(searchTermLower)) ||
      (item.borrower?.department && item.borrower.department.toLowerCase().includes(searchTermLower)) ||
      (Array.isArray(item.equipment) && item.equipment.some(
        eq => (eq.name && eq.name.toLowerCase().includes(searchTermLower)) ||
              (eq.code && String(eq.code).toLowerCase().includes(searchTermLower))
      ));
    const matchesStatus = statusFilter === "ทั้งหมด" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredReturns.length / rowsPerPage);
  const paginatedReturns = filteredReturns.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                      {returns.filter(r => displayableStatusKeys.includes(r.status)).length}
                    </span>
                  </MenuItem>
                  {displayableStatusKeys.map(statusKey => {
                    const config = statusConfig[statusKey];
                    if (!config) return null; // Should not happen
                    return (
                      <MenuItem
                        key={statusKey}
                        className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${statusFilter === statusKey ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                        onClick={() => handleStatusFilter(statusKey)}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full bg-${config.color}-500`}></span>
                          <span>{config.label}</span>
                        </div>
                        <span className={`text-xs bg-${config.color}-100 text-${config.color}-700 px-1.5 py-0.5 rounded-full`}>{countByStatus[statusKey] || 0}</span>
                      </MenuItem>
                    );
                  })}
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
        <CardBody className="overflow-x-auto">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>
                  <th className="w-24 text-left px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">รหัสการยืม</th>
                  <th className="w-48 text-left px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">ผู้ยืม</th>
                  <th className="w-64 text-left px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">ครุภัณฑ์</th>
                  <th className="w-28 text-left px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">วันที่ยืม</th>
                  <th className="w-28 text-left px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">กำหนดคืน</th>
                  <th className="w-32 text-center px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">สถานะ</th>
                  <th className="w-40 text-center px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReturns.length > 0 ? (
                  paginatedReturns.map((item, idx) => (
                    (console.log('DEBUG item.status:', item.status),
                    <tr key={item.borrow_id} className="hover:bg-gray-50">
                      <td className="w-24 px-4 py-4 whitespace-nowrap font-bold text-gray-900 text-left">{item.borrow_code}</td>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.borrower.avatar
                                ? item.borrower.avatar.startsWith('http')
                                  ? item.borrower.avatar
                                  : `${UPLOAD_BASE}/uploads/user/${item.borrower.avatar}`
                                : '/default-avatar.png'
                            }
                            alt={item.borrower.name}
                            className="w-10 h-10 rounded-full object-cover bg-white border border-gray-200 shadow-sm flex-shrink-0"
                          />
                          <div className="overflow-hidden">
                            <Typography variant="small" className="font-semibold text-gray-900 truncate">{item.borrower.name}</Typography>
                            <Typography variant="small" className="font-normal text-gray-600 text-xs">
                              {item.borrower.position}
                            </Typography>
                            <Typography variant="small" className="font-normal text-gray-400 text-xs">
                              {item.borrower.department}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="w-64 px-4 py-4 whitespace-normal break-words text-left">
                        <div className="space-y-1 overflow-hidden">
                          {Array.isArray(item.equipment) ? (
                            <>
                              <div className="flex items-center">
                                <Typography variant="small" className="font-semibold text-black-900 break-words">
                                  {item.equipment[0]?.name || '-'}
                                </Typography>
                                {item.equipment.length > 1 &&
                                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                                    +{item.equipment.length - 1} รายการ
                                  </span>
                                }
                              </div>
                              <Typography variant="small" className="font-normal text-gray-600 text-xs">
                                รวม {item.equipment.reduce((total, eq) => total + (eq.quantity || 1), 0)} ชิ้น
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="small" className="font-normal text-gray-900">{item.equipment?.name || '-'}</Typography>
                          )}
                        </div>
                      </td>
                      <td className="w-28 px-4 py-4 whitespace-nowrap text-gray-900 text-left">{item.borrow_date ? new Date(item.borrow_date).toLocaleDateString('th-TH') : "-"}</td>
                      <td className="w-28 px-4 py-4 whitespace-nowrap text-gray-900 text-left">{item.due_date ? new Date(item.due_date).toLocaleDateString('th-TH') : "-"}</td>
                      <td className="w-32 px-4 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="w-40 px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {item.status !== 'waiting_payment' && (
                            <Tooltip content="คืนครุภัณฑ์" placement="top">
                              <IconButton variant="text" color="green" className="bg-green-50 hover:bg-green-100 shadow-sm transition-all duration-200 p-2" onClick={() => {
                                const status = calculateReturnStatus(item);
                                setReturnStatus(status);
                                setSelectedBorrowedItem(item);
                                setIsReturnFormOpen(true);
                              }}>
                                <CheckCircleSolidIcon className="h-6 w-6" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip content="ดูรายละเอียด" placement="top">
                            <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleViewDetails(item)}>
                              <EyeIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="ลบ" placement="top">
                            <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleDeleteReturn(item.borrow_id)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>)
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
            แสดง {paginatedReturns.length > 0 ? '1' : '0'} ถึง {paginatedReturns.length} จากทั้งหมด {returns.length} รายการ
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case" onClick={() => setPage(page - 1)} disabled={page === 1}>
              ก่อนหน้า
            </Button>
            <Button variant="outlined" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
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
          showNotification={showNotification}
          paymentDetails={selectedReturnItem?.paymentDetails}
          onViewStatus={() => {
            setIsReturnFormOpen(false);
            setIsDetailsOpen(true);
          }}
        />

        {/* Return Details Dialog */}
        <ReturndetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          returnItem={selectedReturnItem}
          paymentDetails={selectedReturnItem?.paymentDetails}
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