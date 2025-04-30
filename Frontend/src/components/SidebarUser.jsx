import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaThList, FaShoppingBag, FaCheckCircle, FaMoneyBillAlt, FaExchangeAlt, FaArchive, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { MdMenu, MdKeyboardArrowRight, MdAccessTimeFilled, MdCancel } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

function SidebarAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const handleNavigation = () => {
    if (window.innerWidth >= 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    // navigate('/login');
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
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
      {/* Mobile toggle button - ซ่อนใน desktop (sm ขึ้นไป) */}
      <button 
        id="toggle-button"
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
      >
        <MdMenu size={30} />
      </button>

      {/* Sidebar */}
      <aside 
        id="sidebar" 
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-gray-50 dark:bg-gray-800`} 
        aria-label="Admin sidebar"
      >
        <div className="h-full px-2 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
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
          
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            {/* Dashboard */}
            <li>
              <Link 
                to="/DashboardUs" 
                onClick={handleNavigation}
                className={`flex items-center p-2 rounded-lg group ${isActive('/DashboardUs') 
                  ? 'bg-blue-100 text-white dark:bg-blue-900 dark:text-white' 
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
              >
                <VscGraph size={22} />
                <span className="ms-3">หน้าแรก</span>
              </Link>
            </li>

            {/* Equipment List */}
            <li>
              <Link 
                to="/equipment" 
                onClick={handleNavigation}
                className={`flex items-center p-2 rounded-lg group ${isActive('/equipment') 
                  ? 'bg-blue-100 text-white dark:bg-blue-900 dark:text-white' 
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
              >
                <FaShoppingBag size={22} />
                <span className="flex-1 ms-3 whitespace-nowrap">รายการครุภัณฑ์</span>
              </Link>
            </li>

            {/* Borrowing Menu */}
            <li>
              <div 
                onClick={handleMenuClick} 
                className="flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group cursor-pointer"
                aria-expanded={openSubMenu}
                aria-controls="borrowing-submenu"
              >
                <div className="flex items-center">
                  <FaThList size={22} />
                  <span className="ms-3 whitespace-nowrap">รายการขอยืมครุภัณฑ์</span>
                </div>
                <MdKeyboardArrowRight size={20} className={`transition-transform ${openSubMenu ? "rotate-90" : ""}`} />
              </div>

              {/* Submenu */}
              <ul id="borrowing-submenu" className={`pl-10 mt-1 space-y-1 ${openSubMenu ? "block" : "hidden"}`}>
                <li>
                  <Link 
                    to="/borrow" 
                    onClick={handleNavigation}
                    className={`flex items-center p-2 rounded-lg ${isActive('/borrow') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
                  >
                    <MdAccessTimeFilled size={20} />
                    <span className="ms-3">รออนุมัติ</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/approve" 
                    onClick={handleNavigation}
                    className={`flex items-center p-2 rounded-lg ${isActive('/approve') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
                  >
                    <FaCheckCircle size={18} />
                    <span className="ms-3">อนุมัติ</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/return" 
                    onClick={handleNavigation}
                    className={`flex items-center p-2 rounded-lg ${isActive('/return') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
                  >
                    <FaExchangeAlt size={18} />
                    <span className="ms-3">ส่งคืน</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/fine" 
                    onClick={handleNavigation}
                    className={`flex items-center p-2 rounded-lg ${isActive('/fine') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
                  >
                    <FaMoneyBillAlt size={18} />
                    <span className="ms-3">ค่าปรับ</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cancel" 
                    onClick={handleNavigation}
                    className={`flex items-center p-2 rounded-lg ${isActive('/cancel') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
                  >
                    <MdCancel size={20} />
                    <span className="ms-3">ปฏิเสธ</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/completed" 
                    onClick={handleNavigation}
                    className={`flex items-center p-2 rounded-lg ${isActive('/completed') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
                  >
                    <FaArchive size={18} />
                    <span className="ms-3">เสร็จสิ้น</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Profile and Logout Section */}
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <Link 
                to="/edit_profile" 
                onClick={handleNavigation}
                className={`flex items-center p-2 rounded-lg group ${isActive('/edit_profile') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
              >
                <FaUserEdit size={22} />
                <span className="ms-3">แก้ไขข้อมูลส่วนตัว</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <FaSignOutAlt size={22} />
                <span className="ms-3">ออกจากระบบ</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </React.Fragment>
  );
}

export default SidebarAdmin;