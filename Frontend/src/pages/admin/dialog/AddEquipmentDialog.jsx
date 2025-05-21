import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

export default function AddEquipmentDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState(initialFormData || {
    id: "",
    name: "",
    category: "",
    description: "",
    quantity: "",
    status: "พร้อมใช้งาน",
    pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
  });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const statusConfig = {
    "ชำรุด": { color: "red", icon: "XCircleIcon" },
    "พร้อมใช้งาน": { color: "green", icon: "CheckCircleIcon" },
    "ระหว่างซ่อม": { color: "amber", icon: "ClockIcon" },
    "ถูกยืม": { color: "blue", icon: "ExclamationCircleIcon" }
  };
  
  // กำหนดหมวดหมู่ครุภัณฑ์
  const categoryOptions = [
    "อุปกรณ์มัลติมีเดีย",
    "อุปกรณ์เสียง",
    "อุปกรณ์คอมพิวเตอร์",
    "อุปกรณ์สำนักงาน",
    "อุปกรณ์อิเล็กทรอนิกส์"
  ];

  useEffect(() => {
    if (initialFormData?.pic) {
      setPreviewImage(initialFormData.pic);
    } else {
      setPreviewImage("https://cdn-icons-png.flaticon.com/512/3474/3474360.png");
    }

    setFormData(initialFormData || {
      id: "",
      name: "",
      category: "",
      description: "",
      quantity: "",
      status: "พร้อมใช้งาน",
      pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
    });
  }, [initialFormData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        pic: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const isFormValid = formData.name && formData.quantity && formData.category;

  const StatusDisplay = ({ status }) => {
    const config = statusConfig[status] || {
      color: "gray",
      icon: "ExclamationCircleIcon"
    };

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${config.color}-50 border border-${config.color}-100`}>
        <span className={`text-${config.color}-700 font-medium text-base`}>
          {status}
        </span>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-200 w-full p-5 z-50 overflow-y-auto max-h-[100vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center tracking-tight">
            <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg mr-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </span>
            เพิ่มครุภัณฑ์ใหม่
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
          {/* Prominent Image Upload */}
          <div className="flex flex-col items-center mb-5">
            <div 
              className="w-40 h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-sm"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={previewImage}
                alt="รูปภาพครุภัณฑ์"
                className="max-h-36 max-w-36 object-contain z-10"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all duration-200">
                <div className="bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-sm font-medium text-gray-500 mt-3">คลิกที่รูปเพื่ออัพโหลดรูปภาพ</span>
            {formData.pic?.name && (
              <p className="text-sm mt-1 text-gray-600 truncate max-w-[300px]">{formData.pic.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">รหัสครุภัณฑ์</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                ชื่อครุภัณฑ์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow"
                placeholder="ระบุชื่อครุภัณฑ์"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              หมวดหมู่ <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow"
              required
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow"
              placeholder="รายละเอียดครุภัณฑ์"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                จำนวน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow"
                placeholder="ระบุจำนวน"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">สถานะ</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-shadow h-[42px] min-h-[42px]"
              >
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-sm"
            onClick={onClose}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-sm ${
              isFormValid 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-emerald-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isFormValid}
            type="button"
          >
            เพิ่มครุภัณฑ์
          </button>
        </div>
      </div>
    </div>
  );
}