import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  WrenchIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PencilIcon,
  XCircleIcon
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
import { useEffect, useState } from "react";
import Notification from "../../components/Notification";
import { addEquipment, deleteEquipment, getEquipment, updateEquipment, uploadImage } from "../../utils/api";
import AddEquipmentDialog from "./dialog/AddEquipmentDialog";
import DeleteEquipmentDialog from "./dialog/DeleteEquipmentDialog";
import EditEquipmentDialog from "./dialog/EditEquipmentDialog";
import InspectRepairedEquipmentDialog from './dialog/InspectRepairedEquipmentDialog';
import RepairRequestDialog from "./dialog/RepairRequestDialog";
// กำหนด theme สีพื้นฐานเป็นสีดำ
const theme = {
  typography: {
    defaultProps: {
      color: "#374151", // Dark Gray for text
      textGradient: false,
    },
  }
};

const TABLE_HEAD = [
  "รูปภาพ",
  "รหัสครุภัณฑ์", // item_code
  "ชื่อครุภัณฑ์",
  "หมวดหมู่",
  "จำนวน",
  "สถานะ",
  "จัดการ"
];

// กำหนดสีและไอคอนตามสถานะ
const statusConfig = {
  "ชำรุด": {
    color: "red",
    icon: XCircleIcon,
    backgroundColor: "bg-red-50",
    borderColor: "border-red-100"
  },
  "กำลังซ่อม": {
    color: "amber",
    icon: ClockIcon,
    backgroundColor: "bg-amber-50",
    borderColor: "border-amber-100"
  },
  "รออนุมัติซ่อม": { // เปลี่ยนจาก 'รอการอนุมัติซ่อม' เป็น 'รออนุมัติซ่อม'
    color: "blue",
    icon: ClockIcon,
    backgroundColor: "bg-blue-50",
    borderColor: "border-blue-100"
  },
  "พร้อมใช้งาน": {
    color: "green",
    icon: CheckCircleIcon,
    backgroundColor: "bg-green-50",
    borderColor: "border-green-100"
  },
  "ถูกยืม": {
    color: "purple",
    icon: ExclamationCircleIcon,
    backgroundColor: "bg-purple-50",
    borderColor: "border-purple-100"
  }
};

