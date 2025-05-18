import axios from 'axios';
import React, { useState } from 'react';

const PersonalInfoEdit = () => {
  const [formData, setFormData] = useState({
    profileImage: '/logo_it.png',
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
    <div data-theme="light" className="container mx-auto max-w-8xl py-10 px-4 sm:px-6">
      <div className="card bg-white rounded-2xl overflow-hidden">
        <div className="card-body p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4 border-b-0 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">แก้ไขข้อมูลส่วนตัว</h2>
              <p className="text-gray-500 mt-1">ปรับปรุงข้อมูลโปรไฟล์ของคุณ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image and Basic Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Profile Image Column */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพประจำตัว</label>
                  <label className="relative group cursor-pointer" htmlFor="profile-upload">
                    <div className="w-52 h-52 mx-auto rounded-full bg-white overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 transform border-0 flex items-center justify-center">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                        <div className="text-white text-center p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-medium block mt-2 bg-primary/90 py-1 px-3 rounded-full backdrop-blur-sm shadow-lg">เปลี่ยนรูป</span>
                        </div>
                      </div>
                      <input
                        id="profile-upload"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/jpeg, image/png"
                        onChange={handleImageChange}
                        tabIndex={-1}
                      />
                    </div>
                  </label>
                  {formData.profileImage && typeof formData.profileImage !== 'string' && (
                    <span className="text-xs text-gray-600 mt-1">{formData.profileImage.name}</span>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-3 bg-white px-4 py-2 rounded-full shadow-sm">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
                </div>
              </div>

              {/* Basic Info Column */}
              <div className="lg:col-span-2 item-center justify-between">
                <div className="bg-gradient-to-br from-white to-gray-50 p-7 rounded-2xl space-y-5 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 border-b-0 pb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ข้อมูลพื้นฐาน
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">รหัสนิสิต/บุคลากร</span>
                      </label>
                      <input
                        type="text"
                        name="idNumber"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">ชื่อ-นามสกุล</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">ชื่อผู้ใช้งาน</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">รหัสผ่าน</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 p-7 rounded-2xl space-y-5 mt-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 border-b-0 pb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    ข้อมูลติดต่อ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">อีเมล</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">เบอร์โทร</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium">+66</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          className="input input-bordered w-full pl-14 focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 p-7 rounded-2xl space-y-5 mt-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 border-b-0 pb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ที่อยู่
                  </h3>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-700 font-medium">ที่อยู่ปัจจุบัน</span>
                    </label>
                    <textarea
                      name="currentAddress"
                      className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                      rows="3"
                      value={formData.currentAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">จังหวัด</span>
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                      >
                        {['มหาสารคาม', 'ชัยภูมิ', 'ขอนแก่น'].map(opt =>
                          <option key={opt} value={opt}>{opt}</option>
                        )}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">อำเภอ</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                      >
                        {['กันทรวิชัย', 'เมือง'].map(opt =>
                          <option key={opt} value={opt}>{opt}</option>
                        )}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">ตำบล</span>
                      </label>
                      <select
                        name="subdistrict"
                        value={formData.subdistrict}
                        onChange={handleChange}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                      >
                        {['ขามเรียง', 'ท่าขอนยาง', 'คันธารราษฎร์'].map(opt =>
                          <option key={opt} value={opt}>{opt}</option>
                        )}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">รหัสไปรษณีย์</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 md:flex-row justify-end items-center mt-10">
              <button
                type="button"
                className="btn btn-outline btn-md hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl shadow-sm px-7 py-3 h-auto transition-all duration-200 border-0"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className={`btn btn-primary btn-md text-white hover:bg-primary-dark shadow-lg rounded-xl px-9 py-3 h-auto transition-all duration-300 ${isLoading ? 'loading' : ''} border-0`}
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
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <dialog id="success-alert" className="modal">
        <div className="modal-box max-w-sm text-center rounded-2xl shadow-2xl bg-white">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-2xl text-gray-800 mb-3">สำเร็จ!</h3>
          <p className="py-4 text-gray-600">ข้อมูลถูกอัปเดตเรียบร้อยแล้ว</p>
          <form method="dialog" className="modal-action justify-center">
            <button className="btn btn-primary text-white px-10 py-3 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">ตกลง</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Error Dialog */}
      <dialog id="error-alert" className="modal">
        <div className="modal-box max-w-sm text-center rounded-2xl shadow-2xl bg-white">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-2xl text-gray-800 mb-3">เกิดข้อผิดพลาด!</h3>
          <p className="py-4 text-gray-600">ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองอีกครั้ง</p>
          <form method="dialog" className="modal-action justify-center">
            <button className="btn btn-primary text-white px-10 py-3 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">ตกลง</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default PersonalInfoEdit;