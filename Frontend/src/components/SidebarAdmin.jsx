import { TbPackages } from "react-icons/tb";
import { GiBackForth } from "react-icons/gi";
import { FaNewspaper } from "react-icons/fa";
import { BsFillClipboardPlusFill } from "react-icons/bs";
import { BsClipboardCheckFill } from "react-icons/bs";
import { GiHandTruck } from "react-icons/gi";
import React, { useEffect, useState } from 'react';
import { BiPackage } from "react-icons/bi";
import { BsGraphUp } from "react-icons/bs";
import { FaHandshake, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { MdAnnouncement, MdClose, MdManageAccounts, MdMenu, MdOutlineEditNote, MdViewList } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { getAllBorrows } from '../utils/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // เปลี่ยน URL ถ้า backend อยู่ที่อื่น

const menuItems = [
  { to: '/DashboardAd', icon: <BsGraphUp size={22} />, label: 'รายงาน', key: 'dashboardAd' },
  { to: '/equipment', icon: <BiPackage size={22} />, label: 'จัดการครุภัณฑ์', key: 'equipment' },
  { to: '/category', icon: <TbPackages size={22} />, label: 'จัดการประเภทครุภัณฑ์', key: 'category' },
  { to: '/members', icon: <MdManageAccounts size={22} />, label: 'จัดการสมาชิก', key: 'members' },
  { to: '/borrow-list', icon: <BsFillClipboardPlusFill size={22} />, label: 'รายการขอยืมครุภัณฑ์', key: 'borrowList' },
  { to: '/ReceiveItem', icon: <GiHandTruck size={30} />, label: 'ส่งมอบครุภัณฑ์', key: 'receiveItem' },
  { to: '/return-list', icon: <GiBackForth size={23} />, label: 'รายการคืนครุภัณฑ์', key: 'returnList' },
  { to: '/success', icon: <BsClipboardCheckFill size={22} />, label: 'รายการการเสร็จสิ้น', key: 'success' },
  { to: '/manage-news', icon: <FaNewspaper  size={22} />, label: 'จัดการข่าวสาร', key: 'manageNews' },
  { to: '/edit_profile', icon: <FaUserEdit size={22} />, label: 'แก้ไขข้อมูลส่วนตัว', key: 'profile' },
];

function SidebarAdmin({ isCollapsed, toggleCollapse, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuReady, setMenuReady] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // เพิ่ม state สำหรับ badge
  const [pendingCount, setPendingCount] = useState(0);
  const [carryCount, setCarryCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // รับ badge real-time จาก backend
    socket.on('badgeCountsUpdated', (badges) => {
      if (typeof badges.pendingCount === 'number') setPendingCount(badges.pendingCount);
      if (typeof badges.carryCount === 'number') setCarryCount(badges.carryCount);
    });
    // cleanup
    return () => {
      socket.off('badgeCountsUpdated');
    };
  }, []);

  useEffect(() => {
    // ดึงข้อมูลจาก API โดยตรง (สำหรับ initial load)
    getAllBorrows().then(data => {
      if (Array.isArray(data)) {
        const count = data.filter(b => b.status === 'pending' || b.status === 'pending_approval').length;
        setPendingCount(count);
        const carry = data.filter(b => b.status === 'carry').length;
        setCarryCount(carry);
      }
    });
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    if (setMobileOpen) setMobileOpen(false);
    setShowLogoutConfirm(false);
    navigate('/login');
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleMenuClick = (to) => {
    if (setMobileOpen) setMobileOpen(false);
    if (to) {
      navigate(to, { replace: true });
    }
  };

  const iconSize = 22;

  return (
    <>
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
                <button
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
                    {/* เพิ่ม badge เฉพาะเมนู borrow-list และ receiveItem */}
                    {item.key === 'borrowList' && pendingCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full align-middle animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                    {item.key === 'receiveItem' && carryCount > 0 && (
                      <span className="ml-2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full align-middle animate-pulse">
                        {carryCount}
                      </span>
                    )}
                  </span>
                </button>
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

export default SidebarAdmin;