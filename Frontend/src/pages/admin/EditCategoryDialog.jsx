import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

export default function EditCategoryDialog({
  open,
  onClose,
  categoryData,
  onSave
}) {
  const [formData, setFormData] = useState({
    category_id: "",
    category_code: "",
    name: "",
    description: ""
  });

  useEffect(() => {
    if (categoryData) {
      setFormData({
        category_id: categoryData.category_id || "",
        category_code: categoryData.category_code || "",
        name: categoryData.name || "",
        description: categoryData.description || ""
      });
    }
  }, [categoryData]);

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

  return (
    open && (
      <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">แก้ไขหมวดหมู่</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">รหัสหมวดหมู่</label>
                <input
                  type="text"
                  name="category_code"
                  value={formData.category_code}
                  onChange={handleChange}
                  disabled
                  className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">ชื่อหมวดหมู่ *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">คำอธิบาย</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-action mt-6 flex justify-end space-x-2 border-t pt-4">
              <button
                className="btn btn-outline btn-base px-4 py-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={onClose}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-success btn-base text-white"
                onClick={handleSubmit}
                disabled={!formData.name}
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}