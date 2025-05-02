import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";

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
    <div className={`modal ${open ? 'modal-open' : ''} transition-all duration-300 ease-in-out`}>
      <div className={`modal-box max-w-xl w-full bg-white mx-auto p-8 shadow-xl transition-all duration-300 ease-in-out ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <h3 className="font-bold text-2xl text-black mb-6">แก้ไขหมวดหมู่</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              รหัสหมวดหมู่
            </label>
            <input
              type="text"
              name="category_code"
              value={formData.category_code}
              onChange={handleChange}
              disabled
              className="input input-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              ชื่อหมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              คำอธิบาย
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
        </div>

        <div className="modal-action mt-8 flex justify-end space-x-3">
          <button 
            className="btn btn-outline btn-lg px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className="btn btn-success btn-lg text-white"
            onClick={handleSubmit}
            disabled={!formData.name}
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50 transition-opacity duration-300" onClick={onClose}></div>
    </div>
  );
}