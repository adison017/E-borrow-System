import axios from 'axios';
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
import Swal from 'sweetalert2';

export default function AddUserDialog({
  open,
  onClose,
  initialFormData,
  onSave
}) {
  const [formData, setFormData] = useState({
    user_code: "",
    username: "",
    Fullname: "",
    email: "",
    phone: "",
    position_name: "",
    branch_name: "",
    position_id: "",
    branch_id: "",
    role_id: "",
    role_name: "",
    street: "",
    province: "",
    district: "",
    parish: "",
    postal_no: "",
    password: "",
    pic: "logo_it.png"
  });
  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined
  });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("/logo_it.png");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsResponse, branchesResponse, rolesResponse, provincesResponse] = await Promise.all([
          axios.get('http://localhost:5000/users/positions'),
          axios.get('http://localhost:5000/users/branches'),
          axios.get('http://localhost:5000/users/roles'),
          fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json').then(res => res.json())
        ]);

        if (!positionsResponse.data) throw new Error('Failed to fetch positions');
        if (!branchesResponse.data) throw new Error('Failed to fetch branches');
        if (!rolesResponse.data) throw new Error('Failed to fetch roles');

        setPositions(positionsResponse.data);
        setBranches(branchesResponse.data);
        setRoles(rolesResponse.data);
        setProvinces(provincesResponse);

        console.log('Fetched data:', {
          positions: positionsResponse.data,
          branches: branchesResponse.data,
          roles: rolesResponse.data,
          provinces: provincesResponse
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (initialFormData) {
      setFormData({
        user_code: initialFormData.user_code || "",
        username: initialFormData.username || "",
        Fullname: initialFormData.Fullname || "",
        email: initialFormData.email || "",
        phone: initialFormData.phone || "",
        position_name: initialFormData.position_name || "",
        branch_name: initialFormData.branch_name || "",
        position_id: initialFormData.position_id || "",
        branch_id: initialFormData.branch_id || "",
        role_id: initialFormData.role_id || "",
        role_name: initialFormData.role_name || "",
        street: initialFormData.street || "",
        province: initialFormData.province || "",
        district: initialFormData.district || "",
        parish: initialFormData.parish || "",
        postal_no: initialFormData.postal_no || "",
        password: "",
        pic: initialFormData.pic || "logo_it.png"
      });
      setPreviewImage(initialFormData.pic || "/logo_it.png");
    } else {
      setFormData({
        user_code: "",
        username: "",
        Fullname: "",
        email: "",
        phone: "",
        position_name: "",
        branch_name: "",
        position_id: "",
        branch_id: "",
        role_id: "",
        role_name: "",
        street: "",
        province: "",
        district: "",
        parish: "",
        postal_no: "",
        password: "",
        pic: "logo_it.png"
      });
      setPreviewImage("/logo_it.png");
    }
  }, [initialFormData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Handling change for:', name, 'with value:', value);

    if (name === 'position_name') {
      const selectedPosition = positions.find(p => p.position_name === value);
      console.log('Selected position:', selectedPosition);
      setFormData(prev => ({
        ...prev,
        position_name: value,
        position_id: selectedPosition ? selectedPosition.position_id : prev.position_id
      }));
    } else if (name === 'branch_name') {
      const selectedBranch = branches.find(b => b.branch_name === value);
      console.log('Selected branch:', selectedBranch);
      setFormData(prev => ({
        ...prev,
        branch_name: value,
        branch_id: selectedBranch ? selectedBranch.branch_id : prev.branch_id
      }));
    } else if (name === 'role_name') {
      const selectedRole = roles.find(r => r.role_name === value);
      console.log('Selected role:', selectedRole);
      setFormData(prev => ({
        ...prev,
        role_name: value,
        role_id: selectedRole ? selectedRole.role_id : prev.role_id
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        Swal.fire({
          icon: 'error',
          title: 'ขนาดไฟล์ใหญ่เกินไป',
          text: `ไฟล์มีขนาด ${fileSizeMB} MB\nขนาดไฟล์ต้องไม่เกิน 2 MB`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        Swal.fire({
          icon: 'error',
          title: 'รูปแบบไฟล์ไม่ถูกต้อง',
          text: 'รองรับเฉพาะไฟล์ JPG และ PNG เท่านั้น',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setFormData(prev => ({ ...prev, pic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (event, type) => {
    const value = event.target.value;
    const id = Number(value);

    if (type === 'province') {
      setAmphures([]);
      setTambons([]);
      setSelected({
        province_id: id,
        amphure_id: undefined,
        tambon_id: undefined
      });
      if (id) {
        const province = provinces.find(p => p.id === id);
        if (province) {
          setAmphures(province.amphure);
          setFormData(prev => ({
            ...prev,
            province: province.name_th,
            district: '',
            parish: '',
            postal_no: ''
          }));
        }
      }
    } else if (type === 'amphure') {
      setTambons([]);
      setSelected(prev => ({
        ...prev,
        amphure_id: id,
        tambon_id: undefined
      }));
      if (id) {
        const amphure = amphures.find(a => a.id === id);
        if (amphure) {
          setTambons(amphure.tambon);
          setFormData(prev => ({
            ...prev,
            district: amphure.name_th,
            parish: '',
            postal_no: ''
          }));
        }
      }
    } else if (type === 'tambon') {
      setSelected(prev => ({
        ...prev,
        tambon_id: id
      }));
      if (id) {
        const tambon = tambons.find(t => t.id === id);
        if (tambon) {
          setFormData(prev => ({
            ...prev,
            parish: tambon.name_th,
            postal_no: tambon.zip_code
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. สร้าง user ก่อน
      const position = positions.find(p => p.position_name === formData.position_name);
      const branch = branches.find(b => b.branch_name === formData.branch_name);
      const role = roles.find(r => r.role_name === formData.role_name);

      console.log('Selected data:', {
        position,
        branch,
        role,
        formData
      });

      const userDataToSave = {
        user_code: formData.user_code,
        username: formData.username,
        Fullname: formData.Fullname,
        email: formData.email,
        phone: formData.phone,
        position_id: position?.position_id || null,
        branch_id: branch?.branch_id || null,
        role_id: role?.role_id || null,
        street: formData.street || '',
        parish: formData.parish || '',
        district: formData.district || '',
        province: formData.province || '',
        postal_no: formData.postal_no || '',
        avatar: `${formData.user_code}.jpg`,
        password: formData.password || undefined
      };

      console.log('=== AddUserDialog: Creating User ===');
      console.log('User Data:', userDataToSave);

      const response = await axios.post('http://localhost:5000/users', userDataToSave, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('ไม่ได้รับข้อมูลการตอบกลับจาก server');
      }

      // 2. ถ้ามีการเลือกไฟล์รูปภาพใหม่ ให้อัพโหลดรูป
      if (formData.pic instanceof File) {
        const formDataImage = new FormData();
        formDataImage.append('user_code', formData.user_code);
        formDataImage.append('avatar', formData.pic);

        console.log('Uploading image with user_code:', formData.user_code);

        try {
          const uploadResponse = await axios.post('http://localhost:5000/users/upload-image', formDataImage, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          console.log('Image upload response:', uploadResponse.data);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Swal.fire({
            icon: 'warning',
            title: 'อัพโหลดรูปภาพไม่สำเร็จ',
            text: uploadError.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ\nแต่ข้อมูลผู้ใช้ถูกบันทึกแล้ว',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#3085d6'
          });
        }
      }

      // Dispatch event to notify about new user
      const event = new CustomEvent('userDataUpdated', {
        detail: response.data
      });
      window.dispatchEvent(event);

      Swal.fire({
        icon: 'success',
        title: 'เพิ่มผู้ใช้งานสำเร็จ',
        text: 'ข้อมูลผู้ใช้งานถูกเพิ่มเรียบร้อยแล้ว',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6'
      });
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating user:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Handle specific error cases
      if (error.response?.data?.field) {
        // Handle field-specific errors
        const fieldMessages = {
          user_code: 'รหัสนิสิตนี้ถูกใช้งานแล้ว',
          username: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว',
          email: 'อีเมลนี้ถูกใช้งานแล้ว'
        };
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเพิ่มผู้ใช้งานได้',
          text: fieldMessages[error.response.data.field] || error.response.data.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        });
      } else if (error.response?.data?.fields) {
        // Handle missing fields
        const missingFields = error.response.data.fields.join(', ');
        Swal.fire({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          text: `กรุณากรอกข้อมูลในฟิลด์ต่อไปนี้: ${missingFields}`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        });
      } else {
        // Handle other errors
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.username && formData.Fullname && formData.email && formData.phone && formData.password;

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative w-full max-h-[90vh] max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden animate-fadeIn transition-all duration-300 transform overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 z-10 transition-all duration-200 transform hover:rotate-90"
          aria-label="ปิด"
        >
          <MdClose className="w-7 h-7" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="flex flex-col items-center justify-start pt-16 px-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 md:min-w-[280px]">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-800 text-center mb-2">เพิ่มผู้ใช้งานใหม่</h2>
              <h3 className="text-lg font-bold text-blue-800 text-center mb-2">รูปโปรไฟล์</h3>
              <p className="text-xs text-gray-500 text-center">อัพโหลดรูปภาพสำหรับใช้เป็นรูปโปรไฟล์</p>
            </div>
            <div className="w-36 h-36 rounded-full bg-white shadow-lg flex items-center justify-center relative group overflow-hidden border-4 border-white hover:border-blue-200 transition-all duration-300">
              <img
                src={previewImage || "/logo_it.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "/logo_it.png";
                }}
              />
              <label htmlFor="profile-upload-add" className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full">
                <MdCloudUpload className="w-8 h-8 text-white mb-1" />
                <span className="text-xs font-medium text-white bg-blue-600/80 hover:bg-blue-700 px-3 py-1.5 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">เปลี่ยนรูป</span>
              </label>
              <input
                id="profile-upload-add"
                type="file"
                className="hidden"
                accept="image/jpeg, image/png"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            {formData.pic && typeof formData.pic !== 'string' && (
              <span className="text-xs text-gray-500 max-w-full truncate px-3 bg-white/70 py-1.5 rounded-full mt-4 shadow-sm border border-gray-100">{formData.pic.name}</span>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-start px-8 md:px-10 bg-gradient-to-br from-white to-gray-50">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-2">
                เพิ่มผู้ใช้งานใหม่
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        name="user_code"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.user_code}
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
                        name="Fullname"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        value={formData.Fullname}
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
                          name="position_name"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                          value={formData.position_name}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>เลือกตำแหน่ง</option>
                          {positions.map(position => (
                            <option key={position.position_id} value={position.position_name}>
                              {position.position_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FaBook className="w-4 h-4 mr-2 text-blue-500" />
                          สาขา <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="branch_name"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                          value={formData.branch_name}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>เลือกสาขา</option>
                          {branches.map(branch => (
                            <option key={branch.branch_id} value={branch.branch_name}>
                              {branch.branch_name}
                            </option>
                          ))}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUser className="w-4 h-4 mr-2 text-blue-500" />
                        บทบาท <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="role_name"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        value={formData.role_name}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>เลือกบทบาท</option>
                        {roles.map(role => (
                          <option key={role.role_id} value={role.role_name}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 bg-white p-2 rounded-2xl transition-all duration-300 border border-gray-50">
                  <div className="flex items-center space-x-2 pb-3 mb-1">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">ที่อยู่</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ปัจจุบัน</label>
                      <textarea
                        name="street"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                        rows="3"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="ที่อยู่ปัจจุบัน"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                        <select
                          name="province"
                          value={selected.province_id || ''}
                          onChange={(e) => handleAddressChange(e, 'province')}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        >
                          <option value="">เลือกจังหวัด</option>
                          {provinces.map(province => (
                            <option key={province.id} value={province.id}>
                              {province.name_th}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ</label>
                        <select
                          name="district"
                          value={selected.amphure_id || ''}
                          onChange={(e) => handleAddressChange(e, 'amphure')}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        >
                          <option value="">เลือกอำเภอ</option>
                          {amphures.map(amphure => (
                            <option key={amphure.id} value={amphure.id}>
                              {amphure.name_th}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ตำบล</label>
                        <select
                          name="parish"
                          value={selected.tambon_id || ''}
                          onChange={(e) => handleAddressChange(e, 'tambon')}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white appearance-none"
                        >
                          <option value="">เลือกตำบล</option>
                          {tambons.map(tambon => (
                            <option key={tambon.id} value={tambon.id}>
                              {tambon.name_th}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                        <input
                          type="text"
                          name="postal_no"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-300 bg-white"
                          value={formData.postal_no}
                          onChange={handleChange}
                          placeholder="10110"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                  className={`px-8 py-2 text-sm font-medium text-white rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:-translate-y-0.5 transition-all duration-200 ${
                    isLoading
                      ? 'bg-green-500 hover:bg-green-600 cursor-wait'
                      : isFormValid
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังบันทึก...
                    </div>
                  ) : 'เพิ่มผู้ใช้งาน'}
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