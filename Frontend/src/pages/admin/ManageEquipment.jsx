import { useState, useEffect } from "react"; // เพิ่ม useEffect
import {
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  ThemeProvider,
} from "@material-tailwind/react";
import DeleteEquipmentDialog from "./dialog/DeleteEquipmentDialog";
import EditEquipmentDialog from "./dialog/EditEquipmentDialog";
import AddEquipmentDialog from "./dialog/AddEquipmentDialog";
import Notification from "../../components/Notification";
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
  "รหัสครุภัณฑ์",
  "ชื่อครุภัณฑ์",
  "รูปภาพ",
  "รายละเอียด",
  "จำนวน",
  "สถานะ",
  "วันที่เพิ่ม",
  "จัดการ"
];

const initialEquipment = [
  {
    id: "EQ-001",
    name: "กล้อง Sony",
    description: "กล้อง 1000 px",
    quantity: "10 ชิ้น",
    status: "พร้อมใช้งาน",
    created_at: "2023-10-01 10:00:00",
    pic: "https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
  },
  {
    id: "EQ-002",
    name: "ไมโครโฟน",
    description: "ไมโครโฟนเสียงคมชัด",
    quantity: "5 ชิ้น",
    status: "อยู่ระหว่างซ่อม",
    created_at: "2023-09-25 14:30:00",
    pic: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
  },
  {
    id: "EQ-003",
    name: "จอมอนิเตอร์",
    description: "จอ LED 32 นิ้ว",
    quantity: "2 ชิ้น",
    status: "ชำรุด",
    created_at: "2023-09-15 09:20:00",
    pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
  },
  {
    id: "EQ-004",
    name: "เครื่องพิมพ์ HP",
    description: "เครื่องพิมพ์อิงค์เจ็ท",
    quantity: "3 ชิ้น",
    status: "ถูกยืม",
    created_at: "2023-09-10 13:45:00",
    pic: "https://cdn-icons-png.flaticon.com/512/6134/6134781.png"
  }
];

// กำหนดสีและไอคอนตามสถานะ
const statusConfig = {
  "พร้อมใช้งาน": {
    color: "green",
    icon: CheckCircleIcon,
    backgroundColor: "bg-green-50",
    borderColor: "border-green-100"
  },
  "อยู่ระหว่างซ่อม": {
    color: "amber",
    icon: ClockIcon,
    backgroundColor: "bg-amber-50",
    borderColor: "border-amber-100"
  },
  "ชำรุด": {
    color: "red",
    icon: XCircleIcon,
    backgroundColor: "bg-red-50",
    borderColor: "border-red-100"
  },
  "ถูกยืม": {
    color: "blue",
    icon: ExclamationCircleIcon,
    backgroundColor: "bg-blue-50",
    borderColor: "border-blue-100"
  }
};

