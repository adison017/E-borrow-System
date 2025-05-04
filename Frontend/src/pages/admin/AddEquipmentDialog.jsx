import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";

export default function AddEquipmentDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState(initialFormData || {
    id: "",
    name: "",
    description: "",
    quantity: "",
    status: "พร้อมใช้งาน",
    pic: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
  });

  const statusConfig = {
    "พร้อมใช้งาน": { color: "green", icon: "CheckCircleIcon" },
    "อยู่ระหว่างซ่อม": { color: "amber", icon: "ClockIcon" },
    "ชำรุด": { color: "red", icon: "XCircleIcon" },
    "ถูกยืม": { color: "blue", icon: "ExclamationCircleIcon" }
  };

  useEffect(() => {
    setFormData(initialFormData || {
      id: "",
      name: "",
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

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const isFormValid = formData.name && formData.quantity;

  const StatusDisplay = ({ status }) => {
    const config = statusConfig[status] || {
      color: "gray",
      icon: "ExclamationCircleIcon"
    };
    
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${config.color}-50 border border-${config.color}-100`}>
        <span className={`text-${config.color}-700 font-medium text-sm`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className={`modal ${open ? "modal-open" : ""} transition-all duration-300 ease-in-out`}>
      <div className={`modal-box max-w-4xl w-11/12 bg-white mx-auto p-8 shadow-xl transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <h3 className="font-bold text-2xl text-black mb-6">เพิ่มครุภัณฑ์ใหม่</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                รหัสครุภัณฑ์
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled
                className="input input-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                ชื่อครุภัณฑ์ *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ระบุชื่อครุภัณฑ์"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="รายละเอียดครุภัณฑ์"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                จำนวน *
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ระบุจำนวน (เช่น 5 ชิ้น)"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered w-full bg-gray-50 text-gray-800 text-base py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border">
              <img 
                src={formData.pic} 
                alt="รูปภาพตัวอย่าง"
                className="max-h-24 max-w-24 object-contain"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-black mb-2">สถานะที่เลือก:</h4>
              <StatusDisplay status={formData.status} />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปภาพ (URL)
                </label>
                <input
                  type="text"
                  name="pic"
                  value={formData.pic}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-50 text-gray-800 text-base py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="URL รูปภาพ"
                />
              </div>
            </div>
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
            className="btn btn-success btn-lg px-6 py-2 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            เพิ่มครุภัณฑ์
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
    </div>
  );
}