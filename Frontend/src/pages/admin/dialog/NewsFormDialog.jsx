import React from 'react';

// Helper function to get category color - can be kept here or passed as prop if used elsewhere
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

const NewsFormDialog = ({ 
  showModal, 
  setShowModal, 
  handleSubmit, 
  isEditing, 
  formData, 
  handleInputChange,
  // Available categories - can be fetched or defined here/passed as prop
  categories = ['ประกาศ', 'การบำรุงรักษา', 'อุปกรณ์ใหม่', 'กิจกรรม'] 
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">หัวข้อข่าว</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {/* Add more categories as needed */}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">เนื้อหา</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="6"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มข่าว'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={() => setShowModal(false)}>close</button>
      </form>
    </div>
  );
};

export default NewsFormDialog; 