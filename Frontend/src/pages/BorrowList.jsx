import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";

// Components
import BorrowDetailsDialog from "../components/BorrowDetailsDialog";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
import CheckDataDialog from "../components/CheckDataDialog"; // New component

import { 
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  ThemeProvider,
  Badge
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "รหัสการยืม",
  "ผู้ยืม",
  "ครุภัณฑ์",
  "วันที่ยืม",
  "กำหนดคืน",
  "สถานะ",
  "จัดการ"
];

const initialBorrows = [
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
    return_date: null,
    status: "approved", // อนุมัติ/กำลังยืม
    purpose: "ใช้งานนอกสถานที่",
    notes: "",
    request_date: "2023-09-28"
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
    return_date: null,
    status: "pending_approval", // รออนุมัติ
    purpose: "พิมพ์เอกสารสำคัญ",
    notes: "",
    request_date: "2023-10-01"
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
    return_date: null,
    status: "under_review", // รอตรวจสอบ (เปลี่ยนจาก "ตรวจสอบข้อมูล" เป็น "รอตรวจสอบ")
    purpose: "ถ่ายภาพงานอีเวนท์",
    notes: "",
    request_date: "2023-10-05"
  }
];

// กำหนด theme สีพื้นฐานเป็นสีดำ
const theme = {
  typography: {
    defaultProps: {
      color: "black",
      textGradient: false,
    },
  }
};

