import React, { useState } from 'react';
import axios from 'axios';

const PersonalInfoEdit = () => {
  const [formData, setFormData] = useState({
    profileImage: '/pro.jpg',
    idNumber: '65011211033',
    fullName: 'อดิศร หนูกลาง',
    username: 'adison300',
    password: 'oat12345',
    email: 'oat@gmail.com',
    phone: '0986286323',
    currentAddress: '141 ทีทีแมนชั่น',
    province: 'มหาสารคาม',
    district: 'กันทรวิชัย',
    subdistrict: 'ขามเรียง',
    postalCode: '44000'
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const displayImage = previewImage || 
  (typeof formData.profileImage === 'string' ? formData.profileImage : null);

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    // ตรวจสอบขนาดไฟล์ไม่เกิน 2MB
    if (file.size > 2 * 1024 * 1024) {
    alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB');
    return;
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
    alert('รองรับเฉพาะไฟล์ JPG และ PNG');
    return;
    }

    setFormData(prev => ({ ...prev, profileImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
    setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      await axios.put('/api/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      document.getElementById('success-alert').showModal();
    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
      document.getElementById('error-alert').showModal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-8xl">
      <div className="card bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="card-body p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">แก้ไขข้อมูลส่วนตัว</h2>
              <p className="text-gray-500 mt-1">ปรับปรุงข้อมูลโปรไฟล์ของคุณ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image and Basic Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Image Column */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700">รูปภาพประจำตัว</label>
                  <div className="relative w-40 h-40 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden shadow-sm hover:border-primary transition-colors duration-200">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = process.env.PUBLIC_URL + '/profile-default.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <label className="cursor-pointer w-full">
                    <div className="btn btn-outline btn-primary btn-block btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {previewImage ? 'เปลี่ยนรูปภาพ' : 'อัปโหลดรูปภาพ'}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg, image/png" 
                      onChange={handleImageChange} 
                    />
                  </label>
                  <p className="text-xs text-gray-500 text-center">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
                </div>
              </div>

              {/* Basic Info Column */}
              <div className="lg:col-span-2 item-center justify-between">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ข้อมูลพื้นฐาน
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700">รหัสนิสิต/บุคลากร</span>
                      </label>
                      <input 
                        type="text" 
                        name="idNumber" 
                        className="input-neutral input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-9 rounded-xl border-gray-300" 
                        value={formData.idNumber} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700">ชื่อ-นามสกุล</span>
                      </label>
                      <input 
                        type="text" 
                        name="fullName" 
                        className="input-neutral input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-9 rounded-xl border-gray-300" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700">ชื่อผู้ใช้งาน</span>
                      </label>
                      <input 
                        type="text" 
                        name="username" 
                        className="input-neutral input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-9 rounded-xl border-gray-300" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700">รหัสผ่าน</span>
                      </label>
                      <input 
                        type="password" 
                        name="password" 
                        className="input-neutral input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-9 rounded-xl border-gray-300" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ข้อมูลติดต่อ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700">อีเมล</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input-neutral input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-9 rounded-xl border-gray-300" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700">เบอร์โทร</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                      <span className="text-gray-500">+66</span>
                    </div>
                    <input 
                      type="tel" 
                      name="phone" 
                      className="input-neutral input-bordered w-full pl-12 focus:ring-2 focus:ring-primary focus:border-transparent h-9 rounded-xl border-gray-300" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ที่อยู่
              </h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">ที่อยู่ปัจจุบัน</span>
                </label>
                <textarea 
                  name="currentAddress" 
                  className="textarea-neutral textarea-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl border-gray-300" 
                  rows="3" 
                  value={formData.currentAddress} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700">จังหวัด</span>
                  </label>
                  <select 
                    name="province" 
                    value={formData.province} 
                    onChange={handleChange} 
                    className="select-neutral select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl border-gray-300"
                  >
                    {['มหาสารคาม', 'ชัยภูมิ', 'ขอนแก่น'].map(opt => 
                      <option key={opt} value={opt}>{opt}</option>
                    )}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700">อำเภอ</span>
                  </label>
                  <select 
                    name="district" 
                    value={formData.district} 
                    onChange={handleChange} 
                    className="select-neutral select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl border-gray-300"
                  >
                    {['กันทรวิชัย', 'เมือง'].map(opt => 
                      <option key={opt} value={opt}>{opt}</option>
                    )}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700">ตำบล</span>
                  </label>
                  <select 
                    name="subdistrict" 
                    value={formData.subdistrict} 
                    onChange={handleChange} 
                    className="select-neutral select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl border-gray-300"
                  >
                    {['ขามเรียง', 'ท่าขอนยาง', 'คันธารราษฎร์'].map(opt => 
                      <option key={opt} value={opt}>{opt}</option>
                    )}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700">รหัสไปรษณีย์</span>
                  </label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    className="input-neutral input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl border-gray-300" 
                    value={formData.postalCode} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="flex  gap-2 mt-auto md:flex-row justify-between items-center md:w-auto mt-6">
              <button 
                type="button" 
                className="btn btn-outline btn-sm md:btn-md border-gray-700 hover:bg-red-600 hover:text-white flex-2 rounded-xl border-gray-300"
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary btn-sm md:btn-md text-white hover:bg-primary90 flex-2 shadow-md rounded-xl ${isLoading ? 'loading' : ''}`} 
                disabled={isLoading}
              >
                {isLoading ? (
                  'กำลังบันทึก...'
                ) : (
                  <>
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </button>
            </div>
              </div>
            </div>
            
            
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <dialog id="success-alert" className="modal">
        <div className="modal-box max-w-sm text-center rounded-lg">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-gray-800">สำเร็จ!</h3>
          <p className="py-4 text-gray-600">ข้อมูลถูกอัปเดตเรียบร้อยแล้ว</p>
          <form method="dialog" className="modal-action justify-center">
            <button className="btn btn-primary text-white px-8 rounded-lg">ตกลง</button>
          </form>
        </div>
      </dialog>

      {/* Error Dialog */}
      <dialog id="error-alert" className="modal">
        <div className="modal-box max-w-sm text-center rounded-lg">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-gray-800">เกิดข้อผิดพลาด!</h3>
          <p className="py-4 text-gray-600">ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองอีกครั้ง</p>
          <form method="dialog" className="modal-action justify-center">
            <button className="btn btn-primary text-white px-8 rounded-lg">ตกลง</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default PersonalInfoEdit;