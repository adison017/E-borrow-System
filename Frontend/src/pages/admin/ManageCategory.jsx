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
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import Notification from "../../components/Notification";

// Theme configuration
const theme = {
  typography: {
    defaultProps: {
      color: "black",
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
      <Card className="h-full w-full text-black">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Typography variant="h5" className="text-black">
                รายการหมวดหมู่
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-black opacity-70">
                จัดการข้อมูลหมวดหมู่ทั้งหมด
              </Typography>
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white" 
              size="sm"
              onClick={handleAddClick}
            >
              + เพิ่มหมวดหมู่
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-72 relative">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาหมวดหมู่
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค้นหาหมวดหมู่..."
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map(({ category_id, category_code, name, description, created_at }, index) => {
                  const isLast = index === filteredCategories.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={category_id} className="hover:bg-gray-200">
                      <td className={classes}>
                        <Typography variant="small" className="font-bold text-black">
                          {category_code}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-semibold text-black">
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-black">
                          {description || '-'}
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
                            <IconButton 
                              variant="text" 
                              color="amber" 
                              className="bg-amber-50 hover:bg-amber-100" 
                              onClick={() => handleEditClick({ category_id, category_code, name, description })}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="ลบ">
                            <IconButton 
                              variant="text" 
                              color="red" 
                              className="bg-red-50 hover:bg-red-100" 
                              onClick={() => handleDeleteClick({ category_id, name })}
                            >
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
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    <Typography className="font-normal text-black">
                      ไม่พบข้อมูลหมวดหมู่
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
        
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" className="font-normal text-black mb-3 sm:mb-0">
            แสดง 1 ถึง {filteredCategories.length} จากทั้งหมด {categoryList.length} รายการ
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
    </ThemeProvider>
  );
}

export default ManageCategory;