const BorrowList = () => {
  const [borrows, setBorrows] = useState(initialBorrows);
  const [filteredBorrows, setFilteredBorrows] = useState(initialBorrows);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCheckDataOpen, setIsCheckDataOpen] = useState(false); // New state for check data dialog
  
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
    if (searchTerm.trim() === "") {
      setFilteredBorrows(borrows);
    } else {
      const filtered = borrows.filter(item => 
        item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBorrows(filtered);
    }
  }, [searchTerm, borrows]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (borrow) => {
    setSelectedBorrow(borrow);
    setIsDetailsOpen(true);
  };

  const handleCheckData = (borrow) => {
    setSelectedBorrow(borrow);
    setIsCheckDataOpen(true);
  };

  const handleReviewRequest = (borrowId) => {
    setSelectedBorrowId(borrowId);
    setIsConfirmOpen(true);
  };

  const confirmReview = () => {
    const updatedBorrows = borrows.map(item => 
      item.borrow_id === selectedBorrowId 
        ? { ...item, status: "pending_approval" } 
        : item
    );
    setBorrows(updatedBorrows);
    setIsConfirmOpen(false);
    showNotification("ส่งคำขอยืมไปยังผู้บริหารเพื่ออนุมัติเรียบร้อยแล้ว", "success");
  };


  const handleApproveDetails = () => {
    if (selectedBorrow) {
      const updatedBorrows = borrows.map(item => 
        item.borrow_id === selectedBorrow.borrow_id 
          ? { ...item, status: "pending_approval" } 
          : item
      );
      setBorrows(updatedBorrows);
      showNotification("ส่งคำขอยืมไปยังผู้บริหารเพื่ออนุมัติเรียบร้อยแล้ว", "success");
      return Promise.resolve(); // Return a promise for the async operation
    }
    return Promise.reject();
  };

  const handleApprove = () => {
    if (selectedBorrow) {
      const updatedBorrows = borrows.map(item => 
        item.borrow_id === selectedBorrow.borrow_id 
          ? { ...item, status: "pending_approval" } 
          : item
      );
      setBorrows(updatedBorrows);
      setIsCheckDataOpen(false);
      showNotification("ส่งคำขอยืมไปยังผู้บริหารเพื่ออนุมัติเรียบร้อยแล้ว", "success");
    }
  };

  const handleReject = (reason) => {
    if (selectedBorrow) {
      const updatedBorrows = borrows.map(item => 
        item.borrow_id === selectedBorrow.borrow_id 
          ? { 
              ...item, 
              status: "rejected",
              notes: reason // บันทึกเหตุผลที่ปฏิเสธ
            } 
          : item
      );
      setBorrows(updatedBorrows);
      showNotification(`ไม่อนุมัติคำขอยืมเรียบร้อยแล้ว - เหตุผล: ${reason}`, "error");
    }
  };

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-green-700 text-xs font-semibold">
            <CheckCircleSolidIcon className="w-4 h-4" /> อนุมัติ/กำลังยืม
          </div>
        );
      case "pending_approval":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-blue-700 text-xs font-semibold">
            <ClockIcon className="w-4 h-4" /> รออนุมัติ
          </div>
        );
      case "under_review":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 text-xs font-semibold">
            <ArrowPathIcon className="w-4 h-4" /> รอตรวจสอบ
          </div>
        );
      case "rejected":
          return (
            <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-red-700 text-sm font-semibold">
              <XCircleIcon className="w-4 h-4" /> ไม่ผ่านการตรวจสอบ
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

  return (
    <ThemeProvider value={theme}>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex flex-col gap-4">
            {/* ส่วนหัวเรื่อง */}
            <div>
              <Typography variant="h5" color="blue-gray">
                รายการยืมครุภัณฑ์
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                จัดการและติดตามการยืมครุภัณฑ์ทั้งหมดภายในระบบ
              </Typography>
            </div>

            {/* ช่องค้นหา */}
            <div className="w-full md:w-72">
              <div className="relative flex w-full">
                <input
                  type="text"
                  className="peer w-full rounded-lg border border-gray-300 border-t-gray-300 bg-transparent px-3 py-2 pl-10 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all focus:border-blue-500 focus:outline-0 disabled:border-0"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.length > 0 ? (
                filteredBorrows.map((item, index) => {
                  const isLast = index === filteredBorrows.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={item.borrow_id} className="hover:bg-gray-200">
                      <td className={classes}>
                        <Typography variant="small" className="font-bold text-black">
                          {item.borrow_code}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar 
                            src={item.borrower.avatar} 
                            alt={item.borrower.name} 
                            size="sm" 
                          />
                          <div>
                            <Typography variant="small" className="font-semibold text-black">
                              {item.borrower.name}
                            </Typography>
                            <Typography variant="small" className="font-normal text-black opacity-70">
                              {item.borrower.department}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-semibold text-black">
                          {item.equipment.name}
                        </Typography>
                        <Typography variant="small" className="font-normal text-black opacity-70">
                          {item.equipment.code}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {item.borrow_date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {item.due_date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        {getStatusBadge(item.status)}
                      </td>
                      <td className={classes}>
                        <div className="flex gap-1">
                          {/* <Tooltip content="ตรวจสอบข้อมูล">
                            <IconButton 
                              variant="text" 
                              color="blue" 
                              className="bg-blue-50 hover:bg-blue-100" 
                              onClick={() => handleViewDetails(item)}
                            >
                             <CheckCircleIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip> */}
                          
                          {item.status === "under_review" && (
                            <Tooltip content="ตรวจสอบข้อมูล">
                              <button 
                                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition duration-200 ease-in-out"
                                onClick={() => handleViewDetails(item)}
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                                <span>ตรวจสอบข้อมูล</span>
                              </button>
                            </Tooltip>
                          )}


                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    <Typography className="font-normal text-black">
                      ไม่พบรายการยืมที่ตรงกับการค้นหา
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            แสดง {filteredBorrows.length} จาก {borrows.length} รายการ
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              ก่อนหน้า
            </Button>
            <Button variant="outlined" size="sm">
              ถัดไป
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Borrow Details Dialog */}
      <BorrowDetailsDialog 
        borrow={selectedBorrow} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)}
        onApprove={handleApproveDetails}
        onReject={handleReject}
      />

      Check Data Dialog
      {selectedBorrow && (
        <CheckDataDialog
          borrow={selectedBorrow}
          isOpen={isCheckDataOpen}
          onClose={() => setIsCheckDataOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Confirm Review Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmReview}
        title="ยืนยันการอนุมัติ"
        message="คุณแน่ใจหรือไม่ว่าต้องการส่งคำขอยืมไปยังผู้บริหารเพื่ออนุมัติ?"
      />

      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </ThemeProvider>
  );
};

export default BorrowList;