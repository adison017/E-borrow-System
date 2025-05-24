import { useEffect, useRef, useState } from "react";
import {
    FaBook,
    FaBuilding,
    FaEnvelope,
    FaIdCard,
    FaLock,
    FaMapMarkerAlt,
    FaPhone,
    FaUser
} from "react-icons/fa";
import { MdClose, MdCloudUpload } from "react-icons/md";

export default function AddUserDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState(initialFormData || {
    student_id: "",
    username: "",
    fullname: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    password: "",
    currentAddress: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
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
      student_id: "",
      username: "",
      fullname: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      password: "",
      currentAddress: "",
      province: "",
      district: "",
      subdistrict: "",
      postalCode: "",
      pic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    });
  }, [initialFormData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, pic: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isFormValid = formData.username && formData.fullname && formData.email && formData.phone && formData.password;

  if (!open) return null;
  
  return (
    <div className="modal modal-open">
      <div className="modal-box relative w-full max-h-[90vh] max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden animate-fadeIn transition-all duration-300 transform overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 z-10 transition-all duration-200 transform hover:rotate-90"
          aria-label="ปิด"
        >
          <MdClose className="w-7 h-7" />
        </button>

        {/* Main Content: 2 columns */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Profile Image */}
          <div className="flex flex-col items-center justify-start pt-13 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 md:min-w-[280px] ">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-800 text-center mb-2">เพิ่มผู้ใช้งานใหม่</h2>
              <h3 className="text-lg font-bold text-blue-800 text-center mb-2">รูปโปรไฟล์</h3>
              <p className="text-xs text-gray-500 text-center">อัพโหลดรูปภาพสำหรับใช้เป็นรูปโปรไฟล์</p>
            </div>
            <div className="w-36 h-36 rounded-full bg-white shadow-lg flex items-center justify-center relative group overflow-hidden border-4 border-white hover:border-blue-200 transition-all duration-300">
              <img
                src={previewImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
              <label htmlFor="profile-upload" className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full">
                <MdCloudUpload className="w-8 h-8 text-white mb-1" />
                <span className="text-xs font-medium text-white bg-blue-600/80 hover:bg-blue-700 px-3 py-1.5 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">เปลี่ยนรูป</span>
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
              <span className="text-xs text-gray-500 max-w-full truncate px-3 bg-white/70 py-1.5 rounded-full mt-4 shadow-sm border border-gray-100">{formData.pic.name}</span>
            )}
          </div>

          {/* Right: Header + Form */}
          <div className="flex-1 flex flex-col justify-start px-8 md:px-10 bg-gradient-to-br from-white to-gray-50">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-2">
                {initialFormData ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: User Info */}
                <div className="space-y-5 bg-white p-1 rounded-2xl transition-all duration-300 border border-gray-50">
                  <div className="flex items-center space-x-2 pb-3 mb-1 border-b border-gray-100">
                    <FaUser className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">ข้อมูลผู้ใช้งาน</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaIdCard className="w-4 h-4 mr-2 text-blue-500" />
                        รหัสนิสิต <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="student_id"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.student_id}
                        onChange={handleChange}
                        placeholder="เช่น 64010123"
                        required
                      /> 
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="w-4 h-4 mr-2 text-blue-500" />
                        ชื่อ-นามสกุล <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="ระบุชื่อ-นามสกุล"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FaBuilding className="w-4 h-4 mr-2 text-blue-500" />
                          ตำแหน่ง <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="position"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                          value={formData.position}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>เลือกตำแหน่ง</option>
                          <option value="นิสิต">นิสิต</option>
                          <option value="บุคลากร">บุคลากร</option>
                          <option value="อาจารย์">อาจารย์</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FaBook className="w-4 h-4 mr-2 text-blue-500" />
                          สาขา <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="department"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                          value={formData.department}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>เลือกสาขา</option>
                          <option value="วิทยาการคอมพิวเตอร์">วิทยาการคอมพิวเตอร์</option>
                          <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
                          <option value="ภูมิสารสนเทศศาสตร์">ภูมิสารสนเทศศาสตร์</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="w-4 h-4 mr-2 text-blue-500" />
                        ชื่อผู้ใช้งาน <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="ระบุชื่อผู้ใช้งาน"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaLock className="w-4 h-4 mr-2 text-blue-500" />
                        รหัสผ่าน <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="รหัสผ่าน"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaEnvelope className="w-4 h-4 mr-2 text-blue-500" />
                        อีเมล <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@domain.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaPhone className="w-4 h-4 mr-2 text-blue-500" />
                        เบอร์โทรศัพท์ <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full pl-4 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0812345678"
                          required
                        />
                      </div>
                    </div>
                    
                   
                    
                    
                  </div>
                </div>
                
                {/* Right: Address & Security */}
                <div className="space-y-5 bg-white p-2 rounded-2xl transition-all duration-300 ">
                  <div className="flex items-center space-x-2 pb-3 mb-1 ">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">ที่อยู่</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ปัจจุบัน</label>
                      <textarea
                        name="currentAddress"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        rows="3"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        placeholder="ที่อยู่ปัจจุบัน"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                        <select
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        >
                          <option value="" disabled>เลือกจังหวัด</option>
                          {['มหาสารคาม', 'ชัยภูมิ', 'ขอนแก่น'].map(opt =>
                            <option key={opt} value={opt}>{opt}</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ</label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        >
                          <option value="" disabled>เลือกอำเภอ</option>
                          {['กันทรวิชัย', 'เมือง'].map(opt =>
                            <option key={opt} value={opt}>{opt}</option>
                          )}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ตำบล</label>
                        <select
                          name="subdistrict"
                          value={formData.subdistrict}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        >
                          <option value="" disabled>เลือกตำบล</option>
                          {['ขามเรียง', 'ท่าขอนยาง', 'คันธารราษฎร์'].map(opt =>
                            <option key={opt} value={opt}>{opt}</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                        <input
                          type="text"
                          name="postalCode"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="10110"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex justify-end gap-4 pb-6">
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200 shadow-sm"
                  onClick={onClose}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`px-8 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:-translate-y-0.5 transition-all duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isFormValid}
                >
                  {initialFormData ? 'อัปเดตผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}