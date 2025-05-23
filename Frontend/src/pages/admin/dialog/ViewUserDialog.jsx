import { useEffect, useState } from "react";
import {
    FaBook,
    FaBuilding,
    FaEnvelope,
    FaIdCard,
    FaMapMarkerAlt,
    FaPhone,
    FaUser
} from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function ViewUserDialog({ open, onClose, userData }) {
  const [formData, setFormData] = useState({
    user_id: "",
    student_id: "",
    username: "",
    fullname: "",
    pic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    email: "",
    phone: "",
    position: "",
    department: "",
    currentAddress: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
    password: ""
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        user_id: userData.user_id || "",
        student_id: userData.student_id || "",
        username: userData.username || "",
        fullname: userData.fullname || "",
        pic: userData.pic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        email: userData.email || "",
        phone: userData.phone || "",
        position: userData.position || "",
        department: userData.department || "",
        currentAddress: userData.currentAddress || "",
        province: userData.province || "",
        district: userData.district || "",
        subdistrict: userData.subdistrict || "",
        postalCode: userData.postalCode || "",
        password: ""
      });
      if (userData.pic) {
        setPreviewImage(userData.pic);
      } else {
        setPreviewImage("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
      }
    }
  }, [userData]);

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-h-[90vh] max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden animate-fadeIn transition-all duration-300 transform overflow-y-auto">
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
          <div className="flex flex-col items-center justify-start pt-16 px-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 md:min-w-[280px] ">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-blue-800 text-center mb-2">รูปโปรไฟล์</h3>
              <p className="text-xs text-gray-500 text-center">รูปภาพโปรไฟล์ผู้ใช้งาน</p>
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
            </div>
          </div>

          {/* Right: Header + Form */}
          <div className="flex-1 flex flex-col justify-start px-8 md:px-10 bg-gradient-to-br from-white to-gray-50">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-2">
                ข้อมูลผู้ใช้งาน
              </h2>
            </div>
            <form className="space-y-8">
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
                        รหัสนิสิต
                      </label>
                      <input
                        type="text"
                        name="student_id"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                        value={formData.student_id}
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="w-4 h-4 mr-2 text-blue-500" />
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                        value={formData.fullname}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FaBuilding className="w-4 h-4 mr-2 text-blue-500" />
                          ตำแหน่ง
                        </label>
                        <input
                          type="text"
                          name="position"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                          value={formData.position}
                          readOnly
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FaBook className="w-4 h-4 mr-2 text-blue-500" />
                          สาขา
                        </label>
                        <input
                          type="text"
                          name="department"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                          value={formData.department}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="w-4 h-4 mr-2 text-blue-500" />
                        ชื่อผู้ใช้งาน
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                        value={formData.username}
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaEnvelope className="w-4 h-4 mr-2 text-blue-500" />
                        อีเมล
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                        value={formData.email}
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaPhone className="w-4 h-4 mr-2 text-blue-500" />
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                        value={formData.phone}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                {/* Right: Address & Security */}
                <div className="space-y-5 bg-white p-2 rounded-2xl transition-all duration-300 border border-gray-50">
                  <div className="flex items-center space-x-2 pb-3 mb-1">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">ที่อยู่</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ปัจจุบัน</label>
                      <textarea
                        name="currentAddress"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                        rows="3"
                        value={formData.currentAddress}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                        <input
                          type="text"
                          name="province"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                          value={formData.province}
                          readOnly
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ</label>
                        <input
                          type="text"
                          name="district"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                          value={formData.district}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ตำบล</label>
                        <input
                          type="text"
                          name="subdistrict"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                          value={formData.subdistrict}
                          readOnly
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                        <input
                          type="text"
                          name="postalCode"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                          value={formData.postalCode}
                          readOnly
                          disabled
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
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 