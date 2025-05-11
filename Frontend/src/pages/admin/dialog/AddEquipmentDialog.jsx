import { useState, useEffect, useRef } from "react";
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
    "อยู่ระหว่างซ่อม": { color: "amber", icon: "ClockIcon" },
    "ถูกยืม": { color: "blue", icon: "ExclamationCircleIcon" }
  };

  useEffect(() => {
    if (initialFormData?.pic) {
      setPreviewImage(initialFormData.pic);
    } else {
      setPreviewImage("https://cdn-icons-png.flaticon.com/512/3474/3474360.png");
    }

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

  const isFormValid = formData.name && formData.quantity;

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

  return (
    open && (
      <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">เพิ่มครุภัณฑ์ใหม่</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">รหัสครุภัณฑ์</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    disabled
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">ชื่อครุภัณฑ์ *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="ระบุชื่อครุภัณฑ์"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">รายละเอียด</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  placeholder="รายละเอียดครุภัณฑ์"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">จำนวน *</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="ระบุจำนวน"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">สถานะ</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-gray-50 text-gray-800 text-base py-2 px-3 rounded-md h-[40px] min-h-[40px]"
                  >
                    {Object.keys(statusConfig).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                <div className="w-24 h-24 bg-white rounded-md flex items-center justify-center border">
                  <img
                    src={previewImage}
                    alt="รูปภาพครุภัณฑ์"
                    className="max-h-20 max-w-20 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-black mb-1">สถานะที่เลือก:</h4>
                  <StatusDisplay status={formData.status} />
                  <div className="mt-2">
                    <label className="block text-base font-medium text-gray-700 mb-1">อัพโหลดรูปภาพ</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => fileInputRef.current.click()}
                    >
                      เลือกไฟล์
                    </button>
                    {formData.pic?.name && (
                      <p className="text-sm mt-1 text-gray-600">{formData.pic.name}</p>
                    )}
                  </div>
                </div>
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
                disabled={!isFormValid}
              >
                เพิ่มครุภัณฑ์
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}