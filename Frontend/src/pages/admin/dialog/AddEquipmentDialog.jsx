import th from 'date-fns/locale/th';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useEffect, useRef, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getCategories, uploadImage } from "../../../utils/api";

registerLocale('th', th);
dayjs.locale('th');

export default function AddEquipmentDialog({
  open,
  onClose,
  initialFormData,
  onSave,
  equipmentData
}) {
  const [formData, setFormData] = useState(initialFormData || {
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
    setFormData(equipmentData || initialFormData || {
      id: "",
      name: "",
      category: "",
      description: "",
      quantity: "",
      unit: "", 
      status: "พร้อมใช้งาน",
      pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
    });

    // ตั้งค่า previewImage ใหม่ทุกครั้งที่เปิด dialog
    const pic = equipmentData?.pic || initialFormData?.pic;
    if (pic) {
      if (typeof pic === 'string') {
        setPreviewImage(
          pic.startsWith('http') || pic.startsWith('/uploads')
            ? pic
            : `/uploads/${pic}`
        );
      } else {
        setPreviewImage("https://cdn-icons-png.flaticon.com/512/3474/3474360.png");
      }
    } else {
      setPreviewImage("https://cdn-icons-png.flaticon.com/512/3474/3474360.png");
    }
  }, [equipmentData, initialFormData, open]);

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
        <div className="space-y-6">
          {/* Prominent Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-44 h-44 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border-2 border-dashed border-emerald-200 flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={previewImage || formData.pic}
                alt={formData.name}
                className="max-h-40 max-w-40 object-contain z-10 transform group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300 z-20">
                <div className="bg-white/95 p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <span className="text-sm font-medium text-gray-600 mt-4 px-4 py-2 rounded-full ">คลิกที่รูปเพื่ออัพโหลดรูปภาพ</span>
            {formData.pic?.name && (
              <p className="text-sm mt-2 text-emerald-600 truncate max-w-[300px]">{formData.pic.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">รหัสครุภัณฑ์</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 shadow-sm group-hover:shadow-md transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                ชื่อครุภัณฑ์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
                placeholder="ระบุชื่อครุภัณฑ์"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              หมวดหมู่ <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
              required
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-2">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
              placeholder="รายละเอียดครุภัณฑ์"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                จำนวน <span className="text-rose-500">*</span>
              </label>
              <div className="flex w-full group">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
                  placeholder="ระบุจำนวน"
                  required
                  min={1}
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="py-3 px-10 bg-white border-t border-b border-r border-gray-300 rounded-r-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
                  required
                >
                  <option value="">หน่วย</option>
                  <option value="ชิ้น">ชิ้น</option>
                  <option value="ชุด">ชุด</option>
                  <option value="กล่อง">กล่อง</option>
                  <option value="อัน">อัน</option>
                  <option value="รายการ">รายการ</option>
                </select>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">สถานะ</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
              >
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">วันที่จัดซื้อ</label>
              <div className="relative">
                <input
                  type="date"
                  name="purchaseDate"
                  value={dayjs(formData.purchaseDate).isValid() ? dayjs(formData.purchaseDate).format('YYYY-MM-DD') : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
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
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">ราคา (บาท)</label>
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
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
                placeholder="ระบุราคา"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-2">สถานที่จัดเก็บ</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300"
              placeholder="ระบุสถานที่จัดเก็บ"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <button
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={onClose}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
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
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}