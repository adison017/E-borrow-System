import {
  EyeIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

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
  ThemeProvider,
  Tooltip,
  Typography
} from "@material-tailwind/react";


// Import components
import ScannerDialog from "../../components/ScannerDialog";
import ReturnFormDialog from "./dialog/ReturnFormDialog";
import ReturndetailsDialog from "./dialog/ReturndetailsDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Notification";


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

const ReturnList = () => {
  const [returns, setReturns] = useState(initialReturns);
  const [borrowedItems, setBorrowedItems] = useState(initialBorrowedItems);
  const [filteredReturns, setFilteredReturns] = useState(initialReturns);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (searchTerm.trim() === "") {
      setFilteredReturns(returns);
    } else {
      const filtered = returns.filter(item =>
        item.return_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReturns(filtered);
    }
  }, [searchTerm, returns]);

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



  return (
    <ThemeProvider value={theme}>
      <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
  <div className="flex flex-col gap-4">
    {/* ส่วนหัวเรื่อง */}
    <div>
      <Typography variant="h5" color="blue-gray">
        รายการคืนครุภัณฑ์
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        จัดการและติดตามการคืนครุภัณฑ์ทั้งหมดภายในระบบ
      </Typography>
    </div>

    {/* ช่องค้นหาและปุ่มสแกน */}
    <div className="flex flex-col md:flex-row md:items-center gap-2">
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
  {filteredReturns.length > 0 ? (
    filteredReturns.map((item, index) => {
      const isLast = index === filteredReturns.length - 1;
      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

      return (
        <tr key={item.return_id} className="hover:bg-gray-200">
          <td className={classes}>
            <Typography variant="small" className="font-bold text-black">
              {item.return_code}
            </Typography>
          </td>
          <td className={classes}>
            <Typography variant="small" className="font-semibold text-black">
              {item.borrow_code}
            </Typography>
          </td>
          <td className={classes}>
            <Typography variant="small" className="font-semibold text-black">
              {item.borrower.name}
            </Typography>
            <Typography variant="small" className="font-normal text-black opacity-70">
              {item.borrower.department}
            </Typography>
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
            <Typography variant="small" className="font-normal text-black">
              {item.return_date || "-"}
            </Typography>
          </td>
          <td className={classes}>
            {getStatusBadge(item.status)}
          </td>
          <td className={classes}>
            <Typography variant="small" className="font-normal text-black">
              {item.fine_amount > 0 ? `${item.fine_amount} บาท` : "-"}
            </Typography>
          </td>
          <td className={classes}>
            <div className="flex gap-1">
              <Tooltip content="ดูรายละเอียด">
                <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100" onClick={() => handleViewDetails(item)}>
                  <EyeIcon className="h-4 w-4" />
                </IconButton>
              </Tooltip>
              <Tooltip content="ลบ">
                <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100" onClick={() => handleDeleteReturn(item.return_id)}>
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={10} className="p-4 text-center">
        <Typography className="font-normal text-black">
          ไม่พบรายการคืนที่ตรงกับการค้นหา
        </Typography>
      </td>
    </tr>
  )}
</tbody>

          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            แสดง {filteredReturns.length} จาก {returns.length} รายการ
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

export default ReturnList;