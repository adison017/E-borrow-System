import { useState } from "react";
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
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  ThemeProvider,
} from "@material-tailwind/react";

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
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    status: "พร้อมใช้งาน",
    pic: ""
  });
  
  // เพิ่มสถานะสำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (equipment) => {
    setSelectedEquipment(equipment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEquipmentList(equipmentList.filter(item => item.id !== selectedEquipment.id));
    setDeleteDialogOpen(false);
    setSelectedEquipment(null);
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
      backgroundColor: "bg-gray-50",
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
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
              + เพิ่มครุภัณฑ์
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-72">
              <Input
                label="ค้นหาครุภัณฑ์"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                className="text-black"
                labelProps={{ className: "text-black" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              <Button variant="outlined" size="sm" className="text-black border-black">
                ส่งออก Excel
              </Button>
              <Button variant="outlined" size="sm" className="text-black border-black">
                ตัวกรอง
              </Button>
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
                    <tr key={id} className="hover:bg-gray-50">
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} handler={() => setDeleteDialogOpen(false)}>
          <DialogHeader className="text-black">ยืนยันการลบครุภัณฑ์</DialogHeader>
          <DialogBody className="text-black">
            คุณแน่ใจว่าต้องการลบครุภัณฑ์ {selectedEquipment?.name} (รหัส: {selectedEquipment?.id}) ใช่หรือไม่?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="blue-gray"
              onClick={() => setDeleteDialogOpen(false)}
              className="mr-1 text-black"
            >
              ยกเลิก
            </Button>
            <Button variant="gradient" color="red" onClick={confirmDelete}>
              ยืนยันการลบ
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} handler={() => setEditDialogOpen(false)} size="md">
          <DialogHeader className="text-black">แก้ไขครุภัณฑ์</DialogHeader>
          <DialogBody className="text-black">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Typography variant="small" className="mb-2 font-medium text-black">
                  รหัสครุภัณฑ์
                </Typography>
                <Input
                  name="id"
                  value={editFormData.id}
                  onChange={handleEditChange}
                  disabled
                  className="text-black"
                  labelProps={{ className: "text-black" }}
                />
              </div>
              <div>
                <Typography variant="small" className="mb-2 font-medium text-black">
                  ชื่อครุภัณฑ์
                </Typography>
                <Input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="text-black"
                  labelProps={{ className: "text-black" }}
                />
              </div>
              <div>
                <Typography variant="small" className="mb-2 font-medium text-black">
                  รายละเอียด
                </Typography>
                <Input
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="text-black"
                  labelProps={{ className: "text-black" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="mb-2 font-medium text-black">
                    จำนวน
                  </Typography>
                  <Input
                    name="quantity"
                    value={editFormData.quantity}
                    onChange={handleEditChange}
                    className="text-black"
                    labelProps={{ className: "text-black" }}
                  />
                </div>
                <div>
                  <Typography variant="small" className="mb-2 font-medium text-black">
                    สถานะ
                  </Typography>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  >
                    {Object.keys(statusConfig).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Typography variant="small" className="mb-2 font-medium text-black">
                  สถานะที่เลือก:
                </Typography>
                <div className="py-2">
                  <StatusDisplay status={editFormData.status} />
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="blue-gray"
              onClick={() => setEditDialogOpen(false)}
              className="mr-1 text-black"
            >
              ยกเลิก
            </Button>
            <Button variant="gradient" color="green" onClick={saveEdit}>
              บันทึกการเปลี่ยนแปลง
            </Button>
          </DialogFooter>
        </Dialog>
      </Card>
    </ThemeProvider>
  );
}

export default ManageEquipment;