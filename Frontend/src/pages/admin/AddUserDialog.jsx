import { useState, useEffect, useRef } from "react";

import { Typography } from "@material-tailwind/react";

export default function AddUserDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState(initialFormData || {});
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // แสดงภาพจาก initialFormData หากมี (เช่น ใช้ตอนแก้ไข)
    if (initialFormData?.pic && typeof initialFormData.pic === "string") {
      setPreviewImage(initialFormData.pic);
    } else {
      setPreviewImage(null);
    }

    setFormData(initialFormData || {});
  }, [initialFormData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
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

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.phone &&
    formData.password;

  return (
    <div className={`modal ${open ? "modal-open" : ""} transition-all duration-300 ease-in-out`}>
      <div className={`modal-box max-w-4xl w-11/12 bg-white mx-auto p-6 shadow-xl transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <h3 className="font-bold text-2xl text-black border-b pb-3 mb-4">เพิ่มผู้ใช้งานใหม่</h3>
        <div className="py-4 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-black mb-2">รหัสผู้ใช้งาน</label>
              <input
                type="text"
                name="user_code"
                value={formData.user_code || ""}
                onChange={handleChange}
                disabled
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
              />
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="รูปภาพผู้ใช้"
                    className="max-h-24 max-w-24 object-contain"
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="รูปภาพเริ่มต้น"
                    className="max-h-24 max-w-24 object-contain"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-2">อัพโหลดรูปภาพ</label>
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
                  {formData.pic && formData.pic.name && (
                    <p className="text-sm mt-2 text-gray-600">{formData.pic.name}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-black mb-2">ชื่อผู้ใช้งาน *</label>
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
                placeholder="ระบุชื่อผู้ใช้งาน"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-black mb-2">อีเมล *</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
                placeholder="example@domain.com"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-black mb-2">เบอร์โทรศัพท์ *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
                placeholder="0812345678"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-black mb-2">ที่อยู่</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-50 text-black text-lg"
              placeholder="บ้านเลขที่, ถนน, ซอย"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-base font-medium text-black mb-2">เขต/อำเภอ</label>
              <input
                type="text"
                name="county"
                value={formData.county || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
                placeholder="เขต/อำเภอ"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-black mb-2">จังหวัด</label>
              <input
                type="text"
                name="locality"
                value={formData.locality || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
                placeholder="จังหวัด"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-black mb-2">รหัสไปรษณีย์</label>
              <input
                type="text"
                name="postal_no"
                value={formData.postal_no || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-50 text-black text-lg"
                placeholder="10110"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-black mb-2">รหัสผ่าน *</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-50 text-black text-lg"
              placeholder="รหัสผ่าน"
              required
            />
          </div>
        </div>

        <div className="modal-action border-t pt-4">
          <button className="btn btn-outline btn-lg" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            className="btn btn-success btn-lg text-white"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            เพิ่มผู้ใช้งาน
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
