import {
    EyeIcon,
    MagnifyingGlassIcon,
    QrCodeIcon,
    TrashIcon,
    DocumentTextIcon,
    CheckIcon
  } from "@heroicons/react/24/outline";
  import { useEffect, useState } from "react";

  import {
    CheckCircleIcon as CheckCircleSolidIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    XCircleIcon
  } from "@heroicons/react/24/solid";

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
  import ConfirmDialog from "../../components/ConfirmDialog";
  import Notification from "../../components/Notification";
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

  const ReceiveItem = () => {
    const [pendingDeliveries, setPendingDeliveries] = useState(initialPendingDeliveries);
    const [completedDeliveries, setCompletedDeliveries] = useState(initialCompletedDeliveries);
    const [allDeliveries, setAllDeliveries] = useState([...initialPendingDeliveries, ...initialCompletedDeliveries]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([...initialPendingDeliveries, ...initialCompletedDeliveries]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("pending"); // "pending" หรือ "completed"

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
      if (activeTab === "pending") {
        setFilteredDeliveries(pendingDeliveries);
      } else {
        setFilteredDeliveries(completedDeliveries);
      }
    }, [pendingDeliveries, completedDeliveries, activeTab]);

    useEffect(() => {
      // กรองตามคำค้นหา
      if (searchTerm.trim() === "") {
        if (activeTab === "pending") {
          setFilteredDeliveries(pendingDeliveries);
        } else {
          setFilteredDeliveries(completedDeliveries);
        }
      } else {
        const toFilter = activeTab === "pending" ? pendingDeliveries : completedDeliveries;
        const filtered = toFilter.filter(item =>
          item.borrow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.equipment.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDeliveries(filtered);
      }
    }, [searchTerm, activeTab, pendingDeliveries, completedDeliveries]);

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

    const getStatusBadge = (status) => {
      switch (status) {
        case "delivered":
          return (
            <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-green-700 text-xs font-semibold">
              <CheckCircleSolidIcon className="w-4 h-4" /> ส่งมอบแล้ว
            </div>
          );
        case "pending_delivery":
          return (
            <div className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 text-xs font-semibold">
              <ClockIcon className="w-4 h-4" /> รอส่งมอบ
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
                  รายการส่งมอบครุภัณฑ์
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  จัดการและติดตามการส่งมอบครุภัณฑ์ให้กับผู้ใช้งาน
                </Typography>
              </div>

              {/* แท็บเลือกประเภทรายการ */}
              <div className="flex border-b border-blue-gray-200">
                <button
                  className={`px-4 py-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === "pending"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  รอส่งมอบ ({pendingDeliveries.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === "completed"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  ส่งมอบแล้ว ({completedDeliveries.length})
                </button>
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
                  <QrCodeIcon strokeWidth={2} className="h-4 w-4" /> สแกนเพื่อส่งมอบ
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
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((item, index) => {
                    const isLast = index === filteredDeliveries.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={item.borrow_id} className="hover:bg-gray-200">
                        <td className={classes}>
                          <Typography variant="small" className="font-bold text-black">
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
                            {item.purpose}
                          </Typography>
                        </td>
                        <td className={classes}>
                          {getStatusBadge(item.status)}
                        </td>
                        <td className={classes}>
                          <div className="flex gap-1">
                            <Tooltip content="ดูรายละเอียด">
                              <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100" onClick={() => handleViewDetails(item)}>
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>

                            {item.status === "pending_delivery" && (
                              <Tooltip content="ยกเลิกการยืม">
                                <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100" onClick={() => handleCancelBorrow(item.borrow_id)}>
                                  <TrashIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* {item.status === "delivered" && (
                              <Tooltip content="พิมพ์ใบส่งมอบ">
                                <IconButton variant="text" color="green" className="bg-green-50 hover:bg-green-100">
                                  <DocumentTextIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )} */}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center">
                      <Typography className="font-normal text-black">
                        ไม่พบรายการที่ตรงกับการค้นหา
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
              แสดง {filteredDeliveries.length} จาก {activeTab === "pending" ? pendingDeliveries.length : completedDeliveries.length} รายการ
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

  export default ReceiveItem;