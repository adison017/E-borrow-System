import axios from 'axios';
import { useEffect, useState } from 'react';

import { FaBuilding, FaEnvelope, FaGraduationCap, FaIdCard, FaLock, FaMapMarkerAlt, FaPhone, FaUser, FaUserAlt, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';

import {
  LoginErrorDialog,
  LoginSuccessDialog,
  PasswordMismatchDialog,
  RegisterErrorDialog,
  RegisterSuccessDialog
} from './dialog/AlertDialog';
import Notification from './Notification';

// ลบ const provinces, districts, subdistricts ที่เป็น mock data ออก

const defaultRoutes = {
  admin: '/DashboardAd',
  user: '/DashboardUs',
  executive: '/DashboardEx'
};

// เพิ่ม helper สำหรับแปล error message
function getRegisterErrorMessage(error) {
  let errorMsg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
  if (errorMsg.includes('Duplicate entry') && errorMsg.includes('users.email')) {
    return 'อีเมลนี้ถูกใช้ไปแล้ว กรุณาใช้อีเมลอื่น';
  }
  if (errorMsg.includes('Duplicate entry') && errorMsg.includes('users.user_code')) {
    return 'รหัสนิสิต/บุคลากรนี้ถูกใช้ไปแล้ว กรุณาตรวจสอบ';
  }
  if (errorMsg.includes('Duplicate entry') && errorMsg.includes('users.username')) {
    return 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณาเลือกชื่อใหม่';
  }
  return errorMsg;
}

const AuthSystem = (props) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSubdistricts, setAvailableSubdistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selected, setSelected] = useState({ province_id: undefined, amphure_id: undefined, tambon_id: undefined });
  const [notification, setNotification] = useState({ show: false, type: 'info', title: '', message: '', onClose: null });
  const [showRegisterLeaveDialog, setShowRegisterLeaveDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });


  // Register form state
  const [registerData, setRegisterData] = useState({
    idNumber: '',
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    currentAddress: '',
    provinceId: '',
    amphureId: '',
    tambonId: '',
    postalCode: ''
  });
  // Multi-step register
  const [registerStep, setRegisterStep] = useState(0); // 0: basic, 1: account, 2: contact, 3: address

  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    // โหลดอำเภอเริ่มต้นตามจังหวัดเริ่มต้น
    const initialProvince = provinces.find(p => p.name === registerData.province);
    if (initialProvince) {
      const provinceDistricts = amphures.find(a => a.id === Number(registerData.amphureId))?.tambon || [];
      setAvailableDistricts(provinceDistricts);

      // โหลดตำบลเริ่มต้นตามอำเภอเริ่มต้น
      const initialDistrict = provinceDistricts.find(d => d.name === registerData.district);
      if (initialDistrict) {
        const districtSubdistricts = tambons.find(t => t.id === Number(registerData.tambonId))?.zip_code || '';
        setAvailableSubdistricts(districtSubdistricts);
      }
    }
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    // fetch จังหวัด/อำเภอ/ตำบล จาก github
    fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
      .then(res => res.json())
      .then(data => {
        setProvinces(data);
        // โหลดอำเภอเริ่มต้นตามจังหวัดเริ่มต้น
        const initialProvince = data.find(p => p.name === registerData.province);
        if (initialProvince) {
          setAmphures(initialProvince.amphure);
          const initialDistrict = initialProvince.amphure.find(d => d.name === registerData.district);
          if (initialDistrict) {
            setTambons(initialDistrict.tambon);
          }
        }
      });
    // fetch positions
    axios.get('http://localhost:5000/api/users/positions')
      .then(res => setPositions(res.data))
      .catch(() => setPositions([]));
    // fetch branches
    axios.get('http://localhost:5000/api/users/branches')
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]));
  }, []);

  // Inline validation: ตรวจสอบรหัสผ่านตรงกันทันที
  useEffect(() => {
    if (registerData.password && registerData.confirmPassword) {
      setPasswordMatch(registerData.password === registerData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [registerData.password, registerData.confirmPassword]);

  useEffect(() => {
    // ตรวจสอบ token ทุกครั้งที่ mount
    const token = localStorage.getItem('token');
    // console.log('token in localStorage:', token);
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5000/api/users/verify-token', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('verify-token status:', res.status);
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .catch((err) => {
        console.log('verify-token error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'login') {
      setLoginData({ username: '', password: '' });
    }
  }, [activeTab]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idNumber') {
      setRegisterData(prev => ({ ...prev, idNumber: value, username: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProvinceChange = (e) => {
    const provinceId = Number(e.target.value);
    setSelected({ province_id: provinceId, amphure_id: undefined, tambon_id: undefined });
    const provinceObj = provinces.find(p => p.id === provinceId);
    setRegisterData(prev => ({ ...prev, provinceId, amphureId: '', tambonId: '', postalCode: '' }));
    setAmphures(provinceObj ? provinceObj.amphure : []);
    setTambons([]);
  };
  const handleDistrictChange = (e) => {
    const amphureId = Number(e.target.value);
    setSelected(prev => ({ ...prev, amphure_id: amphureId, tambon_id: undefined }));
    const amphureObj = amphures.find(a => a.id === amphureId);
    setRegisterData(prev => ({ ...prev, amphureId, tambonId: '', postalCode: '' }));
    setTambons(amphureObj ? amphureObj.tambon : []);
  };
  const handleSubdistrictChange = (e) => {
    const tambonId = Number(e.target.value);
    setSelected(prev => ({ ...prev, tambon_id: tambonId }));
    const tambonObj = tambons.find(t => t.id === tambonId);
    setRegisterData(prev => ({ ...prev, tambonId, postalCode: tambonObj ? tambonObj.zip_code : '' }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username: loginData.username,
        password: loginData.password
      });
      setIsLoading(false);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setNotification({
          show: true,
          type: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          message: 'ยินดีต้อนรับ ' + (response.data.user.Fullname || response.data.user.username),
          onClose: () => {
            setNotification(n => ({ ...n, show: false }));
            if (props.onLoginSuccess) {
              props.onLoginSuccess(response.data.user.role);
            }
          }
        });
      } else {
        setNotification({
          show: true,
          type: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          message: response.data?.message || 'เกิดข้อผิดพลาด',
          onClose: () => setNotification(n => ({ ...n, show: false }))
        });
      }
    } catch (error) {
      setIsLoading(false);
      let errorMsg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      // กรณีข้อความจาก backend
      if (errorMsg.includes('กรุณากรอก username และ password')) {
        errorMsg = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      } else if (errorMsg.includes('ไม่พบผู้ใช้งานนี้')) {
        errorMsg = 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ';
      } else if (errorMsg.includes('รหัสผ่านไม่ถูกต้อง')) {
        errorMsg = 'รหัสผ่านไม่ถูกต้อง';
      } else if (errorMsg.includes('ชื่อผู้ใช้ไม่ถูกต้อง')) {
        errorMsg = 'ชื่อผู้ใช้ไม่ถูกต้อง';
      }
      setNotification({
        show: true,
        type: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        message: errorMsg,
        onClose: () => setNotification(n => ({ ...n, show: false }))
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setNotification({
        show: true,
        type: 'error',
        title: '❗ รหัสผ่านไม่ตรงกัน',
        message: 'กรุณากรอกรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน',
        onClose: () => setNotification(n => ({ ...n, show: false }))
      });
      return;
    }
    setIsLoading(true);
    try {
      // map id เป็นชื่อจริง
      const provinceObj = provinces.find(p => p.id === Number(registerData.provinceId));
      const amphureObj = amphures.find(a => a.id === Number(registerData.amphureId));
      const tambonObj = tambons.find(t => t.id === Number(registerData.tambonId));
      const payload = {
        user_code: registerData.idNumber,
        username: registerData.username,
        password: registerData.password,
        email: registerData.email,
        phone: registerData.phone,
        Fullname: registerData.fullName,
        position_id: registerData.position, // ส่ง id
        branch_id: registerData.department, // ส่ง id
        role_id: 3,
        street: registerData.currentAddress,
        province: provinceObj ? provinceObj.name_th : '',
        district: amphureObj ? amphureObj.name_th : '',
        parish: tambonObj ? tambonObj.name_th : '',
        postal_no: registerData.postalCode
      };
      await axios.post('http://localhost:5000/api/users', payload);
      setIsLoading(false);
      setRegisterData({
        idNumber: '',
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        currentAddress: '',
        provinceId: '',
        amphureId: '',
        tambonId: '',
        postalCode: ''
      });
      setNotification({
        show: true,
        type: 'success',
        title: 'สมัครสมาชิกสำเร็จ',
        message: 'คุณสามารถเข้าสู่ระบบได้ทันที',
        onClose: () => {
          setNotification(n => ({ ...n, show: false }));
          navigate('/login');
        }
      });
    } catch (error) {
      setIsLoading(false);
      setNotification({
        show: true,
        type: 'error',
        title: 'สมัครสมาชิกไม่สำเร็จ',
        message: getRegisterErrorMessage(error),
        onClose: () => setNotification(n => ({ ...n, show: false }))
      });
    }
  };

  return (
    <div data-theme="light" className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Blurred background image */}
      <div
        className="fixed inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: 'url(/itmsu.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.85)',
          WebkitFilter: 'blur(2px) brightness(0.85)',
          pointerEvents: 'none',
        }}
      />
      {/* Overlay for extra dimming if needed */}
      <div className="fixed inset-0 z-10 bg-black/20" style={{pointerEvents: 'none'}} />
      <div className="relative z-20 w-full max-w-8xl bg-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:shadow-glow">

        {/* Left: Logo and Welcome */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-8 text-center relative overflow-hidden bg-blue-200">
          <div className="absolute inset-0 bg-blue-200 z-0"></div>
          <div className="relative z-10 w-full max-w-md">
            <div className="p-4 rounded-full mb-8 inline-flex justify-center">
              <img
                src="/logo_it.png"
                alt="Logo"
                className="w-48 h-36 object-contain drop-shadow-lg transition-transform duration-500 hover:scale-105"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-wide  mb-4">
              ยินดีต้อนรับเข้าสู่ระบบ
            </h2>
            <p className="text-lg font-light text-black/80 mb-8">
              เข้าสู่ระบบเพื่อใช้บริการหรือสมัครสมาชิกใหม่
            </p>
            <div className="hidden lg:block">
              <div className="h-1 w-24 bg-indigo-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-sm text-black/80">
                ระบบยืม-คืนครุภัณฑ์คณะวิทยาการสารสนเทส
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="w-full lg:w-1/2 p-6 md:p-10">
          <div className="max-w-3xl w-full mx-auto">

            {/* Tab Navigation */}
            <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1 shadow-inner mb-8">
              <button
                onClick={() => {
                  if (activeTab === 'register' && Object.values(registerData).some(v => v)) {
                    setShowRegisterLeaveDialog(true);
                  } else {
                    setActiveTab('login');
                  }
                }}
                className={`flex-1 py-3 px-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            {/* Forms */}
            {activeTab === 'login' && (
              <div className={`rounded-2xl p-6 transition-all duration-300 ${isMounted ? 'animate-fadeIn' : ''}`}>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/90 font-medium mb-2 flex items-center">
                        <FaUser className="mr-2 text-blue-600" />
                        ชื่อผู้ใช้งาน
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          className="w-full h-12 pl-12 pr-5 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 placeholder-gray-500 text-gray-800"
                          placeholder="กรอกชื่อผู้ใช้งาน"
                          required
                        />
                        <FaUserAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-white/90 font-medium mb-2 flex items-center">
                        <FaLock className="mr-2 text-pink-500" />
                        รหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          className="w-full h-12 pl-12 pr-10 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 placeholder-gray-500 text-gray-800"
                          placeholder="กรอกรหัสผ่าน"
                          required
                        />
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" onClick={() => setShowLoginPassword(v => !v)}>
                          {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <a href="#" className="text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors duration-200">
                        ลืมรหัสผ่าน?
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
                      isLoading ? 'opacity-70' : 'hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg'
                    } flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : 'เข้าสู่ระบบ'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'register' && (
              <div className={`w-full rounded-2xl p-6 transition-all duration-300 ${isMounted ? 'animate-fadeIn' : ''}`}>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  {/* Multi-step register */}
                  {registerStep === 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <FaIdCard className="text-blue-600 text-lg mr-3" />
                        <h3 className="text-lg font-semibold text-white">ข้อมูลพื้นฐาน</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">รหัสนิสิต/บุคลากร</label>
                          <div className="relative">
                            <input type="text" name="idNumber" value={registerData.idNumber} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800" placeholder="เช่น 65011211033" required />
                            <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">ชื่อ-นามสกุล</label>
                          <div className="relative">
                            <input type="text" name="fullName" value={registerData.fullName} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800" placeholder="กรอกชื่อ-นามสกุล" required />
                            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">ตำแหน่ง</label>
                          <div className="relative">
                            <select name="position" value={registerData.position} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800 appearance-none" required>
                              <option value="">เลือกตำแหน่ง</option>
                              {positions.map(pos => (<option key={pos.position_id} value={pos.position_id}>{pos.position_name}</option>))}
                            </select>
                            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">สาขา</label>
                          <div className="relative">
                            <select name="department" value={registerData.department} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800 appearance-none" required>
                              <option value="">เลือกสาขา</option>
                              {branches.map(branch => (<option key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</option>))}
                            </select>
                            <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 text-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button type="button" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition" onClick={() => setRegisterStep(1)}>ดำเนินการต่อ</button>
                      </div>
                    </div>
                  )}
                  {registerStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <FaLock className="text-indigo-400 text-lg mr-3" />
                        <h3 className="text-lg font-semibold text-white">ข้อมูลบัญชี</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-white/80 mb-1">ชื่อผู้ใช้งาน</label>
                          <div className="relative">
                            <input type="text" name="username" value={registerData.username} readOnly tabIndex={-1} className="w-full h-10 pl-10 pr-3 bg-gray-300 border-gray-400 text-gray-600 rounded-lg focus:ring-0 focus:outline-none text-sm cursor-not-allowed select-none" placeholder="ชื่อผู้ใช้งานจะตรงกับรหัสนิสิต/บุคลากร" required />
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">รหัสผ่าน</label>
                          <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} name="password" value={registerData.password} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-10 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800" placeholder="กรอกรหัสผ่าน" required />
                            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" onClick={() => setShowPassword(v => !v)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 text-sm" />
                          </div>
                        </div>

                      </div>
                      {!passwordMatch && (
                        <div className="flex items-center justify-center mt-1">
                          <div className="bg-red-100/80 border border-red-200 rounded-lg shadow-sm px-3 py-1 flex items-center gap-2">
                            <FaExclamationCircle className="text-red-500 text-lg" />
                            <span className="text-red-700 text-sm font-semibold">รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info Section */}
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <FaEnvelope className="text-pink-500 text-lg mr-3" />
                      <h3 className="text-lg font-semibold text-white">ข้อมูลติดต่อ</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          อีเมล
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800"
                            placeholder="example@email.com"
                            required
                          />
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 text-sm" />

                        </div>
                        {!passwordMatch && (<div className="text-red-500 text-xs mt-1">รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน</div>)}
                      </div>
                      <div className="flex justify-between mt-4">
                        <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-500 transition" onClick={() => setRegisterStep(0)}>ย้อนกลับ</button>
                        <button type="button" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition" onClick={() => setRegisterStep(2)} disabled={!registerData.password || !registerData.confirmPassword || !passwordMatch}>ดำเนินการต่อ</button>
                      </div>
                    </div>
                  )}
                  {registerStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <FaEnvelope className="text-pink-500 text-lg mr-3" />
                        <h3 className="text-lg font-semibold text-white">ข้อมูลติดต่อ</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">อีเมล</label>
                          <div className="relative">
                            <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800" placeholder="example@email.com" required />
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">เบอร์โทร</label>
                          <div className="relative">
                            <input type="tel" name="phone" value={registerData.phone} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800" placeholder="กรอกเบอร์โทรศัพท์" required />
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 text-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-500 transition" onClick={() => setRegisterStep(1)}>ย้อนกลับ</button>
                        <button type="button" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition" onClick={() => setRegisterStep(3)} disabled={!registerData.email || !registerData.phone}>ดำเนินการต่อ</button>
                      </div>
                    </div>
                  )}
                  {registerStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <FaMapMarkerAlt className="text-red-500 text-lg mr-3" />
                        <h3 className="text-lg font-semibold text-white">ข้อมูลที่อยู่</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">ที่อยู่ปัจจุบัน</label>
                          <div className="relative">
                            <textarea name="currentAddress" value={registerData.currentAddress} onChange={handleRegisterChange} rows="3" className="w-full px-3 py-2 pl-10 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800 resize-none" placeholder="บ้านเลขที่, ถนน, ซอย" required></textarea>
                            <FaMapMarkerAlt className="absolute left-3 top-3 text-red-500 text-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-white/80 mb-1">จังหวัด</label>
                            <div className="relative">
                              <select name="province" value={registerData.provinceId} onChange={handleProvinceChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800 appearance-none" required>
                                <option value="">เลือกจังหวัด</option>
                                {provinces.map(province => (<option key={province.id} value={province.id}>{province.name_th}</option>))}
                              </select>
                              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 text-sm" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-white/80 mb-1">อำเภอ/เขต</label>
                            <div className="relative">
                              <select name="district" value={registerData.amphureId} onChange={handleDistrictChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800 appearance-none" required disabled={!registerData.provinceId}>
                                <option value="">เลือกอำเภอ/เขต</option>
                                {amphures.map(amphure => (<option key={amphure.id} value={amphure.id}>{amphure.name_th}</option>))}
                              </select>
                              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 text-sm" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-white/80 mb-1">ตำบล/แขวง</label>
                            <div className="relative">
                              <select name="subdistrict" value={registerData.tambonId} onChange={handleSubdistrictChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800 appearance-none" required disabled={!registerData.amphureId}>
                                <option value="">เลือกตำบล/แขวง</option>
                                {tambons.map(tambon => (<option key={tambon.id} value={tambon.id}>{tambon.name_th}</option>))}
                              </select>
                              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 text-sm" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">รหัสไปรษณีย์</label>
                          <div className="relative">
                            <input type="text" name="postalCode" value={registerData.postalCode} onChange={handleRegisterChange} className="w-full h-10 pl-10 pr-3 bg-white/90 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm text-gray-800" placeholder="รหัสไปรษณีย์" required readOnly />
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 text-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-500 transition" onClick={() => setRegisterStep(2)}>ย้อนกลับ</button>
                        <button type="submit" disabled={isLoading} className={`bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition flex items-center justify-center ${isLoading ? 'opacity-70' : ''}`}>{isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>กำลังสมัครสมาชิก...</>) : 'สมัครสมาชิก'}</button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <LoginSuccessDialog />
      <LoginErrorDialog />
      <RegisterSuccessDialog />
      <RegisterErrorDialog />
      <PasswordMismatchDialog />
      <Notification
        show={notification.show}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={notification.onClose}
      />
      {/* Notification แจ้งเตือนเมื่อจะออกจากสมัครสมาชิก */}
      <Notification
        show={showRegisterLeaveDialog}
        title="แจ้งเตือน"
        message="หากคุณเปลี่ยนไปหน้าเข้าสู่ระบบข้อมูลที่กรอกไว้จะหายทั้งหมดต้องการดำเนินการต่อหรือไม่?"
        type="warning"
        duration={0}
        actions={[
          { label: 'ยกเลิก', onClick: () => setShowRegisterLeaveDialog(false) },
          { label: 'ดำเนินการต่อ', onClick: () => {
            setShowRegisterLeaveDialog(false);
            setActiveTab('login');
            setRegisterData({
              idNumber: '',
              fullName: '',
              username: '',
              password: '',
              confirmPassword: '',
              email: '',
              phone: '',
              position: '',
              department: '',
              currentAddress: '',
              provinceId: '',
              amphureId: '',
              tambonId: '',
              postalCode: ''
            });
            setRegisterStep(0);
          }}
        ]}
      />
    </div>
  );
};

export default AuthSystem;