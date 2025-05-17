import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import SidebarAdmin from './components/SidebarAdmin';
import SidebarExecutive from './components/SidebarExecutive';
import SidebarUser from './components/SidebarUser';

import BorrowList from './pages/admin/BorrowList';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManageEquipment from './pages/admin/ManageEquipment';
import ManageUser from './pages/admin/ManageUser';
import ReturnList from './pages/admin/ReturnList';
import DashboardExeutive from './pages/executive/DashboardExeutive';

import DashboardUser from './pages/users/Dashboard';
import Homes from './pages/users/Product';
import User_re from './pages/users/Requirement';
import Approve from './pages/users/Approve';
import Return from './pages/users/Return';
import Done from './pages/users/All_done';
import Borrow from './pages/users/Borrow';
import Cancel_re from './pages/users/Cancel_re';
import Fine from './pages/users/Fine';
import ReceiveItem from './pages/admin/ReceiveItem';
import Edit_pro from './pages/users/edit_profile';
import ManageCategory from './pages/admin/ManageCategory';
import BorrowApprovalList from './pages/executive/BorrowApprovalList'
import RepairApprovalList from './pages/executive/RepairApprovalList'
import Historybt from './pages/executive/Historyborrow'
import HistoryRe from './pages/executive/HistoryRepair'
import Success from './pages/admin/Success'

function AppInner() {
  const [userRole, setUserRole] = useState('executive'); // เริ่มต้นเป็น user (แก้ทีหลังเป็นจากระบบ login)
  const navigate = useNavigate();
  const location = useLocation();

  // เปลี่ยนบทบาท (สำหรับทดสอบ)
  const changeRole = (role) => {
    setUserRole(role);
  };

  // หากอยู่หน้า '/' ให้ redirect ไปยัง dashboard ตามบทบาท
  useEffect(() => {
    if (location.pathname === '/') {
      switch (userRole) {
        case 'admin':
          navigate('/DashboardAd');
          break;
        case 'user':
          navigate('/DashboardUs');
          break;
        case 'executive':
          navigate('/DashboardEx');
          break;
        default:
          navigate('/DashboardUs');
      }
    }
  }, [userRole, navigate, location.pathname]);

  // แสดง Sidebar ตามบทบาท
  const renderSidebar = () => {
    switch (userRole) {
      case 'admin':
        return <SidebarAdmin />;
      case 'user':
        return <SidebarUser />;
      case 'executive':
        return <SidebarExecutive />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-indigo-950 md:from-15% to-blue-700 text-black rounded-2xl">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gradient-to-r from-indigo-950 to-blue-700">
        <aside>{renderSidebar()}</aside>
      </div>

      {/* Main content */}
      <main className="flex-1">
      <header className="bottom-0 z-50">
          <Header userRole={userRole} changeRole={changeRole} />
        </header>

        {/* Routes */}
        <div className="bg-white p-2 rounded-3xl">
          <Routes>
            {(userRole === 'admin' || userRole === 'executive') && (
              <>
                <Route path="/DashboardAd" element={<DashboardAdmin />} />
                <Route path="/DashboardEx" element={<DashboardExeutive />} />
                <Route path="/borrow-list" element={<BorrowList />} />
                <Route path="/equipment" element={<ManageEquipment />} />
                <Route path="/members" element={<ManageUser />} />
                <Route path="/return-list" element={<ReturnList />} />
                <Route path="/ReceiveItem" element={<ReceiveItem />} />
                <Route path="/category" element={<ManageCategory />} />
                <Route path="/edit_profile" element={<Edit_pro />} />
                <Route path="/BorrowApprovalList" element={<BorrowApprovalList />} />
                <Route path="/Repair" element={<RepairApprovalList />} />
                <Route path="/History" element={<Historybt />} />
                <Route path="/History_repair" element={<HistoryRe />} />
                <Route path="/success" element={<Success />} />.0
              </>
            )}
            {(userRole === 'admin' || userRole === 'user') && (
              <>
                <Route path="/DashboardUs" element={<DashboardUser />} />
                <Route path="/equipment" element={<Homes />} />
                <Route path="/re" element={<User_re />} />
                <Route path="/approve" element={<Approve />} />
                <Route path="/return" element={<Return />} />
                <Route path="/completed" element={<Done />} />
                <Route path="/borrow" element={<Borrow />} />
                <Route path="/cancel" element={<Cancel_re />} />
                <Route path="/fine" element={<Fine />} />
                <Route path="/edit_profile" element={<Edit_pro />} />
              </>
            )}
          </Routes>
        </div>

        <footer className="bottom-0 z-50">
          <Footer />
        </footer>
      </main>
    </div>
  );
}

// ครอบ AppInner ด้วย Router
function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;