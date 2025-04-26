import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import SidebarAdmin from './components/SidebarAdmin';
import SidebarExecutive from './components/SidebarExecutive';
import SidebarUser from './components/SidebarUser';

import BorrowList from './pages/BorrowList';
import CheckInfo from './pages/CheckInfo';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardExeutive from './pages/DashboardExeutive';
import DashboardUser from './pages/DashboardUser';
import Home from './pages/Home';
import ManageEquipment from './pages/ManageEquipment';
import ManageUser from './pages/ManageUser';
import Signin from './pages/Sign_in';
import User_re from './pages/User_requirement';

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
    <div className=" min-h-screen flex flex-col md:flex-row bg-gray-50 text-black">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md">
        <aside>{renderSidebar()}</aside>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4">
        <Header />

        {/* ปุ่มเปลี่ยนบทบาท (ใช้ทดสอบ) */}
        <div className="mb-4 bg-gray-100 p-2 rounded flex gap-2">
          <button
            onClick={() => changeRole('admin')}
            className={`px-3 py-1 rounded ${userRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            ผู้ดูแลระบบ
          </button>
          <button
            onClick={() => changeRole('user')}
            className={`px-3 py-1 rounded ${userRole === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            ผู้ใช้งาน
          </button>
          <button
            onClick={() => changeRole('executive')}
            className={`px-3 py-1 rounded ${userRole === 'executive' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            ผู้บริหาร
          </button>
        </div>

        {/* Routes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Routes>
            {(userRole === 'admin' || userRole === 'executive') && (
              <>
                <Route path="/DashboardAd" element={<DashboardAdmin />} />
                <Route path="/DashboardEx" element={<DashboardExeutive />} />
                <Route path="/borrow-list" element={<BorrowList />} />
                <Route path="/equipment" element={<ManageEquipment />} />
                <Route path="/Check" element={<CheckInfo />} />
                <Route path="/members" element={<ManageUser />} />
              </>
            )}
            {(userRole === 'admin' || userRole === 'user') && (
              <>
              <Route path="/DashboardUs" element={<DashboardUser />} />
              <Route path="/equipment" element={<Home />} />
              <Route path="/s" element={<Signin />} />
              <Route path="/re" element={<User_re />} />
              </>
            )}
          </Routes>
        </div>

        <Footer />
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
