import React, { useState } from 'react';
import { MdAddCircle, MdDelete, MdEdit } from 'react-icons/md';
import DeleteNewsDialog from './dialog/DeleteNewsDialog'; // Import the delete dialog
import NewsFormDialog from './dialog/NewsFormDialog'; // Import the new dialog component

// Placeholder data for news items - same as NewsPage.jsx
const initialNewsItems = [
  { 
    id: 1, 
    title: 'ปรับปรุงระบบครั้งใหญ่!', 
    date: '25/04/2025', 
    content: 'ระบบ E-borrow จะมีการปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพและฟีเจอร์ใหม่ๆ ในวันที่ 30 เมษายน 2568 ตั้งแต่เวลา 00:00 ถึง 06:00 น. ขออภัยในความไม่สะดวก',
    category: 'การบำรุงรักษา' 
  },
  { 
    id: 2, 
    title: 'อุปกรณ์ใหม่: โดรนสำหรับการถ่ายภาพมุมสูง', 
    date: '22/04/2025', 
    content: 'เราได้เพิ่มโดรน DJI Mavic Air 3 เข้ามาในระบบ ท่านสามารถเริ่มยืมได้ตั้งแต่วันนี้เป็นต้นไป',
    category: 'อุปกรณ์ใหม่'
  },
  { 
    id: 3, 
    title: 'อบรมการใช้งานโปรเจกเตอร์รุ่นใหม่', 
    date: '20/04/2025', 
    content: 'ขอเชิญผู้ที่สนใจเข้าร่วมอบรมการใช้งานโปรเจกเตอร์ Epson EB-L200SW ในวันที่ 5 พฤษภาคม 2568 เวลา 13:00 - 15:00 น. ณ ห้องประชุมใหญ่',
    category: 'กิจกรรม'
  },
  {
    id: 4,
    title: 'ประกาศวันหยุดเทศกาลสงกรานต์',
    date: '10/04/2025',
    content: 'เนื่องในเทศกาลสงกรานต์ ระบบ E-borrow จะงดให้บริการในวันที่ 13-15 เมษายน 2568 และจะเปิดให้บริการตามปกติในวันที่ 16 เมษายน 2568',
    category: 'ประกาศ'
  }
];

// Helper function to get category color - same as NewsPage.jsx
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
  const [newsItems, setNewsItems] = useState(initialNewsItems);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // For editing
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete dialog
  const [newsToDelete, setNewsToDelete] = useState(null); // State for news item to delete

  // Form state for new/edit item
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    content: '',
    category: 'ประกาศ' // Default category
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ title: '', date: '', content: '', category: 'ประกาศ' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({ 
      title: item.title, 
      date: item.date, // Assuming date is stored and edited as string for now
      content: item.content, 
      category: item.category 
    });
    setShowModal(true);
  };

  const handleDelete = (item) => {
    // Add confirmation dialog before deleting
    // if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?')) {
    //   setNewsItems(prevItems => prevItems.filter(item => item.id !== id));
    // }
    setNewsToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (newsToDelete) {
      setNewsItems(prevItems => prevItems.filter(item => item.id !== newsToDelete.id));
      setShowDeleteModal(false);
      setNewsToDelete(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && currentItem) {
      // Update existing item
      setNewsItems(prevItems => 
        prevItems.map(item => 
          item.id === currentItem.id ? { ...item, ...formData, date: new Date().toLocaleDateString('th-TH') } : item
        )
      );
    } else {
      // Add new item
      setNewsItems(prevItems => [
        ...prevItems,
        { id: Date.now(), ...formData, date: new Date().toLocaleDateString('th-TH') } // Use timestamp for unique ID and current date
      ]);
    }
    setShowModal(false);
    setFormData({ title: '', date: '', content: '', category: 'ประกาศ' }); // Reset form
  };

  return (
    <div className="p-6 flex-grow text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">จัดการข่าวสาร</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-150 ease-in-out"
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
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                <span className={`text-xs font-semibold p-3 rounded-full ${getCategoryColor(item.   category)}`}>
                    {item.category}
                  </span>
                  <h2 className="text-2xl font-semibold text-blue-600 mt-4">{item.title}</h2>
                  <p className="text-sm text-gray-500">เผยแพร่เมื่อ: {item.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-150"
                    title="แก้ไข"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item)} // Pass the whole item
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-150"
                    title="ลบ"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-3">{item.content}</p>
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