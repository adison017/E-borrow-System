import React from 'react';
import { BiPackage } from "react-icons/bi";
import { BsGraphUp } from "react-icons/bs";
import { FaHandshake, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { MdClose, MdManageAccounts, MdMenu, MdOutlineEditNote, MdViewList } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { Link, useLocation, useNavigate } from 'react-router-dom';

function SidebarAdmin({ isCollapsed, toggleCollapse, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (setMobileOpen) setMobileOpen(false);
    navigate('/login');
  };

  const handleMenuClick = (to) => {
    if (setMobileOpen) setMobileOpen(false);
    if (to) navigate(to);
  };

  return (
    <div
      className={
        mobileOpen
          ? "fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-xl rounded-r-2xl transition-all duration-300 ease-in-out overflow-y-auto"
          : `${isCollapsed ? 'w-20' : 'w-72'} flex-none bg-white border-r border-gray-200 shadow-md transition-all duration-300 h-full hidden lg:block rounded-r-3xl overflow-y-auto`
      }
      style={mobileOpen ? { maxWidth: '85vw' } : {}}
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

        <ul className={`flex-1 ${isCollapsed ? "flex flex-col items-center space-y-4 px-2" : mobileOpen ? "space-y-2 font-medium px-5" : "space-y-2 font-medium px-4"}`}>
          {/* Hamburger menu for desktop */}
          {!mobileOpen && (
            <li className={isCollapsed ? "w-full flex justify-center mb-4" : "mb-4"}>
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

          {/* Dashboard */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/DashboardAd"
              onClick={() => handleMenuClick('/DashboardAd')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/DashboardAd') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/DashboardAd') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="รายงาน"
            >
              <BsGraphUp size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายงาน</span>}
            </Link>
          </li>

          {/* Equipment Management */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/equipment"
              onClick={() => handleMenuClick('/equipment')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/equipment') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/equipment') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="จัดการครุภัณฑ์"
            >
              <MdOutlineEditNote size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">จัดการครุภัณฑ์</span>}
            </Link>
          </li>

          {/* Category Management */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/category"
              onClick={() => handleMenuClick('/category')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/category') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/category') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="จัดการประเภทครุภัณฑ์"
            >
              <TbCategory size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">จัดการประเภทครุภัณฑ์</span>}
            </Link>
          </li>

          {/* Member Management */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/members"
              onClick={() => handleMenuClick('/members')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/members') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/members') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="จัดการสมาชิก"
            >
              <MdManageAccounts size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">จัดการสมาชิก</span>}
            </Link>
          </li>

          {/* Borrow List */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/borrow-list"
              onClick={() => handleMenuClick('/borrow-list')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/borrow-list') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/borrow-list') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="รายการขอยืมครุภัณฑ์"
            >
              <MdViewList size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายการขอยืมครุภัณฑ์</span>}
            </Link>
          </li>

          {/* Return List */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/return-list"
              onClick={() => handleMenuClick('/return-list')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/return-list') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/return-list') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="รายการคืนครุภัณฑ์"
            >
              <RiArrowGoBackLine size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายการคืนครุภัณฑ์</span>}
            </Link>
          </li>

          {/* Receive Item */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/ReceiveItem"
              onClick={() => handleMenuClick('/ReceiveItem')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/ReceiveItem') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/ReceiveItem') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="ส่งมอบครุภัณฑ์"
            >
              <BiPackage size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">ส่งมอบครุภัณฑ์</span>}
            </Link>
          </li>

          {/* Success List */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/success"
              onClick={() => handleMenuClick('/success')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/success') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/success') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="รายการการเสร็จสิ้น"
            >
              <FaHandshake size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายการการเสร็จสิ้น</span>}
            </Link>
          </li>

          {/* Profile */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/edit_profile"
              onClick={() => handleMenuClick('/edit_profile')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/edit_profile') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/edit_profile') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="แก้ไขข้อมูลส่วนตัว"
            >
              <FaUserEdit size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">แก้ไขข้อมูลส่วนตัว</span>}
            </Link>
          </li>
        </ul>
        
        {/* Logout button - moved to bottom */}
        <div className={`mt-auto px-4 pb-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={handleLogout}
            className={isCollapsed
              ? "flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-200"
              : "flex items-center w-full p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 justify-start transition-all duration-200"}
            title="ออกจากระบบ"
          >
            <FaSignOutAlt size={22} />
            {!isCollapsed && <span className="ms-3 font-medium">ออกจากระบบ</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;