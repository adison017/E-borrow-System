import { useState } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
} from "@heroicons/react/24/solid";

// Components
import Notification from "../../components/Notification";
import ReturnDetailsDialog from "./dialog/ReturndetailsDialog";

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
      <Card className="h-full w-full text-black">
        {/* Alert Notification */}
        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />

        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                รายการการเสร็จสิ้น
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                ดูรายการการยืม-คืนที่เสร็จสิ้นแล้ว
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
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
              {filteredBorrows.map(
                (borrow, index) => {
                  const isLast = index === filteredBorrows.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={borrow.borrow_id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {borrow.borrow_code}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={borrow.borrower.avatar} alt={borrow.borrower.name} size="sm" />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {borrow.borrower.name}
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                              {borrow.borrower.department}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={borrow.equipment.image} alt={borrow.equipment.name} size="sm" />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {borrow.equipment.name}
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                              {borrow.equipment.code}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {borrow.borrow_date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {borrow.return_date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        {getStatusBadge(borrow.status)}
                      </td>
                      <td className={classes}>
                        <Tooltip content="ดูรายละเอียด">
                        <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100" onClick={() => handleViewDetails(borrow)}>
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            หน้า 1 จาก 1
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

      {/* Return Details Dialog */}
      {selectedBorrow && (
        <ReturnDetailsDialog
          returnItem={selectedBorrow}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </ThemeProvider>
  );
}

export default Success;