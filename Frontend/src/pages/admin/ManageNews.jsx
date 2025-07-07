import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdAddCircle, MdDelete, MdEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteNewsDialog from './dialog/DeleteNewsDialog';
import NewsFormDialog from './dialog/NewsFormDialog';

// Helper function to get category color
const getCategoryColor = (category) => {
  switch (category) {
    case 'การบำรุงรักษา':
      return 'bg-orange-100 text-orange-800';
    case 'อุปกรณ์ใหม่':
      return 'bg-green-100 text-green-800';
    case 'กิจกรรม':
      return 'bg-blue-100 text-blue-800';
    case 'ประกาศ':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ManageNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  // ลบ state error เดิม (ใช้ react-toastify แทน)
  // ฟังก์ชันกลางสำหรับแจ้งเตือน (เหมือน borrowlist)
  const notifyNewsAction = (action, extra) => {
    let message = "";
    let type = "info";
    switch (action) {
      case "add":
        message = `เพิ่มข่าวใหม่เรียบร้อยแล้ว`;
        type = "success";
        break;
      case "edit":
        message = `แก้ไขข่าวเรียบร้อยแล้ว`;
        type = "success";
        break;
      case "delete":
        message = `ลบข่าวเรียบร้อยแล้ว`;
        type = "success";
        break;
      case "add_error":
        message = "เกิดข้อผิดพลาดในการเพิ่มข่าว";
        type = "error";
        break;
      case "edit_error":
        message = "เกิดข้อผิดพลาดในการแก้ไขข่าว";
        type = "error";
        break;
      case "delete_error":
        message = "เกิดข้อผิดพลาดในการลบข่าว";
        type = "error";
        break;
      case "fetch_error":
        message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
        type = "error";
        break;
      default:
        message = action;
        type = "info";
    }
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast.info(message);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'ประกาศ'
  });

  // Fetch all news
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNewsItems(response.data);
      setLoading(false);
    } catch (err) {
      notifyNewsAction("fetch_error");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ title: '', content: '', category: 'ประกาศ' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category
    });
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setNewsToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (newsToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/news/${newsToDelete.id}`);
        setNewsItems(prevItems => prevItems.filter(item => item.id !== newsToDelete.id));
        setShowDeleteModal(false);
        setNewsToDelete(null);
        notifyNewsAction("delete");
      } catch (err) {
        notifyNewsAction("delete_error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentItem) {
        // Update existing item
        const response = await axios.put(`http://localhost:5000/api/news/${currentItem.id}`, formData);
        setNewsItems(prevItems =>
          prevItems.map(item =>
            item.id === currentItem.id ? response.data : item
          )
        );
        notifyNewsAction("edit");
      } else {
        // Add new item
        const response = await axios.post('http://localhost:5000/api/news', formData);
        setNewsItems(prevItems => [response.data, ...prevItems]);
        notifyNewsAction("add");
      }
      setShowModal(false);
      setFormData({ title: '', content: '', category: 'ประกาศ' });
    } catch (err) {
      if (isEditing) {
        notifyNewsAction("edit_error");
      } else {
        notifyNewsAction("add_error");
      }
    }
  };

  if (loading) return <div className="p-6">กำลังโหลด...</div>;

  return (
    <div className="p-6 flex-grow text-black">
      {/* Notification Component (react-toastify) */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">จัดการข่าวสาร</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-150 ease-in-out"
        >
          <MdAddCircle className="mr-2" size={20} />
          เพิ่มข่าวใหม่
        </button>
      </div>

      {/* News Items List/Table */}
      <div className="space-y-6">
        {newsItems.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีข่าวสารในระบบ</p>
        ) : (
          newsItems.map((item) => (
            <div
              key={item.id}
              className="bg-blue-100/20 p-6 rounded-4xl shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`text-xs font-semibold p-2 rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <h2 className="ml-2 text-2xl font-semibold text-blue-600 mt-4">{item.title}</h2>
                  <p className="ml-2  text-sm text-gray-500">เผยแพร่เมื่อ: {new Date(item.date).toLocaleDateString('th-TH')}</p>
                </div>
                <div className="flex space-x-2 ">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-150"
                    title="แก้ไข"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-150"
                    title="ลบ"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-3 ml-2 ">{item.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Use the NewsFormDialog component */}
      <NewsFormDialog
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        formData={formData}
        handleInputChange={handleInputChange}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNewsDialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedNews={newsToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ManageNews;