import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getCategories, uploadImage } from "../../../utils/api";

export default function EditEquipmentDialog({
  open,
  onClose,
  equipmentData,
  onSave
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    quantity: "",
    unit: "",
    status: "พร้อมใช้งาน",
    pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
  });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const statusConfig = {
    "ชำรุด": { color: "red", icon: "XCircleIcon" },
    "พร้อมใช้งาน": { color: "green", icon: "CheckCircleIcon" },
    "ระหว่างซ่อม": { color: "amber", icon: "ClockIcon" },
    "ถูกยืม": { color: "blue", icon: "ExclamationCircleIcon" }
  };
  
  useEffect(() => {
  if (open) {
    getCategories().then(data => setCategories(data));
  }
  setFormData(equipmentData || {
    id: "",
    name: "",
    category: "",
    description: "",
    quantity: "",
    unit: "", // <-- ต้องเป็นค่าว่าง
    status: "พร้อมใช้งาน",
    pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
  });

  // ตั้งค่า previewImage ใหม่ทุกครั้งที่เปิด dialog
  if (equipmentData?.pic) {
    if (typeof equipmentData.pic === 'string') {
      setPreviewImage(
        equipmentData.pic.startsWith('http') || equipmentData.pic.startsWith('/uploads')
          ? equipmentData.pic
          : `/uploads/${equipmentData.pic}`
      );
    } else {
      setPreviewImage("https://cdn-icons-png.flaticon.com/512/3474/3474360.png");
    }
  } else {
    setPreviewImage("https://cdn-icons-png.flaticon.com/512/3474/3474360.png");
  }
}, [equipmentData, open]);

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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      purchaseDate: date ? dayjs(date).format('YYYY-MM-DD') : ''
    }));
  };

  const handleSubmit = async () => {
    let dataToSave = { ...formData };
    if (dataToSave.pic instanceof File) {
      dataToSave.pic = await uploadImage(dataToSave.pic, dataToSave.id); // ส่ง id ไปด้วย
    }
    // ไม่ต้องตัด path แล้ว เพราะ backend รับได้เลย
    onSave(dataToSave);
    onClose();
  };
  
  const isFormValid = formData.name && formData.quantity && formData.category && formData.unit;

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
    <div className="modal modal-open">
      <div className="modal-box relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-[150vh] w-full p-5 z-50 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center tracking-tight">
            <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </span>
            แก้ไขครุภัณฑ์
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
                  src={
                    previewImage ||
                    (typeof formData.pic === 'string'
                      ? (formData.pic.startsWith('http') || formData.pic.startsWith('/uploads'))
                        ? formData.pic
                        : `/uploads/${formData.pic}`
                      : "https://cdn-icons-png.flaticon.com/512/3474/3474360.png")
                  }
                  alt={formData.name}
                  className="max-h-36 max-w-36 object-contain z-10"
                  onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"; }}
                />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all duration-200 z-20">
                <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
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
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-shadow"
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
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-shadow"
              required
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-shadow"
              placeholder="รายละเอียดครุภัณฑ์"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                จำนวน <span className="text-rose-500">*</span>
              </label>
              <div className="flex w-full">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-shadow"
                  placeholder="ระบุจำนวน"
                  required
                  min={1}
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="py-2 bg-white border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  required
                >
                  <option value="" disabled>เลือกหน่วย</option>
                  <option value="ชิ้น">ชิ้น</option>
                  <option value="ชุด">ชุด</option>
                  <option value="กล่อง">กล่อง</option>
                  <option value="อัน">อัน</option>
                  <option value="รายการ">รายการ</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">สถานะ</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-shadow h-[42px] min-h-[42px]"
              >
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">วันที่จัดซื้อ</label>
              <div className="relative">
                <input
                  type="date"
                  name="purchaseDate"
                  value={dayjs(formData.purchaseDate).isValid() ? dayjs(formData.purchaseDate).format('YYYY-MM-DD') : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
                  placeholder="เลือกวันที่"
                  onClick={() => document.querySelector('input[name="purchaseDate"]').showPicker()}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => document.querySelector('input[name="purchaseDate"]').showPicker()}
                >
                  <FaCalendarAlt />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">ราคา (บาท)</label>
              <input
                type="text"
                name="price"
                value={formData.price ? Number(formData.price).toLocaleString('th-TH') : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({
                    ...prev,
                    price: value
                  }));
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
                placeholder="ระบุราคา"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">สถานที่จัดเก็บ</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-shadow"
              placeholder="ระบุสถานที่จัดเก็บ"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            onClick={onClose}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm ${
              isFormValid 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-blue-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isFormValid}
            type="button"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}