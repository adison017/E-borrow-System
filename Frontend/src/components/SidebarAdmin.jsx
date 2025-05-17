import React from 'react';
import { BiPackage } from "react-icons/bi";
import { BsGraphUp } from "react-icons/bs";
import { FaHandshake, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { MdManageAccounts, MdMenu, MdOutlineEditNote, MdViewList } from "react-icons/md";
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
          ? "fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl rounded-r-2xl transition-all duration-300 ease-in-out overflow-y-auto"
          : `${isCollapsed ? 'w-16' : 'w-64'} flex-none bg-white border-r border-gray-200 transition-all duration-300 h-full hidden lg:block rounded-r-2xl overflow-y-auto`
      }
      style={mobileOpen ? { maxWidth: '85vw' } : {}}
    >
      <div className={mobileOpen ? "py-4 h-full flex flex-col" : "py-6"}>
        {/* Mobile Header */}
        <div className={mobileOpen ? "flex items-center justify-between mb-6 px-6 border-b border-gray-100" : "flex flex-col items-center justify-between mb-6 px-4"}>
          {/* ปุ่มปิด sidebar เฉพาะ mobile overlay */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <MdMenu size={26} />
            </button>
          )}
        </div>

        <ul className={isCollapsed ? "flex flex-col min-h-full justify-center items-center space-y-3" : mobileOpen ? "space-y-3 font-medium w-full px-6" : "space-y-3 font-medium px-4"}>
          {/* Hamburger menu for desktop */}
          {!mobileOpen && (
            <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
              <button
                onClick={toggleCollapse}
                className={isCollapsed
                  ? "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:bg-gray-100 text-gray-700"
                  : "flex items-center p-3 rounded-xl hover:bg-gray-100 text-gray-700 w-full justify-start transition-all duration-200"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <MdMenu size={24} />
              </button>
            </li>
          )}

          {/* Dashboard */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/DashboardAd"
              onClick={() => handleMenuClick('/DashboardAd')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/DashboardAd') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/DashboardAd') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/equipment') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/equipment') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/category') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/category') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/members') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/members') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/borrow-list') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/borrow-list') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/return-list') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/return-list') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/ReceiveItem') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/ReceiveItem') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/success') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/success') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/edit_profile') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/edit_profile') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
              title="แก้ไขข้อมูลส่วนตัว"
            >
              <FaUserEdit size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">แก้ไขข้อมูลส่วนตัว</span>}
            </Link>
          </li>

          {/* Logout */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <button
              onClick={handleLogout}
              className={isCollapsed
                ? "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:bg-blue-100 text-gray-700"
                : "flex items-center w-full p-3 rounded-xl hover:bg-gray-100 text-gray-700 justify-start transition-all duration-200"}
              title="ออกจากระบบ"
            >
              <FaSignOutAlt size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">ออกจากระบบ</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarAdmin;