import React, { useEffect, useState } from 'react';
import { AiOutlineHistory } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { FaShoppingCart, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { MdAnnouncement, MdClose, MdMenu } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { to: '/DashboardEx', icon: <BsGraphUp size={22} />, label: 'รายงาน', key: 'dashboardEx' },
  { to: '/BorrowApprovalList', icon: <FaShoppingCart size={22} />, label: 'รายการขอยืมครุภัณฑ์', key: 'borrowApproval' },
  { to: '/Repair', icon: <MdAnnouncement size={22} />, label: 'อนุมัติการซ่อมครุภัณฑ์', key: 'repairApproval' },
  { to: '/History', icon: <AiOutlineHistory size={22} />, label: 'ประวัติอนุมัติการยืม', key: 'history' },
  { to: '/History_Repair', icon: <GiAutoRepair size={22} />, label: 'ประวัติซ่อมครุภัณฑ์', key: 'historyRepair' },
  { to: '/edit_profile', icon: <FaUserEdit size={22} />, label: 'แก้ไขข้อมูลส่วนตัว', key: 'profile' },
];

function SidebarExecutive({ isCollapsed, toggleCollapse, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuReady, setMenuReady] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (setMobileOpen) setMobileOpen(false);
    navigate('/login');
  };

  const handleMenuClick = (to) => {
    if (setMobileOpen) setMobileOpen(false);
    if (to) navigate(to);
  };

  const iconSize = 22;

  return (
    <div
      className={
        mobileOpen
          ? "fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-xl rounded-r-2xl transition-all duration-300 ease-in-out overflow-y-auto mobile-menu-enter-active"
          : `${isCollapsed ? 'w-20' : 'w-72'} flex-none bg-white border-r border-gray-200 shadow-md transition-all duration-300 h-full hidden lg:block rounded-r-3xl overflow-y-auto`
      }
      style={mobileOpen ? { 
        maxWidth: '85vw',
        animation: 'slideIn 0.3s ease-in-out'
      } : {}}
    >
      <div className={mobileOpen ? "py-5 h-full flex flex-col" : "py-6 h-full flex flex-col"}>
        {/* Mobile Header */}
        <div className={mobileOpen ? "flex items-center justify-between mb-6 px-6 pb-4 border-b border-gray-100" : "flex flex-col items-center justify-between mb-8 px-4"}>
          {/* Logo or Brand */}
          <div className="flex items-center">
            <h1 className={`font-bold text-blue-600 text-xl ${isCollapsed && !mobileOpen ? 'hidden' : ''}`}>e-Borrow</h1>
          </div>
          
          {/* Close button for mobile */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <MdClose size={26} />
            </button>
          )}
        </div>

        <ul className={`flex-1 ${isCollapsed ? "flex flex-col items-center space-y-2 px-2" : mobileOpen ? "space-y-2 font-medium px-5" : "space-y-2 font-medium px-4"}`}>
          {/* Hamburger menu for desktop */}
          {!mobileOpen && (
            <li className={`${isCollapsed ? "w-full flex justify-center mb-2" : "mb-2"} transition-all duration-300 ease-in-out ${menuReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <button
                onClick={toggleCollapse}
                className={isCollapsed
                  ? "flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                  : "flex items-center p-3 rounded-xl hover:bg-gray-100 text-gray-700 w-full justify-start transition-all duration-200"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <MdMenu size={24} />
                {!isCollapsed && <span className="ml-3 font-medium">เมนู</span>}
              </button>
            </li>
          )}

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <li 
              key={item.key} 
              className={`${isCollapsed ? "w-full flex justify-center" : "w-full"} transition-all duration-300 ease-in-out
                ${menuReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ 
                transitionDelay: menuReady ? `${(index + 1) * 100}ms` : '0ms',
                animation: !isCollapsed && menuReady ? 'fadeIn 0.3s ease-in-out' : 'none'
              }}
            >
              <Link
                to={item.to}
                onClick={() => handleMenuClick(item.to)}
                className={`flex items-center rounded-xl transition-all duration-200 
                  ${isCollapsed 
                    ? 'justify-center w-12 h-12' 
                    : 'justify-start w-full p-3'}
                  ${isActive(item.to) 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                    : 'hover:bg-blue-50 text-gray-700'}`}
                title={isCollapsed ? item.label : undefined}
              >
                {React.cloneElement(item.icon, { size: iconSize })}
                <span
                  className={`transition-all duration-700 ease-in-out overflow-hidden whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ms-0' : 'max-w-xs opacity-100 ms-3'} font-medium`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout button - moved to bottom */}
        <div className={`mt-auto px-4 pb-6 ${isCollapsed ? 'flex justify-center' : ''} transition-all duration-500 ease-in-out ${menuReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: menuReady ? `${(menuItems.length + 1) * 100}ms` : '0ms' }}>
          <button
            onClick={handleLogout}
            className={isCollapsed
              ? "flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-200"
              : "flex items-center w-full p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 justify-start transition-all duration-200"}
            title={isCollapsed ? "ออกจากระบบ" : undefined}
          >
            <FaSignOutAlt size={iconSize} />
            <span
              className={`transition-all duration-700 ease-in-out overflow-hidden whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ms-0' : 'max-w-xs opacity-100 ms-3'} font-medium`}
            >
              ออกจากระบบ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarExecutive;