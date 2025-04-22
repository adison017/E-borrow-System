import React, { useState, useEffect } from "react";

function Header() {
  const username = "อดิศร";
  const role = "ผู้ดูแลระบบ";

  const getCurrentTime = () => {
    const now = new Date();
    return (
      now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " น."
    );
  };

 

  return (
    <header className="bg-[#1E3A8A] text-white py-5 px-8 rounded-2xl mb-6 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo + System Name */}
        <div className="flex items-center space-x-4">
          <img src="/lo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="text-2xl sm:text-3xl font-bold">ระบบยืม-คืนครุภัณฑ์</h1>
        </div>

        

        {/* User Info + Logout */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Profile Picture */}
          <img
            src="/lo.png"
            alt="Profile"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover bg-white shadow-md"
          />

          {/* Username + Role */}
          <div className="text-xs sm:text-sm text-right hidden sm:block">
            <div className="font-semibold">{username}</div>
            <div className="text-blue-100">{role}</div>
          </div>

          {/* Logout Button */}
          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all">
            ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
