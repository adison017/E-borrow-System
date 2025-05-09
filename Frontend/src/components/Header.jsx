import React, { useState, useEffect } from "react";

function Header({ userRole, changeRole }) {
  const username = "อดิศร";
  const roleNames = {
    admin: "ผู้ดูแลระบบ",
    user: "ผู้ใช้งาน",
    executive: "ผู้บริหาร"
  };
  const role = roleNames[userRole] || "ผู้ใช้งาน";
  const [currentTime, setCurrentTime] = useState("");

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

  return (
    <header className="bg-gradient-to-r from-indigo-950 to-blue-700 text-white py-4 px-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Logo + System Name */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight">
            ระบบยืม-คืนครุภัณฑ์
          </h1>
        </div>

        {/* Right side container */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Role switcher */}
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

          {/* User Info + Logout */}
          <div className="flex items-center gap-3 sm:gap-4 bg-indigo-950/50 rounded-full pl-5 pr-3 py-3 shadow-inner">
            {/* Username + Role */}
            <div className="text-right hidden sm:block">
              <div className="font-semibold text-sm md:text-base">{username}</div>
              <div className="text-blue-100 text-xs md:text-sm">{role}</div>
            </div>

            {/* Profile Picture */}
            <div className="relative">
              <img
                src="/lo.png"
                alt="Profile"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Logout Button (optional) */}
            <button 
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
  );
}

export default Header;