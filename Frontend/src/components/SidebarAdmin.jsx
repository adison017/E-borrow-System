import { BsGraphUp } from "react-icons/bs"; 
import { MdViewList } from "react-icons/md"; 
import { TbCategory } from "react-icons/tb"; 
import { MdOutlineEditNote } from "react-icons/md"; 
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdMenu } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri"; 

import { MdManageAccounts } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { AiFillProduct } from "react-icons/ai";
import { BiLogOutCircle, BiPackage } from "react-icons/bi";
import { FaHandshake,FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";

function SidebarAdmin() {
  const [open, setOpen] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  const handleNavLinkClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('#sidebar') && !event.target.closest('#toggle-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Check if current route matches to set active state
  const isActive = (path) => location.pathname === path;

  return (
    <React.Fragment>
      {/* Mobile toggle button */}
      <button
        id="toggle-button"
        onClick={toggleSidebar}
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside id="separator-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } sm:translate-x-0 bg-gray-50 dark:bg-gray-800`} aria-label="Sidebar">
                
              <div className="h-full px-2 py-4 overflow-y-auto bg-indigo-950">
                <ul className="space-y">
                            {/* ปุ่มเมนูใน sidebar - แสดงเฉพาะใน mobile */}
                            <li className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group sm:hidden">
                              <button onClick={toggleSidebar} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                <MdMenu size={30}/>
                              </button>
                            </li>
                            <li className="flex justify-center p-2">
                              <div className="w-full h-auto md:h-auto flex items-center justify-center">
                                <img 
                                  src="/logo_it.png" 
                                  alt="Logo" 
                                  className="object-cover w-full h-full md:max-h-80 md:max-w-90"
                                />
                              </div>
                            </li>
                          </ul>
                          
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-white/50">
            <li>
              <NavLink
                to="/DashboardAd"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <BsGraphUp  size={25} />
                <span className="ms-3">รายงาน</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/equipment"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <MdOutlineEditNote size={25}/>
                <span className="ms-3">จัดการครุภัณฑ์</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <TbCategory  size={25}/>
                <span className="flex-1 ms-3 whitespace-nowrap">จัดการประเภทครุภัณฑ์</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/members"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <MdManageAccounts size={25}/>
                <span className="flex-1 ms-3 whitespace-nowrap">จัดการสมาชิก</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/borrow-list"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <MdViewList  size={25}/>
                <span className="flex-1 ms-3 whitespace-nowrap">รายการขอยืมครุภัณฑ์</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/return-list"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <RiArrowGoBackLine size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">รายการคืนครุภัณฑ์</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ReceiveItem"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                   ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <BiPackage size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">ส่งมอบครุภัณฑ์</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
              </NavLink>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-white/50">
          <li>
              <NavLink
                to="/edit_profile"
                onClick={handleNavLinkClick}
                className={`flex items-center p-2 rounded-lg group ${isActive('/edit_profile')
                  ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'}`}
              >
                <FaUserEdit size={22} />
                <span className="ms-3">แก้ไขข้อมูลส่วนตัว</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                onClick={handleNavLinkClick}
                className={({ isActive }) => `flex items-center p-2 rounded-lg group ${
                  isActive
                  ? 'bg-gradient-to-r from-blue-950 to-blue-700 text-white transition-colors' 
                  : 'hover:bg-white hover:text-black text-white transition-colors'
                }`}
              >
                <FaSignOutAlt size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">ออกจากระบบ</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </React.Fragment>
  );
}

export default SidebarAdmin;