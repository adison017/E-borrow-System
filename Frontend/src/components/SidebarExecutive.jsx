import React from 'react';
import { AiOutlineHistory } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { FaShoppingCart, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { MdAnnouncement, MdClose, MdMenu } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom';

function SidebarExecutive({ isCollapsed, toggleCollapse, mobileOpen, setMobileOpen }) {
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
              to="/DashboardEx"
              onClick={() => handleMenuClick('/DashboardEx')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/DashboardEx') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/DashboardEx') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="รายงาน"
            >
              <BsGraphUp size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายงาน</span>}
            </Link>
          </li>

          {/* Borrow Approval List */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/BorrowApprovalList"
              onClick={() => handleMenuClick('/BorrowApprovalList')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/BorrowApprovalList') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/BorrowApprovalList') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="รายการขอยืมครุภัณฑ์"
            >
              <FaShoppingCart size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายการขอยืมครุภัณฑ์</span>}
            </Link>
          </li>

          {/* History */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/History"
              onClick={() => handleMenuClick('/History')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/History') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/History') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="ประวัติอนุมัติการยืม"
            >
              <AiOutlineHistory size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">ประวัติอนุมัติการยืม</span>}
            </Link>
          </li>

          {/* Repair Approval */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/Repair"
              onClick={() => handleMenuClick('/Repair')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/Repair') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/Repair') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="อนุมัติการซ่อมครุภัณฑ์"
            >
              <MdAnnouncement size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">อนุมัติการซ่อมครุภัณฑ์</span>}
            </Link>
          </li>

          {/* Repair History */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/History_Repair"
              onClick={() => handleMenuClick('/History_Repair')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive('/History_Repair') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'}`
                : `flex items-center p-3 rounded-xl ${isActive('/History_Repair') ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'hover:bg-blue-50 text-gray-700'} w-full justify-start transition-all duration-200`}
              title="ประวัติซ่อมครุภัณฑ์"
            >
              <GiAutoRepair size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">ประวัติซ่อมครุภัณฑ์</span>}
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

export default SidebarExecutive;