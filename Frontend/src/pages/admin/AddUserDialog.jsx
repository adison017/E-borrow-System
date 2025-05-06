import { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";

export default function AddUserDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState(initialFormData || {
    user_code: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    county: "",
    locality: "",
    postal_no: "",
    password: "",
    pic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialFormData?.pic) {
      setPreviewImage(initialFormData.pic);
    } else {
      setPreviewImage("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
    }

    setFormData(initialFormData || {
      user_code: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      county: "",
      locality: "",
      postal_no: "",
      password: "",
      pic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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

  const isFormValid = formData.username && formData.email && formData.phone && formData.password;

  return (
    open && (
      <div className="fixed inset-0 backdrop-blur bg-opacity-30 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">เพิ่มผู้ใช้งานใหม่</h2>
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
                  <label className="block font-medium text-gray-700 mb-1">รหัสผู้ใช้งาน</label>
                  <input
                    type="text"
                    name="user_code"
                    value={formData.user_code}
                    onChange={handleChange}
                    disabled
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">ชื่อผู้ใช้งาน *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="ระบุชื่อผู้ใช้งาน"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">อีเมล *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="example@domain.com"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="0812345678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">ที่อยู่</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  placeholder="บ้านเลขที่, ถนน, ซอย"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">เขต/อำเภอ</label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="เขต/อำเภอ"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">จังหวัด</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="จังหวัด"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    name="postal_no"
                    value={formData.postal_no}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                    placeholder="10110"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">รหัสผ่าน *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-50 text-gray-800 py-2 px-3 text-base rounded-md"
                  placeholder="รหัสผ่าน"
                  required
                />
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                <div className="w-24 h-24 bg-white rounded-md flex items-center justify-center border">
                  <img
                    src={previewImage}
                    alt="รูปภาพผู้ใช้"
                    className="max-h-20 max-w-20 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div>
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
                เพิ่มผู้ใช้งาน
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}