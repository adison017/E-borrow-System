import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

export default function EditUserDialog({ open, onClose, userData, onSave }) {
  const [formData, setFormData] = useState({
    user_id: "",
    student_id: "",
    username: "",
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
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        user_id: userData.user_id || "",
        student_id: userData.student_id || "",
        username: userData.username || "",
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

  const isFormValid = formData.username && formData.email && formData.phone;

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 z-10 transition"
            aria-label="ปิด"
          >
            <MdClose className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-2 relative group overflow-hidden">
              <img
                src={previewImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-blue-200"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
              <label htmlFor="profile-upload-edit" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <span className="text-xs text-white bg-blue-600 px-2 py-1 rounded shadow">เปลี่ยนรูป</span>
              </label>
              <input
                id="profile-upload-edit"
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            {formData.pic && typeof formData.pic !== 'string' && (
              <span className="text-xs text-gray-500 text-center max-w-full truncate px-2">{formData.pic.name}</span>
            )}
            <h2 className="text-xl font-bold text-blue-700 mt-2">แก้ไขผู้ใช้งาน</h2>
            <p className="text-xs text-gray-500 mt-1 mb-2">กรอกข้อมูลผู้ใช้งานให้ครบถ้วน</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: User Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนิสิต <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="student_id"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="เช่น 64010123"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้งาน <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="username"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="ระบุชื่อผู้ใช้งาน"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง <span className="text-red-500">*</span></label>
                  <select
                    name="position"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">สาขา <span className="text-red-500">*</span></label>
                  <select
                    name="department"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
              {/* Right: Address & Security */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ปัจจุบัน</label>
                  <textarea
                    name="currentAddress"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    rows="2"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    >
                      <option value="" disabled>เลือกจังหวัด</option>
                      {["มหาสารคาม", "ชัยภูมิ", "ขอนแก่น"].map(opt =>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    >
                      <option value="" disabled>เลือกอำเภอ</option>
                      {["กันทรวิชัย", "เมือง"].map(opt =>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    >
                      <option value="" disabled>เลือกตำบล</option>
                      {["ขามเรียง", "ท่าขอนยาง", "คันธารราษฎร์"].map(opt =>
                        <option key={opt} value={opt}>{opt}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="10110"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="รหัสผ่าน"
                  />
                  <span className="text-xs text-gray-400">(เว้นว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน)</span>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onClick={onClose}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isFormValid}
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}