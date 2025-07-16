import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
// import { Avatar } from "@material-tailwind/react"; // ไม่ใช้ Avatar แล้ว

function Header({ userRole, changeRole }) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState('/logo_it.png');
  const roleNames = {
    admin: "ผู้ดูแลระบบ",
    user: "ผู้ใช้งาน",
    executive: "ผู้บริหาร"
  };
  const role = roleNames[userRole] || "ผู้ใช้งาน";
  const [currentTime, setCurrentTime] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    setShowLogoutConfirm(false);
    navigate('/login');
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  // ฟังก์ชันสำหรับคลิกโลโก้
  const handleLogoClick = () => {
    if (userRole === 'admin') navigate('/DashboardAd');
    else if (userRole === 'executive') navigate('/DashboardEx');
    else navigate('/DashboardUs');
  };

  useEffect(() => {
    // โหลด user info จาก localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUsername(userData.Fullname || userData.username);
      } catch (e) {}
    }
  }, [userRole]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " น.";
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // โหลด avatar เริ่มต้นจาก localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.avatar) {
          setAvatar(user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000/uploads/user/${user.avatar}`);
        }
      } catch {}
    }
    // ฟัง event profileImageUpdated
    const handleProfileImageUpdate = (event) => {
      if (event.detail && event.detail.imagePath) {
        setAvatar(event.detail.imagePath); // setState ด้วย path ใหม่
      }
    };
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-950 to-blue-700 text-white py-4 px-10 mb-1">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Logo + System Name */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center justify-center p-1 w-30 h-20 cursor-pointer" onClick={handleLogoClick} title="ไปหน้าแรก">
              <img
                src="/logo_it.png"
                alt="Logo"
                className="object-contain md:w-40 md:h-50"
              />
            </div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight drop-shadow-sm whitespace-nowrap">
              ระบบยืม-คืนครุภัณฑ์
            </h1>
          </div>

          {/* Right side container */}
          <div className="flex flex-col sm:flex-row items-center gap-3 ">
            {/* Role switcher */}
            {/*
<div className="flex gap-2 bg-indigo-900/30 p-1 rounded-full">
  <button
    onClick={() => changeRole('admin')}
    className={`px-3 py-1 text-xs rounded-full ${userRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-indigo-800/30 hover:bg-indigo-800/50'}`}
    title="ผู้ดูแลระบบ"
  >
    Admin
  </button>
  <button
    onClick={() => changeRole('user')}
    className={`px-3 py-1 text-xs rounded-full ${userRole === 'user' ? 'bg-blue-500 text-white' : 'bg-indigo-800/30 hover:bg-indigo-800/50'}`}
    title="ผู้ใช้งาน"
  >
    User
  </button>
  <button
    onClick={() => changeRole('executive')}
    className={`px-3 py-1 text-xs rounded-full ${userRole === 'executive' ? 'bg-blue-500 text-white' : 'bg-indigo-800/30 hover:bg-indigo-800/50'}`}
    title="ผู้บริหาร"
  >
    Executive
  </button>
</div>
*/}

            {/* User Info + Logout */}
            <div className="flex items-center gap-3 sm:gap-4 bg-indigo-950/50 rounded-full pl-5 pr-3 py-3 shadow-inner">
              {/* Username + Role */}
              <div className="text-right hidden sm:block">
                <div className="font-semibold text-sm md:text-base">{username}</div>
                <div className="text-blue-100 text-xs md:text-sm">{role}</div>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center">
                <img
                  src={avatar}
                  alt={username || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
              </div>

              {/* Logout Button (optional) */}
              <button
                onClick={handleLogout}
                className="md:flex items-center justify-center p-2 rounded-full hover:bg-blue-700 transition-colors"
                title="ออกจากระบบ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {showLogoutConfirm && (
        <Notification
          show={showLogoutConfirm}
          title="ยืนยันออกจากระบบ"
          message="คุณต้องการออกจากระบบใช่หรือไม่?"
          type="warning"
          onClose={cancelLogout}
          actions={[
            { label: 'ยกเลิก', onClick: cancelLogout },
            { label: 'ออกจากระบบ', onClick: confirmLogout }
          ]}
        />
      )}
    </>
  );
}

export default Header;