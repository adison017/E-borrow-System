
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
      <div className="relative bg-white p-0 rounded-2xl shadow-2xl w-full max-w-8xl max-h-[92vh] overflow-y-auto border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-blue-900 tracking-tight">{isEditing ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}</h2>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-blue-600 transition-colors duration-150 rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="ปิด"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
          <div className="mb-5">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">หัวข้อข่าว <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-150 bg-gray-50"
              placeholder="กรอกหัวข้อข่าว..."
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">ประเภท <span className="text-red-500">*</span></label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-150"
              required
            >
              <option value="" disabled>เลือกประเภทข่าว</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-7">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">เนื้อหา <span className="text-red-500">*</span></label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="7"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-150 bg-gray-50"
              placeholder="กรอกรายละเอียดข่าว..."
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-150"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-150"
            >
              {isEditing ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มข่าว'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormDialog; 