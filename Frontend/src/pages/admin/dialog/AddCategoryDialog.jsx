import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

export default function AddCategoryDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState(initialFormData || {});

  useEffect(() => {
    setFormData(initialFormData || {});
  }, [initialFormData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const isFormValid = formData.name && formData.category_code;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 z-50">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
            <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </span>
            เพิ่มหมวดหมู่ใหม่
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors duration-150 hover:bg-gray-100 p-2 rounded-full"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
        {/* Form Content */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสหมวดหมู่</label>
            <input
              type="text"
              name="category_code"
              value={formData.category_code || ""}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่ <span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow"
              placeholder="ระบุชื่อหมวดหมู่"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow"
              placeholder="คำอธิบายเกี่ยวกับหมวดหมู่"
              rows={4}
            />
          </div>
        </div>
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
            onClick={onClose}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 ${
              isFormValid 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-emerald-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isFormValid}
            type="button"
          >
            เพิ่มหมวดหมู่
          </button>
        </div>
      </div>
    </div>
  );
}