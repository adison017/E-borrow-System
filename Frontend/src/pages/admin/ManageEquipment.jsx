import {
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
  "รหัสครุภัณฑ์",
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
  "รออนุมัติซ่อม": {
    color: "amber",
    icon: ClockIcon,
    backgroundColor: "bg-amber-50",
    borderColor: "border-amber-100"
  },
  "ระหว่างซ่อม": {
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
  const [showInspectDialog, setShowInspectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const confirmDelete = () => {
    deleteEquipment(selectedEquipment.id).then(() => getEquipment().then(setEquipmentList));
    setDeleteDialogOpen(false);
    showAlertMessage(`ลบครุภัณฑ์ ${selectedEquipment.name} เรียบร้อยแล้ว`, "success");
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
    addEquipment(data).then(() => getEquipment().then(setEquipmentList));
  };

  // ฟังก์ชั่นสำหรับกรองข้อมูลตามคำค้นหาและสถานะ
  const filteredEquipment = equipmentList
    .filter(
      item =>
        (item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "ทั้งหมด" || item.status === statusFilter)
    )
    .sort((a, b) => {
      // ถ้า a เป็น "ชำรุด" ให้ขึ้นก่อน
      if (a.status === "ชำรุด" && b.status !== "ชำรุด") return -1;
      // ถ้า b เป็น "ชำรุด" ให้ขึ้นก่อน
      if (b.status === "ชำรุด" && a.status !== "ชำรุด") return 1;
      // ถ้าไม่ใช่ทั้งคู่ ให้เรียงตาม id
      return a.id.localeCompare(b.id);
    });

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
    // Update equipment status to 'รออนุมัติซ่อม' ใน database
    const equipmentId = repairData.equipment.code;
    const equipmentToUpdate = equipmentList.find(item => item.id === equipmentId);
    if (equipmentToUpdate) {
      await updateEquipment(equipmentId, { ...equipmentToUpdate, status: 'รออนุมัติซ่อม' });
      getEquipment().then(setEquipmentList);
    }
    setRepairDialogOpen(false);
    setSelectedEquipmentForRepair(null);
  };

  const handleInspectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setShowInspectDialog(true);
  };

  const handleInspectSubmit = (inspectionData) => {
    // Update equipment status to 'พร้อมใช้งาน'
    const updatedEquipment = equipmentList.map(item => {
      if (item.id === inspectionData.equipment.code) {
        return { ...item, status: 'พร้อมใช้งาน' };
      }
      return item;
    });
    setEquipmentList(updatedEquipment);
    setShowInspectDialog(false);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  // นับจำนวนครุภัณฑ์ตามสถานะ
  const countByStatus = equipmentList.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

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


        <CardHeader floated={false} shadow={false} className="rounded-t-2xl bg-white px-8 py-6">
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm7.586 2.586L14.5 7H12V4.5h.086ZM11 10a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 11 10Z" clipRule="evenodd" />
              </svg>
              ส่งออก Excel
            </Button>
            <Menu>
              <MenuHandler>
                <Button variant="outlined" className="border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm rounded-xl flex items-center gap-2 px-4 py-2 text-sm font-medium normal-case">
                  <FunnelIcon className="h-4 w-4" />
                  ตัวกรอง
                  {statusFilter !== "ทั้งหมด" && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-1.5">
                      {statusFilter} ({countByStatus[statusFilter] || 0})
                    </span>
                  )}
                </Button>
              </MenuHandler>
              <MenuList className="min-w-[240px] bg-white text-gray-800 rounded-lg border border-gray-100 p-2">
                <MenuItem
                  className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${statusFilter === "ทั้งหมด" ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                  onClick={() => handleStatusFilter("ทั้งหมด")}
                >
                  <span>ทั้งหมด</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{equipmentList.length}</span>
                </MenuItem>
                {Object.keys(statusConfig).map(statusKey => (
                  <MenuItem
                    key={statusKey}
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors duration-200 ${statusFilter === statusKey ? "bg-blue-50 text-blue-700 font-semibold" : "font-normal"}`}
                    onClick={() => handleStatusFilter(statusKey)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full bg-${statusConfig[statusKey].color}-500`}></span>
                      <span>{statusKey}</span>
                    </div>
                    <span className={`text-xs bg-${statusConfig[statusKey].color}-100 text-${statusConfig[statusKey].color}-700 px-1.5 py-0.5 rounded-full`}>{countByStatus[statusKey] || 0}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((item, index) => {
                    const { pic, id, name, category, quantity, status, created_at } = item;
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="w-16 px-3 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <img
                              className="h-10 w-10 object-contain bg-gray-100 rounded"
                              src={pic || "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"}
                              alt={name}
                              onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"; }}
                            />
                          </div>
                        </td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-md font-bold text-gray-900 text-left truncate">{id}</td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-md text-gray-700text-gray-900 text-left truncate">{name}</td>
                        <td className="w-20 px-3 py-4 whitespace-nowrap text-md text-gray-700 text-left truncate">{category}</td>
                        <td className="w-10 px-3 py-4 whitespace-nowrap text-md text-gray-900 text-right">{quantity}{item.unit ? ` ${item.unit}` : ''}</td>
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
                            {status === 'ระหว่างซ่อม' && (
                              <Tooltip content="ตรวจรับครุภัณฑ์" placement="top">
                                <IconButton variant="text" color="teal" className="bg-teal-50 hover:bg-teal-100 shadow-sm transition-all duration-200 p-2" onClick={() => handleInspectEquipment(item)}>
                                  <CheckCircleIcon className="h-5 w-5" />
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
            แสดง {filteredEquipment.length > 0 ? '1' : '0'} ถึง {filteredEquipment.length} จากทั้งหมด {equipmentList.length} รายการ
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" disabled={true /* Implement pagination logic */} className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case">
              ก่อนหน้า
            </Button>
            <Button variant="outlined" size="sm" disabled={true /* Implement pagination logic */} className="text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium normal-case">
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
            if (dataToSave.pic instanceof File) {
              dataToSave.pic = await uploadImage(dataToSave.pic);
            }
            await updateEquipment(dataToSave.id, dataToSave);
            getEquipment().then(setEquipmentList);
            showAlertMessage(`แก้ไขครุภัณฑ์ ${dataToSave.name} เรียบร้อยแล้ว`, "success");
          }}
        />

        {/* Add Equipment Dialog */}
        <AddEquipmentDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          initialFormData={{
            id: `EQ-${String(equipmentList.length + 1).padStart(3, '0')}`,
            name: "",
            category: "",
            description: "",
            quantity: "",
            status: "พร้อมใช้งาน",
            pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
          }}
          onSave={async (newEquipment) => {
            let dataToSave = { ...newEquipment };
            if (dataToSave.pic instanceof File) {
              dataToSave.pic = await uploadImage(dataToSave.pic);
            }
            await addEquipment(dataToSave);
            getEquipment().then(setEquipmentList);
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

export default ManageEquipment;