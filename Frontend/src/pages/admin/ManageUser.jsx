import { useState } from "react";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import {
  PencilIcon,
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
import DeleteUserDialog from "./dialog/DeleteUserDialog";
import EditUserDialog from "./dialog/EditUserDialog";
import AddUserDialog from "./dialog/AddUserDialog";
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
  "รหัสสมาชิก",
  "รูปภาพ",
  "ชื่อผู้ใช้",
  "อีเมล",
  "เบอร์โทรศัพท์",
  "ที่อยู่",
  "วันที่สร้าง",
  "จัดการ"
];

const initialUsers = [
  {
    user_id: 1,
    user_code: "US-001",
    username: "John Doe",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "john@example.com",
    phone: "0812345678",
    address: "123 ถนนสุขุมวิท",
    county: "เขตบางนา",
    locality: "กรุงเทพมหานคร",
    postal_no: "10110",
    created_at: "2023-10-01 10:00:00",
    updated_at: "2023-10-05 15:30:00"
  },
  {
    user_id: 2,
    user_code: "US-002",
    username: "Jane Smith",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "jane@example.com",
    phone: "0898765432",
    address: "456 ถนนรัชดาภิเษก",
    county: "เขตห้วยขวาง",
    locality: "กรุงเทพมหานคร",
    postal_no: "10310",
    created_at: "2023-09-25 14:30:00",
    updated_at: "2023-09-28 09:15:00"
  },
  {
    user_id: 3,
    user_code: "US-003",
    username: "Alex Brown",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "alex@example.com",
    phone: "0976543210",
    address: "789 ถนนพระราม 4",
    county: "เขตปทุมวัน",
    locality: "กรุงเทพมหานคร",
    postal_no: "10330",
    created_at: "2023-09-15 09:20:00",
    updated_at: "2023-09-20 11:45:00"
  }
];

function ManageUser() {
  const [userList, setUserList] = useState(initialUsers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    user_id: "",
    user_code: "",
    username: "",
    pic:"",
    email: "",
    phone: "",
    address: "",
    county: "",
    locality: "",
    postal_no: "",
    password: ""
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [addFormData, setAddFormData] = useState({
    user_code: "",
    username: "",
    pic:"",
    email: "",
    phone: "",
    address: "",
    county: "",
    locality: "",
    postal_no: "",
    password: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  // ฟังก์ชั่นแสดง Alert
  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setUserList(userList.filter(item => item.user_id !== selectedUser.user_id));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    showAlertMessage(`ลบผู้ใช้ ${selectedUser.username} เรียบร้อยแล้ว`, "success");
  };

  const handleEditClick = (user) => {
    console.log("user.pic = ", user.pic);
    setSelectedUser(user);
    setEditFormData({
      user_id: user.user_id,
      user_code: user.user_code,
      username: user.username,
      pic:user.pic,
      email: user.email,
      phone: user.phone,
      address: user.address,
      county: user.county,
      locality: user.locality,
      postal_no: user.postal_no,
      password: "" // ไม่แสดง password จริง แต่เก็บไว้สำหรับการอัปเดต
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
    setUserList(userList.map(item =>
      item.user_id === editFormData.user_id ? {
        ...editFormData,
        updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      } : item
    ));
    setEditDialogOpen(false);
    showAlertMessage(`แก้ไขผู้ใช้ ${editFormData.username} เรียบร้อยแล้ว`, "success");
  };

  const handleAddClick = () => {
    const newCode = `US-${String(userList.length + 1).padStart(3, '0')}`;
    setAddFormData({
      user_code: newCode,
      username: "",
      pic:"",
      email: "",
      phone: "",
      address: "",
      county: "",
      locality: "",
      postal_no: "",
      password: ""
    });
    setAddDialogOpen(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveNewUser = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newUser = {
      ...addFormData,
      user_id: userList.length > 0 ? Math.max(...userList.map(u => u.user_id)) + 1 : 1,
      created_at: formattedDate,
      updated_at: formattedDate
    };

    setUserList([...userList, newUser]);
    setAddDialogOpen(false);
    showAlertMessage(`เพิ่มผู้ใช้ ${addFormData.username} เรียบร้อยแล้ว`, "success");
  };

  const filteredUsers = userList.filter(
    user =>
      user.user_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                รายการผู้ใช้งาน
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-black opacity-70">
                จัดการข้อมูลผู้ใช้งานทั้งหมด
              </Typography>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
              onClick={handleAddClick}
            >
              + เพิ่มผู้ใช้งาน
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-72 relative">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาผู้ใช้งาน
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค้นหาผู้ใช้งาน..."
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map(({ user_id, user_code, username, pic,email, phone, address, created_at }, index) => {
                  const isLast = index === filteredUsers.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={user_id} className="hover:bg-gray-200">
                      <td className={classes}>
                        <Typography variant="small" className="font-bold text-black">
                          {user_code}
                        </Typography>
                      </td>
                      <td className={classes}>
            <div className="flex items-center justify-center">
              <Avatar
                src={pic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt={username}
                size="md"
                className="h-12 w-12 border border-blue-gray-50 shadow-sm object-contain p-1 bg-white"
              />
            </div>
          </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-semibold text-black">
                          {username}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {phone}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {address}
                        </Typography>
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
                            <IconButton variant="text" color="amber" className="bg-amber-50 hover:bg-amber-100"
                              onClick={() => handleEditClick({ user_id, user_code, pic,username, email, phone, address })}>

                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="ลบ">
                            <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100"
                              onClick={() => handleDeleteClick({ user_id, username })}>
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
                  <td colSpan={7} className="p-4 text-center">
                    <Typography className="font-normal text-black">
                      ไม่พบข้อมูลผู้ใช้งาน
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" className="font-normal text-black mb-3 sm:mb-0">
            แสดง 1 ถึง {filteredUsers.length} จากทั้งหมด {userList.length} รายการ
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

        {/* Delete Confirmation Modal */}
        <DeleteUserDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedUser={selectedUser}
          onConfirm={confirmDelete}
        />
        {/* Edit Dialog Modal */}
        <EditUserDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          userData={selectedUser}
          onSave={(updatedData) => {
            setUserList(userList.map(item =>
              item.user_id === updatedData.user_id ? {
                ...updatedData,
                updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              } : item
            ));
            showAlertMessage(`แก้ไขผู้ใช้ ${updatedData.username} เรียบร้อยแล้ว`, "success");
          }}
        />

        {/* Add User Dialog Modal */}
        <AddUserDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          initialFormData={selectedUser || {
            user_code: `US-${String(userList.length + 1).padStart(3, '0')}`,
            username: "",
            pic: "",
            email: "",
            phone: "",
            address: "",
            county: "",
            locality: "",
            postal_no: "",
            password: ""
          }}
          onSave={(newUser) => {
            const now = new Date();
            const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

            const userWithId = {
              ...newUser,
              user_id: userList.length > 0 ? Math.max(...userList.map(u => u.user_id)) + 1 : 1,
              created_at: formattedDate,
              updated_at: formattedDate
            };

            setUserList([...userList, userWithId]);
            showAlertMessage(`เพิ่มผู้ใช้ ${newUser.username} เรียบร้อยแล้ว`, "success");
          }}
        />
      </Card>
    </ThemeProvider>
  );
}

export default ManageUser;