function ManageEquipment() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [repairDialogOpen, setRepairDialogOpen] = useState(false);
  const [selectedEquipmentForRepair, setSelectedEquipmentForRepair] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [showInspectDialog, setShowInspectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getEquipment().then(setEquipmentList);
  }, []);

  // ฟังก์ชั่นแสดง Alert
  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // ปิด Alert อัตโนมัติหลังจาก 3 วินาที
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleDeleteClick = (equipment) => {
    setSelectedEquipment(equipment);
    setDeleteDialogOpen(true);
  };

  // ฟังก์ชั่นสำหรับลบ
  const confirmDelete = () => {
    deleteEquipment(selectedEquipment.item_code).then(() => getEquipment().then(setEquipmentList));
    setDeleteDialogOpen(false);
    showAlertMessage(`ลบครุภัณฑ์ ${selectedEquipment.name} เรียบร้อยแล้ว`, "delete");
    setSelectedEquipment(null);
  };

  const handleEditClick = (equipment) => {
    setSelectedEquipment(equipment);
    setEditDialogOpen(true);
  };

  // ฟังก์ชั่นสำหรับเปิด dialog เพิ่มครุภัณฑ์
  const openAddEquipmentDialog = () => {
    setAddDialogOpen(true);
  };

  // ฟังก์ชั่นจัดการการเปลี่ยนแปลงในฟอร์มเพิ่ม
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ฟังก์ชั่นบันทึกครุภัณฑ์ใหม่
  const handleAddEquipment = (data) => {
    let dataToSave = { ...data };
    // ให้แน่ใจว่ามี item_id
    dataToSave.item_id = dataToSave.item_id || dataToSave.id;
    delete dataToSave.id;
    addEquipment(dataToSave).then(() => getEquipment().then(setEquipmentList));
  };

  // ฟังก์ชั่นสำหรับกรอง/ค้นหา/เรียงลำดับ
  const filteredEquipment = equipmentList
    .filter(item => {
      const codeSafe = typeof item.item_code === 'string' ? item.item_code : String(item.item_code ?? "");
      const nameSafe = typeof item.name === 'string' ? item.name : String(item.name ?? "");
      const descSafe = typeof item.description === 'string' ? item.description : String(item.description ?? "");
      return (
        codeSafe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameSafe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descSafe.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (statusFilter === "ทั้งหมด" || item.status === statusFilter) &&
      (categoryFilter === "ทั้งหมด" || item.category === categoryFilter);
    })
    .sort((a, b) => {
      if (a.status === "ชำรุด" && b.status !== "ชำรุด") return -1;
      if (b.status === "ชำรุด" && a.status !== "ชำรุด") return 1;
      // เรียงตาม item_code
      const aCode = typeof a.item_code === 'string' ? a.item_code : String(a.item_code ?? '');
      const bCode = typeof b.item_code === 'string' ? b.item_code : String(b.item_code ?? '');
      return aCode.localeCompare(bCode);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  // สร้าง component แสดงสถานะที่สวยงาม
  const StatusDisplay = ({ status }) => {
    const config = statusConfig[status] || {
      color: "gray",
      icon: ExclamationCircleIcon,
      backgroundColor: "bg-gray-200",
      borderColor: "border-gray-100"
    };

    const StatusIcon = config.icon;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.backgroundColor} ${config.borderColor} border shadow-sm`}>
        <StatusIcon className={`h-4 w-4 text-${config.color}-500`} />
        <span className={`text-${config.color}-700 font-medium text-xs`}>
          {status}
        </span>
      </div>
    );
  };

  const handleRepairRequest = (equipment) => {
    setSelectedEquipmentForRepair(equipment);
    setRepairDialogOpen(true);
  };

  const handleRepairSubmit = async (repairData) => {
    // ใช้ item_code เป็น canonical identifier
    const equipmentCode = repairData.equipment.code || repairData.equipment.item_code || repairData.equipment.id || repairData.equipment.item_id;
    const equipmentToUpdate = equipmentList.find(item => item.item_code === equipmentCode);
    if (equipmentToUpdate) {
      await updateEquipment(equipmentCode, { ...equipmentToUpdate, status: 'รออนุมัติซ่อม' });
      getEquipment().then(setEquipmentList);
    }
    setRepairDialogOpen(false);
    setSelectedEquipmentForRepair(null);
  };

  const handleInspectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setShowInspectDialog(true);
  };

  const handleInspectSubmit = async (inspectionData) => {
    try {
      console.log('Inspection data received:', inspectionData);

      // Update equipment status in the local state
      const updatedEquipment = equipmentList.map(item => {
        if (item.item_id === inspectionData.equipment.item_id) {
          return {
            ...item,
            status: inspectionData.status,
            last_updated: inspectionData.inspectionDate
          };
        }
        return item;
      });

      setEquipmentList(updatedEquipment);
      setShowInspectDialog(false);

      // Show success message
      const statusText = inspectionData.status === 'พร้อมใช้งาน' ? 'พร้อมใช้งาน' : 'ชำรุด';
      showAlertMessage(`อัพเดทสถานะครุภัณฑ์ ${inspectionData.equipment.name} เป็น "${statusText}" เรียบร้อยแล้ว`, "success");
    } catch (error) {
      console.error('Error handling inspection submit:', error);
      showAlertMessage('เกิดข้อผิดพลาดในการอัพเดทสถานะครุภัณฑ์', "error");
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // นับจำนวนครุภัณฑ์ตามสถานะ
  const countByStatus = equipmentList.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  // สร้างรายการหมวดหมู่ที่ไม่ซ้ำ
  const categories = Array.from(new Set(equipmentList.map(item => item.category)));

  return (
    <ThemeProvider value={theme}>
      <Card className="h-full w-full text-gray-800 rounded-2xl shadow-lg">
       {/* Alert Notification */}
       <Notification
          show={showAlert}
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />


        <CardHeader floated={false} shadow={false} className="rounded-2xl bg-white px-8 py-3">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Typography variant="h5" className="text-gray-900 font-semibold tracking-tight">
                รายการครุภัณฑ์
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm text-gray-600">
                จัดการข้อมูลครุภัณฑ์ทั้งหมดในระบบ
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-x-4">
           <div className="w-full md:flex-grow relative">
            <label htmlFor="search" className="sr-only"> {/* Screen reader only label */}
              ค้นหาครุภัณฑ์
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                type="text"
                className="w-full h-10 pl-10 pr-4 py-2.5 border border-gray-300 rounded-2xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
                placeholder="ค้นหารหัส, ชื่อ, หรือรายละเอียด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           </div>
           <div className="flex flex-shrink-0 gap-x-3 w-full md:w-auto justify-start md:justify-end">
            <Button variant="outlined" className="border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm rounded-xl flex items-center gap-2 px-4 py-2 text-sm font-medium normal-case">
              <ArrowDownTrayIcon className="w-4 h-4" />
              ส่งออก Excel
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 justify-center mt-5">
              <Menu>
              <MenuHandler>
                <Button variant="outlined" className="w-80 border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm rounded-xl flex items-center px-4 py-2 text-sm font-medium normal-case justify-between">
                  <span className="flex items-center gap-2">
                    <FunnelIcon className="w-4 h-4" />
                    หมวดหมู่
                    {categoryFilter !== "ทั้งหมด" && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full text-center ml-2">
                        {categoryFilter}
                      </span>
                    )}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </Button>
              </MenuHandler>
              <MenuList className="min-w-[240px] bg-white text-gray-800 rounded-lg border border-gray-100 p-2">
                <MenuItem
                  className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors duration-200 ${categoryFilter === "ทั้งหมด" ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                  onClick={() => setCategoryFilter("ทั้งหมด")}
                >
                  <span>ทั้งหมด</span>
                  <span className=" text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{equipmentList.length}</span>
                </MenuItem>
                {Array.from(new Set(equipmentList.map(item => item.category))).map(cat => (
                  <MenuItem
                    key={cat}
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${categoryFilter === cat ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    <span>{cat}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      {equipmentList.filter(item => item.category === cat).length}
                    </span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuHandler>
                <Button
                  variant="outlined"
                  className={`w-80 border-gray-300 shadow-sm rounded-xl flex items-center px-4 py-2 text-sm font-medium normal-case justify-between transition-colors duration-200
                    ${statusFilter !== 'ทั้งหมด' && statusConfig[statusFilter] ? `${statusConfig[statusFilter].backgroundColor} border ${statusConfig[statusFilter].borderColor} text-${statusConfig[statusFilter].color}-700` : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2">
                    <AdjustmentsHorizontalIcon className="w-4 h-4" />
                    สถานะ
                    {statusFilter !== "ทั้งหมด" && statusConfig[statusFilter] && (
                      <span className={`text-xs px-2 py-1 rounded-full ml-1.5 bg-${statusConfig[statusFilter].color}-500 text-white`}>
                        {statusFilter}
                      </span>
                    )}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </Button>
              </MenuHandler>
              <MenuList className="min-w-[240px] bg-white text-gray-800 rounded-lg border border-gray-100 p-2">
                <MenuItem
                  className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${statusFilter === "ทั้งหมด" ? "bg-gray-100 text-gray-700 font-semibold" : "font-normal"}`}
                  onClick={() => handleStatusFilter("ทั้งหมด")}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                    <span>ทั้งหมด</span>
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{equipmentList.length}</span>
                </MenuItem>
                {Object.keys(statusConfig).map(statusKey => (
                  <MenuItem
                    key={statusKey}
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-${statusConfig[statusKey].backgroundColor.replace('bg-', '')} hover:text-${statusConfig[statusKey].color}-700 transition-colors duration-200 ${statusFilter === statusKey ? `bg-${statusConfig[statusKey].backgroundColor.replace('bg-', '')} text-${statusConfig[statusKey].color}-700 font-semibold` : "font-normal"}`}
                    onClick={() => handleStatusFilter(statusKey)}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full bg-${statusConfig[statusKey].color}-500`}></span>
                      <span>{statusKey}</span>
                    </span>
                    <span className={`text-xs bg-${statusConfig[statusKey].color}-100 text-${statusConfig[statusKey].color}-700 px-1.5 py-0.5 rounded-full`}>{countByStatus[statusKey] || 0}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            </div>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200 rounded-2xl">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>{TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className={`px-3 py-4 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap ${
                      index === 0 ? "w-16 text-center" :
                      index === 1 ? "w-20 text-left" :
                      index === 2 ? "w-20 text-left" :
                      index === 3 ? "w-20 text-left" :
                      index === 4 ? "w-10 text-right" :
                      index === 5 ? "w-20 text-center" :
                      index === 6 ? "w-20 text-center" : ""
                    }`}
                  >
                    {head}
                  </th>
                ))}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEquipment.length > 0 ? (
                  paginatedEquipment.map((item, index) => {
                    const { pic, item_code, name, category, quantity, status, unit } = item;
                    return (
                      <tr key={item_code} className="hover:bg-gray-50">
                        <td className="w-16 px-3 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <img
                              className="h-16 w-20 object-contain rounded"
                              src={pic || "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"}
                              alt={name}
                              onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"; }}
                            />
                          </div>
                        </td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-md font-bold text-gray-900 text-left truncate">{item_code}</td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-md text-gray-700text-gray-900 text-left truncate">{name}</td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-md text-gray-700 text-left truncate">{category}</td>
                        <td className="w-10 px-3 py-4 whitespace-nowrap text-md text-gray-900 text-right">{quantity}{unit ? ` ${unit}` : ''}</td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-center text-gray-700">
                          <span className={`px-3 py-1 inline-flex justify-center leading-5 font-semibold rounded-full border text-sm ${statusConfig[status]?.backgroundColor || "bg-gray-200"} ${statusConfig[status]?.borderColor || "border-gray-200"} text-${statusConfig[status]?.color || "gray"}-800`}>
                            {status}
                          </span>
                        </td>
                        <td className="w-25 px-3 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {status === 'ชำรุด' && (
                              <Tooltip content="แจ้งซ่อม" placement="top">
                                <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleRepairRequest(item)}>
                                  <WrenchIcon className="h-5 w-5" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {status === 'กำลังซ่อม' && (
                              <Tooltip content="ตรวจรับครุภัณฑ์" placement="top">
                                <IconButton variant="text" color="green" className="bg-green-50 hover:bg-green-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleInspectEquipment(item)}>
                                  <CheckCircleIcon className="h-6 w-6" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip content="แก้ไข" placement="top">
                              <IconButton variant="text" color="amber" className="bg-amber-50 hover:bg-amber-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleEditClick(item)}>
                                <PencilIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="ลบ" placement="top">
                              <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleDeleteClick(item)}>
                                <TrashIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={TABLE_HEAD.length} className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center p-5 bg-gray-100 rounded-full mb-5">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                      </div>
                      <Typography variant="h6" className="text-gray-700 font-medium mb-1">
                        ไม่พบข้อมูลครุภัณฑ์
                      </Typography>
                      <Typography color="gray" className="text-sm text-gray-500">
                        ลองปรับคำค้นหาหรือตัวกรองของคุณ
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
            แสดง {filteredEquipment.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredEquipment.length)} จากทั้งหมด {equipmentList.length} รายการ
          </Typography>
          <div className="flex gap-2 items-center">
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case disabled:opacity-50"
            >
              ก่อนหน้า
            </Button>
            <span className="text-sm text-gray-700">{currentPage} / {totalPages}</span>
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case disabled:opacity-50"
            >
              ถัดไป
            </Button>
          </div>
        </CardFooter>

        {/* Delete Confirmation Modal */}
        <DeleteEquipmentDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedEquipment={selectedEquipment}
          onConfirm={confirmDelete}
        />

        {/* Edit Dialog Modal */}
        <EditEquipmentDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          equipmentData={selectedEquipment}
          onSave={async (updatedData) => {
            let dataToSave = { ...updatedData };
            // ใช้ item_code เป็น canonical identifier
            if (dataToSave.pic instanceof File) {
              dataToSave.pic = await uploadImage(dataToSave.pic, dataToSave.item_code);
            }
            await updateEquipment(dataToSave.item_code, dataToSave);
            getEquipment().then(setEquipmentList);
            showAlertMessage(`แก้ไขครุภัณฑ์ ${dataToSave.name} เรียบร้อยแล้ว`, "edit");
          }}
        />

        {/* Add Equipment Dialog */}
        <AddEquipmentDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          initialFormData={{
            item_code: generateNextEquipmentId(equipmentList),
            name: "",
            category: "",
            description: "",
            quantity: "",
            unit: "",
            status: "พร้อมใช้งาน",
            pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
          }}
          onSave={async (newEquipment) => {
            let dataToSave = { ...newEquipment };
            if (dataToSave.pic instanceof File) {
              dataToSave.pic = await uploadImage(dataToSave.pic, dataToSave.item_code);
            }
            await addEquipment(dataToSave);
            getEquipment().then(setEquipmentList);
            showAlertMessage(`เพิ่มครุภัณฑ์ ${dataToSave.name} เรียบร้อยแล้ว`, "success");
          }}
        />

        {/* Repair Request Dialog */}
        <RepairRequestDialog
          open={repairDialogOpen}
          onClose={() => {
            setRepairDialogOpen(false);
            setSelectedEquipmentForRepair(null);
          }}
          equipment={selectedEquipmentForRepair}
          onSubmit={handleRepairSubmit}
        />

        {/* Equipment Inspection Dialog */}
        <InspectRepairedEquipmentDialog
          open={showInspectDialog}
          onClose={() => setShowInspectDialog(false)}
          equipment={selectedEquipment}
          onSubmit={handleInspectSubmit}
        />
      </Card>
      {/* Floating Add Equipment Button */}
      <Tooltip content="เพิ่มครุภัณฑ์" placement="left">
        <button
          onClick={openAddEquipmentDialog}
          className="fixed bottom-8 right-8 z-[60] border-black bg-black/70 hover:bg-white hover:border-2 hover:border-black hover:text-black text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="เพิ่มครุภัณฑ์"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
          </svg>
        </button>
      </Tooltip>
    </ThemeProvider>
  );
}

// ฟังก์ชันหา id ใหม่ที่ไม่ซ้ำ
function generateNextEquipmentId(equipmentList) {
  // ดึงเลขลำดับจาก item_code ที่เป็นรูปแบบ EQ-xxx
  const usedNumbers = equipmentList
    .map(item => {

      const match = String(item.id || item.item_id || '').match(/^EQ-(\d{3})$/);


      return match ? parseInt(match[1], 10) : null;
    })
    .filter(num => num !== null)
    .sort((a, b) => a - b);
  // หาเลขที่ว่าง (gap) ที่เล็กที่สุด
  let nextNumber = 1;
  for (let i = 0; i < usedNumbers.length; i++) {
    if (usedNumbers[i] !== i + 1) {
      nextNumber = i + 1;
      break;
    }
    nextNumber = usedNumbers.length + 1;
  }
  return `EQ-${String(nextNumber).padStart(3, '0')}`;
}

export default ManageEquipment;