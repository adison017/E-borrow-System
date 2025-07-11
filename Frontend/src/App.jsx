import { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthSystem from './components/AuthSystem'; // เพิ่มบรรทัดนี้
import Footer from './components/Footer';
import Header from './components/Header';
import SidebarAdmin from './components/SidebarAdmin';
import SidebarExecutive from './components/SidebarExecutive';
import SidebarUser from './components/SidebarUser';
import './sidebar.css';

// Admin Pages
import BorrowList from './pages/admin/BorrowList';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManageCategory from './pages/admin/ManageCategory';
import ManageEquipment from './pages/admin/ManageEquipment';
import ManageNews from './pages/admin/ManageNews';
import ManageUser from './pages/admin/ManageUser';
import ReceiveItem from './pages/admin/ReceiveItem';
import ReturnList from './pages/admin/ReturnList';
import Success from './pages/admin/Success';

// Executive Pages
import BorrowApprovalList from './pages/executive/BorrowApprovalList';
import DashboardExeutive from './pages/executive/DashboardExeutive';
import Historybt from './pages/executive/Historyborrow';
import HistoryRe from './pages/executive/HistoryRepair';
import RepairApprovalList from './pages/executive/RepairApprovalList';

// User Pages
import Done from './pages/users/All_done';
import Approve from './pages/users/Approve';
import Borrow from './pages/users/Borrow';
import Cancel_re from './pages/users/Cancel_re';
import Edit_pro from './pages/users/edit_profile';
import Fine from './pages/users/Fine';
import NewsPage from './pages/users/NewsPage';
import Homes from './pages/users/Product';
import Return from './pages/users/Return';

function AppInner() {
  const [userRole, setUserRole] = useState('admin'); // Default role, can be changed based on login);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const defaultRoutes = {
    admin: '/DashboardAd',
    user: '/DashboardUs',
    executive: '/DashboardEx'
  };

  const changeRole = (role) => {
    setUserRole(role);
    if (defaultRoutes[role]) {
      navigate(defaultRoutes[role]);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  // // ถ้ายังไม่ได้ login ให้แสดงหน้า AuthSystem
  // if (!userRole) {
  //   return <AuthSystem onLoginSuccess={changeRole} />;
  // }

  // Navigate to the first menu item on application startup
  useEffect(() => {
    // Always navigate to the default route for the current role on app startup
    navigate(defaultRoutes[userRole] || '/DashboardUs');
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle route changes or root navigation
  useEffect(() => {
    if (location.pathname === '/') {
      // Navigate to the default route of the initial role if at root path
      if (defaultRoutes[userRole]) {
        navigate(defaultRoutes[userRole]);
      } else {
        navigate('/DashboardUs'); // Fallback if role not in defaultRoutes
      }
    }
  }, [userRole, navigate, location.pathname, defaultRoutes]);

  // ปิด sidebar overlay อัตโนมัติเมื่อจอกว้างขึ้น (desktop)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderSidebar = () => {
    switch (userRole) {
      case 'admin':
        return (
          <SidebarAdmin
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={toggleSidebarCollapse}
          />
        );
      case 'user':
        return (
          <SidebarUser
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={toggleSidebarCollapse}
          />
        );
      case 'executive':
        return (
          <SidebarExecutive
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={toggleSidebarCollapse}
          />
        );
      default:
        return null;
    }
  };

  // ถ้ายังไม่ได้ login ให้แสดงหน้า AuthSystem
  if (!userRole) {
    return <AuthSystem onLoginSuccess={changeRole} />;
  }

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-r from-indigo-950 md:from-7% sm:from-1% to-blue-700 text-black">
      {/* Hamburger button (mobile only) */}
      {!mobileOpen && (
        <button
          className="fixed top-4 left-4 z-50 block lg:hidden p-2 rounded-lg hover:bg-blue-700 text-white bg-gray-900/50 shadow-lg transition-all duration-200"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <MdMenu size={28} />
        </button>
      )}

      {/* Sidebar overlay (mobile) */}
      {mobileOpen && userRole === 'user' && (
        <SidebarUser
          isCollapsed={false}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          toggleCollapse={() => {}}
        />
      )}
      {mobileOpen && userRole === 'admin' && (
        <SidebarAdmin
          isCollapsed={false}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          toggleCollapse={() => {}}
        />
      )}
      {mobileOpen && userRole === 'executive' && (
        <SidebarExecutive
          isCollapsed={false}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          toggleCollapse={() => {}}
        />
      )}

      {/* Sidebar (desktop) */}
      <div
        className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white transition-all duration-300 ease-in-out flex-none hidden lg:block rounded-r-2xl fixed top-0 left-0 h-full z-30 shadow-xl`}
        style={{
          animation: isSidebarCollapsed ? 'none' : 'slideIn 0.3s ease-in-out'
        }}
      >
        {renderSidebar()}
      </div>

      {/* Main content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 w-full bg-gradient-to-r from-indigo-950 md:from-2% sm:from-1% to-blue-700 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <Header userRole={userRole} changeRole={changeRole} />
        {/* Content */}
        <div className="bg-white p-4 m-4 rounded-xl flex-1 min-h-0">
          <Routes>
            {/* Admin Routes */}
            {userRole === 'admin' && (
              <>
                <Route path="/DashboardAd" element={<DashboardAdmin />} />
                <Route path="/borrow-list" element={<BorrowList />} />
                <Route path="/equipment" element={<ManageEquipment />} />
                <Route path="/members" element={<ManageUser />} />
                <Route path="/return-list" element={<ReturnList />} />
                <Route path="/ReceiveItem" element={<ReceiveItem />} />
                <Route path="/category" element={<ManageCategory />} />
                <Route path="/success" element={<Success />} />
                <Route path="/manage-news" element={<ManageNews />} />
                <Route path="/edit_profile" element={<Edit_pro />} />
                <Route path="/reports" element={<DashboardAdmin />} />
                <Route path="*" element={<Navigate to="/DashboardAd" replace />} />
              </>
            )}

            {/* Executive Routes */}
            {userRole === 'executive' && (
              <>
                <Route path="/DashboardEx" element={<DashboardExeutive />} />
                <Route path="/BorrowApprovalList" element={<BorrowApprovalList />} />
                <Route path="/Repair" element={<RepairApprovalList />} />
                <Route path="/History" element={<Historybt />} />
                <Route path="/History_repair" element={<HistoryRe />} />
                <Route path="/edit_profile" element={<Edit_pro />} />
                <Route path="*" element={<Navigate to="/DashboardEx" replace />} />
              </>
            )}

            {/* User Routes */}
            {userRole === 'user' && (
              <>
                <Route path="/DashboardUs" element={<NewsPage />} />
                <Route path="/equipment" element={<Homes />} />
                <Route path="/approve" element={<Approve />} />
                <Route path="/return" element={<Return />} />
                <Route path="/completed" element={<Done />} />
                <Route path="/borrow" element={<Borrow />} />
                <Route path="/cancel" element={<Cancel_re />} />
                <Route path="/fine" element={<Fine />} />
                <Route path="/edit_profile" element={<Edit_pro />} />
                <Route path="*" element={<Navigate to="/DashboardUs" replace />} />
              </>
            )}
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;