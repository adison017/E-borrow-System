import {
  EyeIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
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
import { useState } from "react";
import Notification from "../../components/Notification";
import AddCategoryDialog from "./dialog/AddCategoryDialog";
import DeleteCategoryDialog from "./dialog/DeleteCategoryDialog";
import EditCategoryDialog from "./dialog/EditCategoryDialog";

// Theme configuration
const theme = {
  typography: {
    defaultProps: {
      color: "#374151", // Dark Gray for text
      textGradient: false,
    },
  }
};

const TABLE_HEAD = [
  "รหัสหมวดหมู่",
  "ชื่อหมวดหมู่",
  "คำอธิบาย",
  "วันที่สร้าง",
  "จัดการ"
];

const initialCategories = [
  {
    category_id: 1,
    category_code: "CAT-001",
    name: "อุปกรณ์อิเล็กทรอนิกส์",
    description: "หมวดหมู่สำหรับอุปกรณ์อิเล็กทรอนิกส์ทั้งหมด",
    created_at: "2023-10-01 10:00:00",
    updated_at: "2023-10-05 15:30:00"
  },
  {
    category_id: 2,
    category_code: "CAT-002",
    name: "เครื่องใช้ในบ้าน",
    description: "เครื่องใช้ไฟฟ้าและเฟอร์นิเจอร์สำหรับบ้าน",
    created_at: "2023-09-25 14:30:00",
    updated_at: "2023-09-28 09:15:00"
  },
  {
    category_id: 3,
    category_code: "CAT-003",
    name: "เสื้อผ้าและแฟชั่น",
    description: "เสื้อผ้า เครื่องแต่งกาย และอุปกรณ์แฟชั่น",
    created_at: "2023-09-15 09:20:00",
    updated_at: "2023-09-20 11:45:00"
  }
];

function ManageCategory() {
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [editFormData, setEditFormData] = useState({
    category_id: "",
    category_code: "",
    name: "",
    description: ""
  });

  const [addFormData, setAddFormData] = useState({
    category_code: "",
    name: "",
    description: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setCategoryList(categoryList.filter(item => item.category_id !== selectedCategory.category_id));
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
    showNotification(`ลบหมวดหมู่ ${selectedCategory.name} เรียบร้อยแล้ว`);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditFormData({
      category_id: category.category_id,
      category_code: category.category_code,
      name: category.name,
      description: category.description
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
    setCategoryList(categoryList.map(item =>
      item.category_id === editFormData.category_id ? {
        ...editFormData,
        updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      } : item
    ));
    setEditDialogOpen(false);
    showNotification(`แก้ไขหมวดหมู่ ${editFormData.name} เรียบร้อยแล้ว`);
  };

  const handleAddClick = () => {
    const newCode = `CAT-${String(categoryList.length + 1).padStart(3, '0')}`;
    setAddFormData({
      category_code: newCode,
      name: "",
      description: ""
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

  const saveNewCategory = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newCategory = {
      ...addFormData,
      category_id: categoryList.length > 0 ? Math.max(...categoryList.map(c => c.category_id)) + 1 : 1,
      created_at: formattedDate,
      updated_at: formattedDate
    };

    setCategoryList([...categoryList, newCategory]);
    setAddDialogOpen(false);
    showNotification(`เพิ่มหมวดหมู่ ${addFormData.name} เรียบร้อยแล้ว`);
  };

  const filteredCategories = categoryList.filter(
    category =>
      category.category_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ThemeProvider value={theme}>
      <Card className="h-full w-full text-gray-800 rounded-2xl shadow-lg">
        <CardHeader floated={false} shadow={false} className="rounded-t-2xl bg-white px-8 py-6">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Typography variant="h5" className="text-gray-900 font-semibold tracking-tight">
                รายการหมวดหมู่
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm text-gray-600">
                จัดการข้อมูลหมวดหมู่ทั้งหมด
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-x-4">
            <div className="w-full md:flex-grow relative">
              <label htmlFor="search" className="sr-only">ค้นหาหมวดหมู่</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  type="text"
                  className="w-full h-10 pl-10 pr-4 py-2.5 border border-gray-300 rounded-2xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
                  placeholder="ค้นหารหัส, ชื่อ หรือคำอธิบาย..."
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
                      className={`px-4 py-3 text-sm font-medium text-white uppercase tracking-wider whitespace-nowrap ${
                        index === 0 ? "w-32 text-left" : // รหัสหมวดหมู่
                        index === 1 ? "w-48 text-left" : // ชื่อหมวดหมู่
                        index === 2 ? "w-64 text-left" : // คำอธิบาย
                        index === 3 ? "w-40 text-left" : // วันที่สร้าง
                        index === 4 ? "w-32 text-center" : ""
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(({ category_id, category_code, name, description, created_at }, index) => (
                    <tr key={category_id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="w-32 px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-left">{category_code}</td>
                      <td className="w-48 px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-left">{name}</td>
                      <td className="w-64 px-4 py-4 whitespace-nowrap text-xs text-gray-700 max-w-xs truncate text-left" title={description}>{description || '-'}</td>
                      <td className="w-40 px-4 py-4 whitespace-nowrap text-xs text-gray-700 text-left">{created_at}</td>
                      <td className="w-32 px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex gap-2 justify-center">
                          <Tooltip content="ดูรายละเอียด">
                            <IconButton variant="text" color="blue" className="bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200">
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="แก้ไข">
                            <IconButton
                              variant="text"
                              color="amber"
                              className="bg-amber-50 hover:bg-amber-100 shadow-sm transition-all duration-200"
                              onClick={() => handleEditClick({ category_id, category_code, name, description })}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="ลบ">
                            <IconButton
                              variant="text"
                              color="red"
                              className="bg-red-50 hover:bg-red-100 shadow-sm transition-all duration-200"
                              onClick={() => handleDeleteClick({ category_id, name })}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={TABLE_HEAD.length} className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center p-5 bg-gray-100 rounded-full mb-5">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                      </div>
                      <Typography variant="h6" className="text-gray-700 font-medium mb-1">
                        ไม่พบข้อมูลหมวดหมู่
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
            แสดง {filteredCategories.length > 0 ? '1' : '0'} ถึง {filteredCategories.length} จากทั้งหมด {categoryList.length} รายการ
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
        {/* Notification Component */}
        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
        {/* Delete Confirmation Modal */}
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedCategory={selectedCategory}
          onConfirm={confirmDelete}
        />
        {/* Edit Dialog Modal */}
        <EditCategoryDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          categoryData={selectedCategory}
          onSave={(updatedData) => {
            setCategoryList(categoryList.map(item =>
              item.category_id === updatedData.category_id ? {
                ...updatedData,
                updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              } : item
            ));
            showNotification(`แก้ไขหมวดหมู่ ${updatedData.name} เรียบร้อยแล้ว`);
          }}
        />
        {/* Add Category Dialog Modal */}
        <AddCategoryDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          initialFormData={{
            category_code: `CAT-${String(categoryList.length + 1).padStart(3, '0')}`,
            name: "",
            description: ""
          }}
          onSave={(newCategory) => {
            const now = new Date();
            const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
            const categoryWithId = {
              ...newCategory,
              category_id: categoryList.length > 0 ? Math.max(...categoryList.map(c => c.category_id)) + 1 : 1,
              created_at: formattedDate,
              updated_at: formattedDate
            };
            setCategoryList([...categoryList, categoryWithId]);
            showNotification(`เพิ่มหมวดหมู่ ${newCategory.name} เรียบร้อยแล้ว`);
          }}
        />
      </Card>
      {/* Floating Add Category Button */}
      <Tooltip content="เพิ่มหมวดหมู่" placement="left">
        <button
          onClick={handleAddClick}
          className="fixed bottom-8 right-8 z-[60] bg-indigo-950 hover:bg-indigo-900 text-white rounded-full shadow-lg w-13 h-13 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="เพิ่มหมวดหมู่"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
          </svg>
        </button>
      </Tooltip>
    </ThemeProvider>
  );
}

export default ManageCategory;