import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaThList, FaShoppingBag, FaCheckCircle, FaMoneyBillAlt, FaExchangeAlt, FaArchive, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { MdMenu, MdKeyboardArrowRight } from "react-icons/md";

function SidebarAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = () => {
    // ไปหน้า /re
    navigate('/re');
    // เปิดเมนูย่อย
    setOpenSubMenu(!openSubMenu);
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

  return (
    <React.Fragment>
      {/* Mobile toggle button */}
      <button 
        id="toggle-button"
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
      >
        <span className="sr-only">Open sidebar</span>
        <MdMenu size={22} />
      </button>

      {/* Sidebar */}
      <aside id="sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-gray-50 dark:bg-gray-800`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">

            {/* หน้าแรก */}
            <li>
              <Link to="/DashboardUs" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span className="ms-3">หน้าแรก</span>
              </Link>
            </li>

            {/* รายการครุภัณฑ์ */}
            <li>
              <Link to="/equipment" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group">
                <FaShoppingBag size={22} />
                <span className="flex-1 ms-3 whitespace-nowrap">รายการครุภัณฑ์</span>
              </Link>
            </li>

            {/* รายการขอยืมครุภัณฑ์ (กดแล้วทั้งไปหน้า /re + เปิดเมนูย่อย) */}
            <li>
              <div onClick={handleMenuClick} className="flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group cursor-pointer">
                <div className="flex items-center">
                  <FaThList size={22} />
                  <span className="ms-3 whitespace-nowrap">รายการขอยืมครุภัณฑ์</span>
                </div>
                <MdKeyboardArrowRight size={20} className={`transition-transform ${openSubMenu ? "rotate-90" : ""}`} />
              </div>

              {/* Submenu */}
              <ul className={`pl-10 mt-1 space-y-1 ${openSubMenu ? "block" : "hidden"}`}>
                <li>
                  <Link to="/accept" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <FaCheckCircle size={18} />
                    <span className="ms-3">อนุมัติ</span>
                  </Link>
                </li>
                <li>
                  <Link to="/return" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <FaExchangeAlt size={18} />
                    <span className="ms-3">ส่งคืน</span>
                  </Link>
                </li>
                <li>
                  <Link to="/completed" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <FaArchive size={18} />
                    <span className="ms-3">เสร็จสิ้น</span>
                  </Link>
                </li>
                <li>
                  <Link to="/fine" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <FaMoneyBillAlt size={18} />
                    <span className="ms-3">ค่าปรับ</span>
                  </Link>
                </li>
              </ul>
            </li>

          </ul>

          {/* Profile and Logout Section */}
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group">
                <FaUserEdit size={22} />
                <span className="ms-3">แก้ไขข้อมูลส่วนตัว</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group">
                <FaSignOutAlt size={22} />
                <span className="ms-3">ออกจากระบบ</span>
              </a>
            </li>
          </ul>

        </div>
      </aside>
    </React.Fragment>
  );
}

export default SidebarAdmin;
