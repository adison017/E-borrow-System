import React, { useState } from 'react';
import { AiFillHome } from "react-icons/ai";
import { FaArchive, FaCheckCircle, FaMoneyBillAlt, FaShoppingBag, FaSignOutAlt, FaThList, FaUserEdit } from "react-icons/fa";
import { MdAccessTimeFilled, MdCancel, MdClose, MdKeyboardArrowRight, MdMenu } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const borrowingMenus = [
  { to: '/borrow', icon: <MdAccessTimeFilled size={20} />, label: 'รออนุมัติ', key: 'borrow' },
  { to: '/approve', icon: <FaCheckCircle size={18} />, label: 'อนุมัติ', key: 'approve' },
  { to: '/return', icon: <RiArrowGoBackLine size={18} />, label: 'คืนครุภัณฑ์', key: 'return' },
  { to: '/fine', icon: <FaMoneyBillAlt size={18} />, label: 'ค้างชำระเงิน', key: 'fine' },
  { to: '/cancel', icon: <MdCancel size={20} />, label: 'ปฏิเสธ', key: 'cancel' },
  { to: '/completed', icon: <FaArchive size={18} />, label: 'เสร็จสิ้น', key: 'completed' },
];

function SidebarUser({ isCollapsed, toggleCollapse, mobileOpen, setMobileOpen }) {
  const [openSubMenu, setOpenSubMenu] = useState(false);
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
              <MdClose size={26} />
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
              to="/DashboardUs"
              onClick={() => handleMenuClick('/DashboardUs')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/DashboardUs') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/DashboardUs') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
              title="หน้าแรก"
            >
              <AiFillHome size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">หน้าแรก</span>}
            </Link>
          </li>
          {/* Equipment List */}
          <li className={isCollapsed ? "w-full flex justify-center" : undefined}>
            <Link
              to="/equipment"
              onClick={() => handleMenuClick('/equipment')}
              className={isCollapsed
                ? `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive('/equipment') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`
                : `flex items-center p-3 rounded-xl group ${isActive('/equipment') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start`}
              title="รายการครุภัณฑ์"
            >
              <FaShoppingBag size={22} />
              {!isCollapsed && <span className="ms-3 font-medium">รายการครุภัณฑ์</span>}
            </Link>
          </li>
          {/* Borrowing Menu */}
          {isCollapsed ? (
            <>
              {borrowingMenus.map((item) => (
                <li key={item.key} className="w-full flex justify-center">
                  <Link
                    to={item.to}
                    onClick={() => handleMenuClick(item.to)}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group
                      ${isActive(item.to) ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`}
                    title={item.label}
                  >
                    {item.icon}
                  </Link>
                </li>
              ))}
              {/* Profile */}
              <li className="w-full flex justify-center">
                <Link
                  to="/edit_profile"
                  onClick={() => handleMenuClick('/edit_profile')}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group
                    ${isActive('/edit_profile') ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-gray-700'}`}
                  title="แก้ไขข้อมูลส่วนตัว"
                >
                  <FaUserEdit size={22} />
                </Link>
              </li>
              {/* Logout */}
              <li className="w-full flex justify-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:bg-blue-100 text-gray-700"
                  title="ออกจากระบบ"
                >
                  <FaSignOutAlt size={22} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <div
                  onClick={() => setOpenSubMenu(!openSubMenu)}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 text-gray-700 rounded-xl cursor-pointer group w-full transition-all duration-200"
                >
                  <div className="flex items-center">
                    <FaThList size={22} />
                    <span className="ms-3 font-medium">รายการขอยืมครุภัณฑ์</span>
                  </div>
                  <MdKeyboardArrowRight
                    size={20}
                    className={`transition-transform duration-200 ${openSubMenu ? "rotate-90" : ""}`}
                  />
                </div>
                {/* Submenu */}
                <ul className={`ml-6 mt-2 space-y-2 pl-4 transition-all duration-200 ${openSubMenu ? "block" : "hidden"}`}>
                  {borrowingMenus.map((item) => (
                    <li key={item.key}>
                      <Link
                        to={item.to}
                        onClick={() => handleMenuClick(item.to)}
                        className={`flex items-center p-3 rounded-xl ${isActive(item.to) ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start transition-all duration-200`}
                      >
                        {item.icon}
                        <span className="ms-3 font-medium">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {/* Profile and Logout Section expanded */}
              <li>
                <Link
                  to="/edit_profile"
                  onClick={() => handleMenuClick('/edit_profile')}
                  className={`flex items-center p-3 rounded-xl group ${isActive('/edit_profile') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'} w-full justify-start transition-all duration-200`}
                >
                  <FaUserEdit size={22} />
                  <span className="ms-3 font-medium">แก้ไขข้อมูลส่วนตัว</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-gray-100 text-gray-700 justify-start transition-all duration-200"
                >
                  <FaSignOutAlt size={22} />
                  <span className="ms-3 font-medium">ออกจากระบบ</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SidebarUser;