function ManageEquipment() {
  const [equipmentList, setEquipmentList] = useState(initialEquipment);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    status: "พร้อมใช้งาน",
    pic: ""
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // เพิ่ม state สำหรับฟอร์มเพิ่มครุภัณฑ์ใหม่
  const [addFormData, setAddFormData] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    status: "พร้อมใช้งาน",
    pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png" // รูปเริ่มต้น
  });

  // เพิ่มสถานะสำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState("");

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
    setEquipmentList(equipmentList.filter(item => item.id !== selectedEquipment.id));
    setDeleteDialogOpen(false);
    setSelectedEquipment(null);
    showAlertMessage(`ลบครุภัณฑ์ ${selectedEquipment.name} เรียบร้อยแล้ว`, "success");
  };

  const handleEditClick = (equipment) => {
    setSelectedEquipment(equipment);
    setEditFormData({
      id: equipment.id,
      name: equipment.name,
      description: equipment.description,
      quantity: equipment.quantity,
      status: equipment.status,
      pic: equipment.pic
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = () => {
    setEquipmentList(equipmentList.map(item =>
      item.id === editFormData.id ? editFormData : item
    ));
    setEditDialogOpen(false);
    showAlertMessage(`แก้ไขครุภัณฑ์ ${editFormData.name} เรียบร้อยแล้ว`, "success");
  };

  // ฟังก์ชั่นสำหรับเปิด dialog เพิ่มครุภัณฑ์
  const handleAddClick = () => {
    // สร้าง ID ใหม่
    const newId = `EQ-${String(equipmentList.length + 1).padStart(3, '0')}`;
    setAddFormData({
      id: newId,
      name: "",
      description: "",
      quantity: "",
      status: "พร้อมใช้งาน",
      pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png" // รูปเริ่มต้น
    });
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
  const saveNewEquipment = () => {
    // สร้างวันที่ปัจจุบัน
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // เพิ่มครุภัณฑ์ใหม่เข้าไปในรายการ
    const newEquipment = {
      ...addFormData,
      created_at: formattedDate
    };

    setEquipmentList([...equipmentList, newEquipment]);
    setAddDialogOpen(false);
    showAlertMessage(`เพิ่มครุภัณฑ์ ${addFormData.name} เรียบร้อยแล้ว`, "success");
  };

  // ฟังก์ชั่นสำหรับกรองข้อมูลตามคำค้นหา
  const filteredEquipment = equipmentList.filter(
    item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.backgroundColor} ${config.borderColor} border`}>
        <StatusIcon className={`h-4 w-4 text-${config.color}-500`} />
        <span className={`text-${config.color}-700 font-medium text-sm`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <ThemeProvider value={theme}>
      <Card className="h-full w-full text-black">
       {/* Alert Notification */}
       <Notification
          show={showAlert}
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />


        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Typography variant="h5" className="text-black">
                รายการครุภัณฑ์
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-black opacity-70">
                จัดการข้อมูลครุภัณฑ์ทั้งหมด
              </Typography>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
              onClick={handleAddClick}
            >
              + เพิ่มครุภัณฑ์
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="w-full md:w-72 relative">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              ค้นหาครุภัณฑ์
            </label>
            <div className="relative ">
              <input
                id="search"
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ค้นหาครุภัณฑ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
           </div>
           <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            <button className="px-4 py-2 text-sm border border-black text-black rounded-md hover:bg-gray-100 transition-colors">
              ส่งออก Excel
            </button>
            <button className="px-4 py-2 text-sm border border-black text-black rounded-md hover:bg-gray-100 transition-colors">
              ตัวกรอง
            </button>
          </div>
        </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
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
                      className="font-normal leading-none text-black opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map(({ id, name, description, quantity, status, created_at, pic }, index) => {
                  const isLast = index === filteredEquipment.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id} className="hover:bg-gray-200">
                      <td className={classes}>
                        <Typography variant="small" className="font-bold text-black">
                          {id}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-semibold text-black">
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center justify-center">
                          <Avatar
                            src={pic}
                            alt={name}
                            size="md"
                            className="h-12 w-12 border border-blue-gray-50 shadow-sm object-contain p-1 bg-white"
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-medium text-black">
                          {quantity}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <StatusDisplay status={status} />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {created_at}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex gap-1">
                          <Tooltip content="ดูรายละเอียด">
                            <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100">
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="แก้ไข">
                            <IconButton variant="text" color="amber" className="bg-amber-50 hover:bg-amber-100" onClick={() => handleEditClick({ id, name, description, quantity, status, pic })}>
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="ลบ">
                            <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100" onClick={() => handleDeleteClick({ id, name })}>
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
                  <td colSpan={8} className="p-4 text-center">
                    <Typography className="font-normal text-black">
                      ไม่พบข้อมูลครุภัณฑ์
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" className="font-normal text-black mb-3 sm:mb-0">
            แสดง 1 ถึง {filteredEquipment.length} จากทั้งหมด {equipmentList.length} รายการ
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" disabled className="text-black border-black">
              ก่อนหน้า
            </Button>
            <Button variant="outlined" size="sm" disabled className="text-black border-black">
              ถัดไป
            </Button>
          </div>
        </CardFooter>

        {/* Delete Confirmation Modal - DaisyUI */}
        <DeleteEquipmentDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedEquipment={selectedEquipment}
          onConfirm={confirmDelete}
        />

        {/* Edit Dialog Modal - DaisyUI */}
        <EditEquipmentDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          equipmentData={selectedEquipment}
          onSave={(updatedData) => {
            setEquipmentList(equipmentList.map(item =>
              item.id === updatedData.id ? updatedData : item
            ));
            showAlertMessage(`แก้ไขครุภัณฑ์ ${updatedData.name} เรียบร้อยแล้ว`, "success");
          }}
        />

        {/* Add Equipment Dialog Modal - DaisyUI */}
        <AddEquipmentDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          initialFormData={{
            id: `EQ-${String(equipmentList.length + 1).padStart(3, '0')}`,
            name: "",
            description: "",
            quantity: "",
            status: "พร้อมใช้งาน",
            pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
          }}
          onSave={(newEquipment) => {
            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            setEquipmentList([...equipmentList, {
              ...newEquipment,
              created_at: formattedDate
            }]);
            showAlertMessage(`เพิ่มครุภัณฑ์ ${newEquipment.name} เรียบร้อยแล้ว`, "success");
          }}
        />
      </Card>
    </ThemeProvider>
  );
}

export default ManageEquipment;