import { useEffect, useRef, useState } from "react";
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
      <div data-theme="light" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 overflow-y-auto py-6">
        <div
          className="relative w-full max-w-3xl mx-auto animate-fadeIn bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - absolute positioned */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-200 z-10"
          >
            <MdClose className="w-5 h-5" />
          </button>

          {/* Header with gradient background */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">เพิ่มผู้ใช้งานใหม่</h2>
            <p className="text-xs text-gray-500 mt-0.5">กรอกข้อมูลผู้ใช้งานใหม่ให้ครบถ้วน</p>
          </div>

          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image Column */}
                <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 relative group">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 p-1 shadow-lg">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                        <img
                          src={previewImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                          }}
                        />
                      </div>
                    </div>
                    
                    <label 
                      htmlFor="profile-upload" 
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-white text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-medium block mt-1">เปลี่ยนรูป</span>
                      </div>
                    </label>
                    
                    <input
                      id="profile-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  {formData.pic && typeof formData.pic !== 'string' && (
                    <span className="text-xs text-gray-500 text-center">{formData.pic.name}</span>
                  )}
                  
                  <p className="text-xs text-gray-400 text-center bg-gray-50 px-3 py-1.5 rounded-full shadow-sm">
                    อัปโหลดรูปโปรไฟล์
                  </p>
                  
                  <div className="bg-green-50 rounded-lg p-3 mt-4 border border-green-100 hidden md:block">
                    <p className="text-xs text-green-700 font-medium">เมื่อเพิ่มผู้ใช้ใหม่ ระบบจะกำหนดรหัสผู้ใช้ให้โดยอัตโนมัติ</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="w-full md:w-2/3 space-y-5">
                  {/* Basic Information Section */}
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm font-medium text-blue-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      ข้อมูลพื้นฐาน
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text text-gray-600 text-xs font-medium">รหัสผู้ใช้งาน</span>
                        </label>
                        <input
                          type="text"
                          name="user_code"
                          className="input input-bordered input-xs w-full h-9 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                          value={formData.user_code}
                          onChange={handleChange}
                          disabled
                        />
                        <p className="text-xs text-gray-400 mt-1">ระบบจะสร้างรหัสผู้ใช้โดยอัตโนมัติ</p>
                      </div>
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text text-gray-600 text-xs font-medium">ชื่อผู้ใช้งาน <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="ระบุชื่อผู้ใช้งาน"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text text-gray-600 text-xs font-medium">อีเมล <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@domain.com"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text text-gray-600 text-xs font-medium">เบอร์โทรศัพท์ <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0812345678"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm font-medium text-blue-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      ข้อมูลที่อยู่
                    </h3>
                    <div className="grid grid-cols-1 gap-y-3">
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text text-gray-600 text-xs font-medium">ที่อยู่</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="บ้านเลขที่, ถนน, ซอย"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                        <div className="form-control">
                          <label className="label py-0.5">
                            <span className="label-text text-gray-600 text-xs font-medium">เขต/อำเภอ</span>
                          </label>
                          <input
                            type="text"
                            name="county"
                            className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                            value={formData.county}
                            onChange={handleChange}
                            placeholder="เขต/อำเภอ"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-0.5">
                            <span className="label-text text-gray-600 text-xs font-medium">จังหวัด</span>
                          </label>
                          <input
                            type="text"
                            name="locality"
                            className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                            value={formData.locality}
                            onChange={handleChange}
                            placeholder="จังหวัด"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-0.5">
                            <span className="label-text text-gray-600 text-xs font-medium">รหัสไปรษณีย์</span>
                          </label>
                          <input
                            type="text"
                            name="postal_no"
                            className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                            value={formData.postal_no}
                            onChange={handleChange}
                            placeholder="10110"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm font-medium text-blue-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      ข้อมูลความปลอดภัย
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text text-gray-600 text-xs font-medium">รหัสผ่าน <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="input input-bordered input-xs w-full h-9 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition-all duration-200"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="รหัสผ่าน"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm rounded-md px-5 text-gray-700 hover:bg-gray-100"
                  onClick={onClose}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary btn-sm text-white rounded-md px-6 shadow-md hover:shadow-lg transition-all duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isFormValid}
                >
                  เพิ่มผู้ใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}