import {
  EyeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

// Components
import Notification from "../../components/Notification";
import ReturnDetailsDialog from "./dialog/ReturndetailsDialog";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  ThemeProvider,
  Tooltip,
  Typography
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "รหัสการยืม",
  "ผู้ยืม",
  "ครุภัณฑ์",
  "วันที่ยืม",
  "วันที่คืน",
  "สถานะ",
  "จัดการ"
];

const initialBorrows = [
  {
    borrow_id: 1,
    borrow_code: "BR-001",
    borrower: {
      name: "John Doe",
      department: "แผนกไอที",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    equipment: {
      name: "Laptop Dell XPS 13",
      code: "EQ-1001",
      image: "/lo.png"
    },
    borrow_date: "2024-03-01",
    due_date: "2024-03-15",
    return_date: "2024-03-15",
    status: "completed",
    purpose: "ใช้งานประจำวัน",
    notes: "",
    request_date: "2024-02-28"
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
      name: "Projector Epson",
      code: "EQ-2001",
      image: "/lo.png"
    },
    borrow_date: "2024-03-05",
    due_date: "2024-03-20",
    return_date: "2024-03-20",
    status: "completed",
    purpose: "นำเสนองาน",
    notes: "",
    request_date: "2024-03-01"
  },
  {
    borrow_id: 3,
    borrow_code: "BR-003",
    borrower: {
      name: "Alex Brown",
      department: "แผนกการตลาด",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    equipment: {
      name: "Camera Canon EOS",
      code: "EQ-3001",
      image: "/lo.png"
    },
    borrow_date: "2024-03-10",
    due_date: "2024-03-25",
    return_date: "2024-03-25",
    status: "completed",
    purpose: "ถ่ายภาพงานอีเวนท์",
    notes: "",
    request_date: "2024-03-05"
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

const statusConfig = {
  completed: {
    label: "เสร็จสิ้น",
    color: "green",
    icon: CheckCircleSolidIcon,
    backgroundColor: "bg-green-50",
    borderColor: "border-green-100"
  }
};

function Success() {
  const [borrows, setBorrows] = useState(initialBorrows);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (borrow) => {
    // Transform borrow data to match ReturnDetailsDialog format
    const returnItem = {
      return_code: borrow.borrow_code,
      borrow_code: borrow.borrow_code,
      equipment: borrow.equipment,
      borrower: borrow.borrower,
      borrow_date: borrow.borrow_date,
      due_date: borrow.due_date,
      return_date: borrow.return_date,
      status: "completed",
      condition: "good",
      fine_amount: 0
    };
    setSelectedBorrow(returnItem);
    setIsDetailsOpen(true);
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
      case "completed":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-green-700 text-xs font-semibold">
            <CheckCircleSolidIcon className="w-4 h-4" /> เสร็จสิ้น
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

  // Compute filtered borrows
  const filteredBorrows = borrows
    .filter(borrow => {
      const matchesSearch =
        borrow.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.borrower.department.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
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
                รายการการเสร็จสิ้น
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm text-gray-600">
                ดูรายการการยืม-คืนที่เสร็จสิ้นแล้ว
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
                {filteredBorrows.length > 0 ? (
                  filteredBorrows.map((borrow, index) => (
                    <tr key={borrow.borrow_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{borrow.borrow_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar src={borrow.borrower.avatar} alt={borrow.borrower.name} size="md" className="rounded-full" />
                          <div>
                            <Typography variant="small" className="font-semibold text-gray-900">
                              {borrow.borrower.name}
                            </Typography>
                            <Typography variant="small" className="font-normal text-gray-600 text-xs">
                              {borrow.borrower.department}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar src={borrow.equipment.image} alt={borrow.equipment.name} size="md" className="rounded-full" />
                          <div>
                            <Typography variant="small" className="font-semibold text-gray-900">
                              {borrow.equipment.name}
                            </Typography>
                            <Typography variant="small" className="font-normal text-gray-600 text-xs">
                              {borrow.equipment.code}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{borrow.borrow_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{borrow.return_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex justify-center leading-5 font-semibold rounded-full border text-xs ${statusConfig[borrow.status]?.backgroundColor || "bg-gray-200"} ${statusConfig[borrow.status]?.borderColor || "border-gray-200"} text-${statusConfig[borrow.status]?.color || "gray"}-800`}>
                          {statusConfig[borrow.status]?.label || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Tooltip content="ดูรายละเอียด" placement="top">
                          <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleViewDetails(borrow)}>
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
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
            แสดง {filteredBorrows.length > 0 ? '1' : '0'} ถึง {filteredBorrows.length} จากทั้งหมด {borrows.length} รายการ
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
        {/* Return Details Dialog */}
        {selectedBorrow && (
          <ReturnDetailsDialog
            returnItem={selectedBorrow}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
        )}
      </Card>
    </ThemeProvider>
  );
}

export default Success;