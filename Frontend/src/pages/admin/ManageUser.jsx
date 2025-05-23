import {
  MagnifyingGlassIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

import {
  PencilIcon,
} from "@heroicons/react/24/solid";
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
import Notification from "../../components/Notification";
import AddUserDialog from "./dialog/AddUserDialog";
import DeleteUserDialog from "./dialog/DeleteUserDialog";
import EditUserDialog from "./dialog/EditUserDialog";
import ViewUserDialog from "./dialog/ViewUserDialog";
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
  "รหัสนิสิต",
  "รูปภาพ",
  "ชื่อ-นามสกุล",
  "อีเมล",
  "เบอร์โทรศัพท์",
  "ตำแหน่ง",
  "สาขา",
  "จัดการ"
];

const initialUsers = [
  {
    user_id: 1,
    student_id: "64010123",
    username: "johndoe",
    fullname: "John Doe",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "john@example.com",
    phone: "0812345678",
    position: "นิสิต",
    department: "วิทยาการคอมพิวเตอร์",
    updated_at: "2023-10-05 15:30:00"
  },
  {
    user_id: 2,
    student_id: "64010124",
    username: "janesmith",
    fullname: "Jane Smith",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "jane@example.com",
    phone: "0898765432",
    position: "บุคลากร",
    department: "เทคโนโลยีสารสนเทศ",
    updated_at: "2023-09-28 09:15:00"
  },
  {
    user_id: 3,
    student_id: "64010125",
    username: "alexbrown",
    fullname: "Alex Brown",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "alex@example.com",
    phone: "0976543210",
    position: "นิสิต",
    department: "วิทยาการคอมพิวเตอร์",
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
    student_id: "",
    username: "",
    fullname: "",
    pic:"",
    email: "",
    phone: "",
    position: "",
    department: "",
    password: ""
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [addFormData, setAddFormData] = useState({
    student_id: "",
    username: "",
    fullname: "",
    pic:"",
    email: "",
    phone: "",
    position: "",
    department: "",
    password: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

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
    showAlertMessage(`ลบผู้ใช้ ${selectedUser.fullname} เรียบร้อยแล้ว`, "success");
  };

  const handleEditClick = (user) => {
    console.log("user.pic = ", user.pic);
    setSelectedUser(user);
    setEditFormData({
      user_id: user.user_id,
      student_id: user.student_id,
      username: user.username,
      fullname: user.fullname,
      pic:user.pic,
      email: user.email,
      phone: user.phone,
      position: user.position,
      department: user.department,
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
    showAlertMessage(`แก้ไขผู้ใช้ ${editFormData.fullname} เรียบร้อยแล้ว`, "success");
  };

  const handleAddClick = () => {
    setAddFormData({
      student_id: "",
      username: "",
      fullname: "",
      pic:"",
      email: "",
      phone: "",
      position: "",
      department: "",
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
      updated_at: formattedDate
    };

    setUserList([...userList, newUser]);
    setAddDialogOpen(false);
    showAlertMessage(`เพิ่มผู้ใช้ ${addFormData.fullname} เรียบร้อยแล้ว`, "success");
  };

  const filteredUsers = userList.filter(
    user =>
      user.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                รายการผู้ใช้งาน
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm text-gray-600">
                จัดการข้อมูลผู้ใช้งานทั้งหมด
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-x-4">
            <div className="w-full md:flex-grow relative">
              <label htmlFor="search" className="sr-only">ค้นหาผู้ใช้งาน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  type="text"
                  className="w-full h-10 pl-10 pr-4 py-2.5 border border-gray-300 rounded-2xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
                  placeholder="ค้นหารหัสนิสิต, ชื่อ, อีเมล, ตำแหน่ง หรือสาขา..."
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
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-950 to-blue-700">
                <tr>
                {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className={`px-6 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap ${
                        index === 0 ? "w-15 text-left" : 
                        index === 1 ? "w-20 text-center" :
                        index === 2 ? "w-40 text-left" : 
                        index === 3 ? "w-20 text-left" : 
                        index === 4 ? "w-20 text-left" : 
                        index === 5 ? "w-20 text-center" : 
                        index === 6 ? "w-24 text-left" : 
                        index === 7 ? "w-20 text-center" : ""
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => {
                    const { user_id, student_id, username, fullname, pic, email, phone, position, department } = user;
                    return (
                      <tr key={user_id} className="hover:bg-gray-50 cursor-pointer" onClick={e => {
                        // Prevent open dialog if click on edit/delete buttons
                        if (e.target.closest('button')) return;
                        setViewUser(user);
                        setViewDialogOpen(true);
                      }}>
                        <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-gray-900">{student_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <Avatar
                              src={pic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                              alt={fullname}
                              size="md"
                              className="object-contain rounded-full w-12 h-12"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-900">{fullname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">{email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">{phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 text-center">{position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">{department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex gap-1 justify-center">
                            <Tooltip content="แก้ไข">
                              <IconButton variant="text" color="amber" className="bg-amber-50 hover:bg-amber-100"
                                onClick={e => { e.stopPropagation(); handleEditClick({ user_id, student_id, username, fullname, pic, email, phone, position, department }); }}>
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="ลบ">
                              <IconButton variant="text" color="red" className="bg-red-50 hover:bg-red-100"
                                onClick={e => { e.stopPropagation(); handleDeleteClick(user); }}>
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
                    <td colSpan={TABLE_HEAD.length} className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center p-5 bg-gray-100 rounded-full mb-5">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                      </div>
                      <Typography variant="h6" className="text-gray-700 font-medium mb-1">
                        ไม่พบข้อมูลผู้ใช้งาน
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
            แสดง {filteredUsers.length > 0 ? '1' : '0'} ถึง {filteredUsers.length} จากทั้งหมด {userList.length} รายการ
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
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedUser(null);
          }}
          userData={selectedUser}
          onSave={(updatedData) => {
            setUserList(userList.map(item =>
              item.user_id === updatedData.user_id ? {
                ...updatedData,
                updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              } : item
            ));
            showAlertMessage(`แก้ไขผู้ใช้ ${updatedData.fullname} เรียบร้อยแล้ว`, "success");
          }}
        />
        {/* Add User Dialog Modal */}
        <AddUserDialog
          open={addDialogOpen}
          onClose={() => {
            setAddDialogOpen(false);
            setSelectedUser(null);
          }}
          initialFormData={selectedUser || {
            student_id: "",
            username: "",
            fullname: "",
            pic: "",
            email: "",
            phone: "",
            position: "",
            department: "",
            password: ""
          }}
          onSave={(newUser) => {
            const now = new Date();
            const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
            const userWithId = {
              ...newUser,
              user_id: userList.length > 0 ? Math.max(...userList.map(u => u.user_id)) + 1 : 1,
              updated_at: formattedDate
            };
            setUserList([...userList, userWithId]);
            showAlertMessage(`เพิ่มผู้ใช้ ${newUser.fullname} เรียบร้อยแล้ว`, "success");
          }}
        />
        <ViewUserDialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} userData={viewUser} />
      </Card>
      {/* Floating Add User Button */}
      <Tooltip content="เพิ่มผู้ใช้งาน" placement="left">
        <button
          onClick={handleAddClick}
          className="fixed bottom-8 right-8 z-[60] border-black bg-black/70 hover:bg-white hover:border-2 hover:border-black hover:text-black text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="เพิ่มผู้ใช้งาน"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
          </svg>
        </button>
      </Tooltip>
    </ThemeProvider>
  );
}

export default ManageUser;