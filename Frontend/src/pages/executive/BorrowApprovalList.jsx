import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ArrowPathIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";
import BorrowDetailsDialog from "./ExBorDetailsDialog";
import Notification from "../../components/Notification";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  Tooltip,
  ThemeProvider,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input
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

const theme = {
  typography: {
    defaultProps: {
      color: "black",
      textGradient: false,
    },
  }
};

const BorrowApprovalList = () => {
  const [borrows, setBorrows] = useState([
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
      status: "pending_approval",
      purpose: "ใช้งานนอกสถานที่",
      notes: "",
      request_date: "2023-09-28",
      reviewed_by: "Admin Name"
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
      status: "pending_approval",
      purpose: "พิมพ์เอกสารสำคัญ",
      notes: "",
      request_date: "2023-10-01",
      reviewed_by: "Admin Name"
    }
  ]);

  const [filteredBorrows, setFilteredBorrows] = useState(borrows);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBorrowId, setSelectedBorrowId] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBorrows(borrows);
    } else {
      const filtered = borrows.filter(item =>
        item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleApprove = async (borrowId) => {
    const updatedBorrows = borrows.map(item =>
      item.borrow_id === borrowId
        ? { ...item, status: "approved" }
        : item
    );
    setBorrows(updatedBorrows);
    showNotification("อนุมัติการยืมเรียบร้อยแล้ว", "success");
  };

  const handleOpenRejectDialog = (borrowId) => {
    setSelectedBorrowId(borrowId);
    setIsRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setIsRejectDialogOpen(false);
    setRejectReason("");
  };

  const handleReject = async (borrowId, reason) => {
    if (!reason.trim()) {
      showNotification("กรุณากรอกเหตุผลในการปฏิเสธ", "error");
      return;
    }

    const updatedBorrows = borrows.map(item =>
      item.borrow_id === borrowId
        ? { ...item, status: "rejected", notes: reason }
        : item
    );
    setBorrows(updatedBorrows);
    showNotification(`ปฏิเสธการยืมเรียบร้อยแล้ว - เหตุผล: ${reason}`, "error");
    handleCloseRejectDialog();
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
            <CheckCircleSolidIcon className="w-4 h-4" /> อนุมัติแล้ว
          </div>
        );
      case "pending_approval":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-blue-700 text-xs font-semibold">
            <ClockIcon className="w-4 h-4" /> รออนุมัติ
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-red-700 text-xs font-semibold">
            <XCircleIcon className="w-4 h-4" /> ถูกปฏิเสธ
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
            <div>
              <Typography variant="h5" color="blue-gray">
                รายการรออนุมัติการยืม
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                คำขอยืมที่ส่งมาจากผู้ดูแลระบบ รอการอนุมัติจากผู้บริหาร
              </Typography>
            </div>

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
                    <tr key={item.borrow_id} className="hover:bg-gray-50">
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
                        <div className="flex gap-2">
                          <Tooltip content="ดูรายละเอียด">
                            <button
                              className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                              onClick={() => handleViewDetails(item)}
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span>ดู</span>
                            </button>
                          </Tooltip>

                          {item.status === "pending_approval" && (
                            <>
                              <Tooltip content="อนุมัติ">
                                <button
                                  className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                                  onClick={() => handleApprove(item.borrow_id)}
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  <span>อนุมัติ</span>
                                </button>
                              </Tooltip>
                              <Tooltip content="ปฏิเสธ">
                                <button
                                  className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                                  onClick={() => handleOpenRejectDialog(item.borrow_id)}
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                  <span>ปฏิเสธ</span>
                                </button>
                              </Tooltip>
                            </>
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
                      ไม่พบรายการรออนุมัติ
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
        </CardFooter>
      </Card>

      {/* Borrow Details Dialog */}
      <BorrowDetailsDialog
        borrow={selectedBorrow}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onApprove={() => selectedBorrow && handleApprove(selectedBorrow.borrow_id)}
        onReject={(reason) => selectedBorrow && handleReject(selectedBorrow.borrow_id, reason)}
        isApprovalView={true}
      />

      {/* Reject Reason Dialog */}
      {/* DaisyUI Modal */}
        <input type="checkbox" id="reject-modal" className="modal-toggle" checked={isRejectDialogOpen} readOnly />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg ">กรอกเหตุผลในการปฏิเสธ</h3>
            <div className="py-4">
              <input
                type="text"
                placeholder="เหตุผลในการปฏิเสธ"
                className="input input-bordered w-full bg-white"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              />
            </div>
            <div className="modal-action">
              <label
                htmlFor="reject-modal"
                className="btn"
                onClick={handleCloseRejectDialog}
              >
                ยกเลิก
              </label>
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  handleReject(selectedBorrowId, rejectReason);
                  handleCloseRejectDialog();
                }}
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>

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

export default BorrowApprovalList;