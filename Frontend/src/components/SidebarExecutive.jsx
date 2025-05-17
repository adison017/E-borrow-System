import React from 'react';
import { AiOutlineHistory } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { FaShoppingCart, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { MdAnnouncement, MdMenu } from "react-icons/md";
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
              to="/DashboardEx"
              onClick={() => handleMenuClick('/DashboardEx')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/DashboardEx') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/DashboardEx') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/BorrowApprovalList') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/BorrowApprovalList') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/History') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/History') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/Repair') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/Repair') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/History_Repair') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/History_Repair') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
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

export default SidebarExecutive;