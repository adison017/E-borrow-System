import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import { globalUpdateProfileImage } from '../../components/Header';

const PersonalInfoEdit = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    user_code: "",
    username: "",
    Fullname: "",
    pic: "/logo_it.png",
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
    password: ""
  });

  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessDialog = () => {
    const dialog = document.getElementById('success-alert');
    if (dialog) {
      dialog.showModal();
    }
  };

  const showErrorDialog = () => {
    const dialog = document.getElementById('error-alert');
    if (dialog) {
      dialog.showModal();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsResponse, branchesResponse, rolesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users/positions'),
          axios.get('http://localhost:5000/api/users/branches'),
          axios.get('http://localhost:5000/api/users/roles')
        ]);

        if (!positionsResponse.data) throw new Error('Failed to fetch positions');
        if (!branchesResponse.data) throw new Error('Failed to fetch branches');
        if (!rolesResponse.data) throw new Error('Failed to fetch roles');

        setPositions(positionsResponse.data);
        setBranches(branchesResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // หลัง setPositions, setBranches ใน fetchData
  useEffect(() => {
    if (positions.length && formData.position_id && !formData.position_name) {
      const pos = positions.find(p => String(p.position_id) === String(formData.position_id));
      if (pos) setFormData(prev => ({ ...prev, position_name: pos.position_name }));
    }
    if (branches.length && formData.branch_id && !formData.branch_name) {
      const br = branches.find(b => String(b.branch_id) === String(formData.branch_id));
      if (br) setFormData(prev => ({ ...prev, branch_name: br.branch_name }));
    }
  }, [positions, branches, formData.position_id, formData.branch_id]);

  // 1. ปรับ getAvatarUrl ให้เติม /user/ ถ้า path เป็นชื่อไฟล์
  const getAvatarUrl = (path) => {
    if (!path) return '/logo_it.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/uploads/')) return `http://localhost:5000${path}`;
    // ถ้าเป็นชื่อไฟล์อย่างเดียว
    return `http://localhost:5000/uploads/user/${path}`;
  };

  // Get user info from localStorage
  useEffect(() => {
    // Only run once on mount
    const userStr = localStorage.getItem('user');
    let globalUserData = null;
    if (userStr) {
      try {
        globalUserData = JSON.parse(userStr);
      } catch (e) {}
    }

    if (globalUserData) {
      console.log('=== Initial Data Load ===');
      console.log('Global user data:', globalUserData);
      console.log('Avatar from global data:', globalUserData.avatar);

      const avatarPath = getAvatarUrl(globalUserData.avatar);
      console.log('Generated avatar path:', avatarPath);

      setFormData({
        user_id: globalUserData.user_id,
        user_code: globalUserData.user_code,
        username: globalUserData.username,
        Fullname: globalUserData.Fullname,
        pic: globalUserData.avatar,
        email: globalUserData.email,
        phone: globalUserData.phone || '',
        position_name: globalUserData.position_name || '',
        branch_name: globalUserData.branch_name || '',
        position_id: globalUserData.position_id || '',
        branch_id: globalUserData.branch_id || '',
        role_id: globalUserData.role_id || '',
        role_name: globalUserData.role_name || '',
        street: globalUserData.street || '',
        province: globalUserData.province || '',
        district: globalUserData.district || '',
        parish: globalUserData.parish || '',
        postal_no: globalUserData.postal_no || '',
        password: ''
      });
      console.log('Form data set with avatar:', globalUserData.avatar);
      setPreviewImage(avatarPath);
      console.log('Preview image set to:', avatarPath);
    } else {
      console.log('No global user data available');
    }
  }, []); // <--- Only run once

  // เพิ่ม useEffect สำหรับตรวจสอบการโหลดรูปภาพ
  useEffect(() => {
    if (previewImage && previewImage !== '/logo_it.png') {
      console.log('Checking image availability:', previewImage);
      fetch(previewImage)
        .then(response => {
          if (!response.ok) {
            console.error('Image not available:', previewImage);
            console.error('Response status:', response.status);
            setPreviewImage('/logo_it.png');
          } else {
            console.log('Image is available:', previewImage);
          }
        })
        .catch(error => {
          console.error('Error checking image:', error);
          setPreviewImage('/logo_it.png');
        });
    }
  }, [previewImage]);

  // Add event listener for profile image updates
  useEffect(() => {
    const handleProfileImageUpdate = (event) => {
      if (event.detail && event.detail.imagePath) {
        console.log('Profile image update event received:', event.detail.imagePath);
        setPreviewImage(event.detail.imagePath);
      }
    };

    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  // 2. เพิ่ม state สำหรับจังหวัด/อำเภอ/ตำบล
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined
  });

  // 3. useEffect สำหรับ fetch จังหวัด/อำเภอ/ตำบล
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  // เมื่อ provinces หรือ formData.province/district/parish เปลี่ยน ให้ sync dropdown
  useEffect(() => {
    if (provinces.length && formData.province) {
      const provinceObj = provinces.find(p => p.name_th === formData.province);
      if (provinceObj) {
        setAmphures(provinceObj.amphure);
        let amphure_id, tambon_id;
        if (formData.district) {
          const amphureObj = provinceObj.amphure.find(a => a.name_th === formData.district);
          if (amphureObj) {
            setTambons(amphureObj.tambon);
            amphure_id = amphureObj.id;
            if (formData.parish) {
              const tambonObj = amphureObj.tambon.find(t => t.name_th === formData.parish);
              if (tambonObj) {
                tambon_id = tambonObj.id;
              }
            }
          }
        }
        setSelected({
          province_id: provinceObj.id,
          amphure_id: amphure_id,
          tambon_id: tambon_id
        });
      }
    }
  }, [provinces, formData.province, formData.district, formData.parish]);

  // 4. handleAddressChange สำหรับ province/amphure/tambon
  const handleAddressChange = (event, type) => {
    const value = event.target.value;
    const id = Number(value);
    if (type === 'province') {
      setAmphures([]);
      setTambons([]);
      setSelected({ province_id: id, amphure_id: undefined, tambon_id: undefined });
      const provinceObj = provinces.find(p => p.id === id);
      setFormData(prev => ({
        ...prev,
        province: provinceObj ? provinceObj.name_th : '',
        district: '',
        parish: '',
        postal_no: ''
      }));
      if (provinceObj) setAmphures(provinceObj.amphure);
    } else if (type === 'amphure') {
      setTambons([]);
      setSelected(prev => ({ ...prev, amphure_id: id, tambon_id: undefined }));
      const amphureObj = amphures.find(a => a.id === id);
      setFormData(prev => ({
        ...prev,
        district: amphureObj ? amphureObj.name_th : '',
        parish: '',
        postal_no: ''
      }));
      if (amphureObj) setTambons(amphureObj.tambon);
    } else if (type === 'tambon') {
      setSelected(prev => ({ ...prev, tambon_id: id }));
      const tambonObj = tambons.find(t => t.id === id);
      setFormData(prev => ({
        ...prev,
        parish: tambonObj ? tambonObj.name_th : '',
        postal_no: tambonObj ? tambonObj.zip_code : ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'position_id') {
      const pos = positions.find(p => String(p.position_id) === value);
      setFormData(prev => ({
        ...prev,
        position_id: value,
        position_name: pos ? pos.position_name : ''
      }));
    } else if (name === 'branch_id') {
      const br = branches.find(b => String(b.branch_id) === value);
      setFormData(prev => ({
        ...prev,
        branch_id: value,
        branch_name: br ? br.branch_name : ''
      }));
    } else if (name === 'role_name') {
      const selectedRole = roles.find(r => r.role_name === value);
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
        alert(`ไฟล์มีขนาดใหญ่เกินไป (${fileSizeMB} MB)\nขนาดไฟล์ต้องไม่เกิน 2 MB`);
        return;
      }

      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('รองรับเฉพาะไฟล์ JPG และ PNG เท่านั้น');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let newAvatarPath = formData.pic;
      console.log('=== Starting Image Upload Process ===');
      console.log('Initial formData.pic:', formData.pic);

      if (formData.pic instanceof File) {
        console.log('=== Uploading New Image ===');
        console.log('File details:', {
          name: formData.pic.name,
          type: formData.pic.type,
          size: `${(formData.pic.size / 1024 / 1024).toFixed(2)} MB`
        });

        const formDataImage = new FormData();
        formDataImage.append('user_code', formData.user_code);
        formDataImage.append('avatar', formData.pic);
        console.log('FormData prepared with user_code:', formData.user_code);

        try {
          console.log('Sending upload request to server...');
          const response = await axios.post('http://localhost:5000/api/users/upload-image', formDataImage, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
          });

          console.log('Server response:', response.data);

          if (response.status === 200 && response.data && response.data.filename) {
            newAvatarPath = response.data.filename;
            console.log('New avatar path received:', newAvatarPath);
          } else {
            console.error('Invalid server response:', response.data);
            throw new Error(response.data.message || 'ไม่ได้รับข้อมูลรูปภาพจาก server');
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          console.error('Error details:', {
            message: uploadError.message,
            response: uploadError.response?.data,
            status: uploadError.response?.status
          });
          throw uploadError;
        }
      } else if (typeof formData.pic === 'string') {
        // ถ้าเป็น string (ชื่อไฟล์) ให้ใช้ค่าเดิม
        newAvatarPath = formData.pic;
        console.log('Using existing image path:', newAvatarPath);
      }

      console.log('=== Preparing User Data Update ===');
      const position = positions.find(p => p.position_name === formData.position_name);
      const branch = branches.find(b => b.branch_name === formData.branch_name);
      const role = roles.find(r => r.role_name === formData.role_name);

      console.log('Found references:', {
        position: position ? { id: position.position_id, name: position.position_name } : null,
        branch: branch ? { id: branch.branch_id, name: branch.branch_name } : null,
        role: role ? { id: role.role_id, name: role.role_name } : null
      });

      // --- ก่อนส่ง PUT ---
      console.log('Final avatar to update:', newAvatarPath); // เพิ่ม log ตรวจสอบ
      const userDataToUpdate = {
        user_code: formData.user_code,
        username: formData.username,
        Fullname: formData.Fullname,
        email: formData.email,
        phone: formData.phone || '',
        position_id: position ? position.position_id : formData.position_id,
        branch_id: branch ? branch.branch_id : formData.branch_id,
        street: formData.street || '',
        parish: formData.parish || '',
        district: formData.district || '',
        province: formData.province || '',
        postal_no: formData.postal_no || '',
        avatar: (typeof newAvatarPath === 'string' && newAvatarPath.includes('/') ? newAvatarPath.split('/').pop() : newAvatarPath)
      };
      if (role ? role.role_id : formData.role_id) {
        userDataToUpdate.role_id = role ? role.role_id : formData.role_id;
      }

      if (formData.password) {
        userDataToUpdate.password = formData.password;
      }

      console.log('=== Sending User Data Update ===');
      console.log('Update URL:', `http://localhost:5000/api/users/id/${formData.user_id}`);
      console.log('Update data:', userDataToUpdate);

      const token = localStorage.getItem('token');
      const updateResponse = await axios.put(
        `http://localhost:5000/api/users/id/${formData.user_id}`,
        userDataToUpdate,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        }
      );
      console.log('Update response:', updateResponse.data);

      if (updateResponse.status === 200 && updateResponse.data) {
        console.log('=== Fetching Updated User Data ===');
        const updatedUserResponse = await axios.get(`http://localhost:5000/api/users/id/${formData.user_id}`);
        const updatedUser = updatedUserResponse.data;
        console.log('Updated user data:', updatedUser);

        // Update localStorage user ทันที (เรียลไทม์)
        try {
          localStorage.setItem('user', JSON.stringify({
            ...updatedUser,
            avatar: updatedUser.avatar // อัปเดต avatar ด้วย
          }));
        } catch {}

        // Update local preview image
        const imageUrl = getAvatarUrl(updatedUser.avatar);
        console.log('Setting new image URL:', imageUrl);
        setPreviewImage(imageUrl);

        // Update form data with new image path
        setFormData(prev => ({
          ...prev,
          pic: updatedUser.avatar, // เก็บเฉพาะชื่อไฟล์
          Fullname: updatedUser.Fullname || prev.Fullname
        }));

        console.log('=== Dispatching Update Events ===');
        // Dispatch custom event for user data update
        const event = new CustomEvent('userDataUpdated', {
          detail: {
            userData: {
              ...updatedUser,
              Fullname: updatedUser.Fullname || formData.Fullname
            }
          }
        });
        window.dispatchEvent(event);
        console.log('User data update event dispatched');

        // Dispatch custom event for profile image update
        const imageEvent = new CustomEvent('profileImageUpdated', {
          detail: {
            imagePath: imageUrl
          }
        });
        window.dispatchEvent(imageEvent);
        console.log('Profile image update event dispatched');

        // หากต้องการอัปเดตรูปโปรไฟล์ ให้ใช้ window.dispatchEvent(new CustomEvent('profileImageUpdated', { detail: { imagePath: 'URL' } }))

        console.log('=== Update Process Completed Successfully ===');
        showSuccessDialog();
      } else {
        console.error('No data received from update response');
        throw new Error(updateResponse.data?.message || 'ไม่ได้รับข้อมูลการอัปเดตจาก server');
      }
    } catch (error) {
      console.error('=== Error in Update Process ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      showErrorDialog();
    } finally {
      setIsLoading(false);
      console.log('=== Update Process Ended ===');
    }
  };

  const isFormValid = formData.username && formData.Fullname && formData.email && formData.phone;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      let userId = null;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userId = userObj.user_id;
        } catch {}
      }
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/users/id/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const user = await res.json();
        setFormData(prev => ({
          ...prev,
          user_id: user.user_id,
          user_code: user.user_code,
          username: user.username,
          Fullname: user.Fullname,
          email: user.email,
          phone: user.phone,
          position_id: user.position_id,
          position_name: user.position_name,
          branch_id: user.branch_id,
          branch_name: user.branch_name,
          role_id: user.role_id,
          role_name: user.role_name,
          street: user.street,
          parish: user.parish,
          district: user.district,
          province: user.province,
          postal_no: user.postal_no,
          pic: user.avatar
        }));
      } catch (e) {
        // ignore
      }
    };
    fetchUser();
  }, []);

  return (
    <div data-theme="light" className="container mx-auto max-w-8xl py-10 px-4 sm:px-6">
      <div className="card bg-white rounded-2xl overflow-hidden">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4 border-b-0 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">แก้ไขข้อมูลส่วนตัว</h2>
              <p className="text-gray-500 mt-1">ปรับปรุงข้อมูลโปรไฟล์ของคุณ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพประจำตัว</label>
                  <label className="relative group cursor-pointer" htmlFor="profile-upload">
                    <div className="w-52 h-52 mx-auto rounded-full bg-white overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 transform border-0 flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image load error:', e);
                            console.log('Failed to load image:', previewImage);
                            e.target.onerror = null;
                            e.target.src = "/logo_it.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <img
                            src="/logo_it.png"
                            alt="Default Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Default image load error:', e);
                              e.target.onerror = null;
                            }}
                          />
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
                  {formData.pic && typeof formData.pic !== 'string' && (
                    <span className="text-xs text-gray-600 mt-1">{formData.pic.name}</span>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-3 bg-white px-4 py-2 rounded-full shadow-sm">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
                </div>
              </div>

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
                        <span className="label-text text-gray-700 font-medium text-left">รหัสนิสิต/บุคลากร</span>
                      </label>
                      <input
                        type="text"
                        name="user_code"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.user_code}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">ชื่อ-นามสกุล</span>
                      </label>
                      <input
                        type="text"
                        name="Fullname"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.Fullname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">ตำแหน่ง</span>
                      </label>
                      <select
                        name="position_id"
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.position_id || ''}
                        onChange={e => {
                          const pos = positions.find(p => String(p.position_id) === e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            position_id: e.target.value,
                            position_name: pos ? pos.position_name : ''
                          }));
                        }}
                        required
                      >
                        <option value="" disabled>เลือกตำแหน่ง</option>
                        {positions.map(position => (
                          <option key={position.position_id} value={position.position_id}>
                            {position.position_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">สาขา</span>
                      </label>
                      <select
                        name="branch_id"
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.branch_id || ''}
                        onChange={e => {
                          const br = branches.find(b => String(b.branch_id) === e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            branch_id: e.target.value,
                            branch_name: br ? br.branch_name : ''
                          }));
                        }}
                        required
                      >
                        <option value="" disabled>เลือกสาขา</option>
                        {branches.map(branch => (
                          <option key={branch.branch_id} value={branch.branch_id}>
                            {branch.branch_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">ชื่อผู้ใช้งาน</span>
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
                        <span className="label-text text-gray-700 font-medium text-left">รหัสผ่าน</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <span className="text-xs text-gray-400 mt-1 block">(เว้นว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน)</span>
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
                        <span className="label-text text-gray-700 font-medium text-left">อีเมล</span>
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
                        <span className="label-text text-gray-700 font-medium text-left">เบอร์โทร</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium">+66</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          className="input input-bordered w-full pl-3 focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0 text-left"
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
                      <span className="label-text text-gray-700 font-medium text-left">ที่อยู่ปัจจุบัน</span>
                    </label>
                    <textarea
                      name="street"
                      className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                      rows="3"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="ที่อยู่ปัจจุบัน"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">จังหวัด</span>
                      </label>
                      <select
                        name="province"
                        value={selected.province_id || ''}
                        onChange={e => handleAddressChange(e, 'province')}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                      >
                        <option value=''>เลือกจังหวัด</option>
                        {provinces.map(p => (
                          <option key={p.id} value={p.id}>{p.name_th}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">อำเภอ</span>
                      </label>
                      <select
                        name="district"
                        value={selected.amphure_id || ''}
                        onChange={e => handleAddressChange(e, 'amphure')}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        disabled={!amphures.length}
                      >
                        <option value=''>เลือกอำเภอ</option>
                        {amphures.map(a => (
                          <option key={a.id} value={a.id}>{a.name_th}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">ตำบล</span>
                      </label>
                      <select
                        name="parish"
                        value={selected.tambon_id || ''}
                        onChange={e => handleAddressChange(e, 'tambon')}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        disabled={!tambons.length}
                      >
                        <option value=''>เลือกตำบล</option>
                        {tambons.map(t => (
                          <option key={t.id} value={t.id}>{t.name_th}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium text-left">รหัสไปรษณีย์</span>
                      </label>
                      <input
                        type="text"
                        name="postal_no"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent h-12 rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md border-0"
                        value={formData.postal_no}
                        onChange={handleChange}
                        placeholder="10110"
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
                disabled={isLoading || !isFormValid}
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