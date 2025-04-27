import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    setErrorMsg('');
    
    axios.get('http://localhost:3000/api/users')
      .then(res => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading users:', err);
        setErrorMsg('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setIsLoading(false);
      });
  };

  // ฟังก์ชันในการ handle การเปลี่ยนแปลงของฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  // ฟังก์ชันในการเพิ่มผู้ใช้ใหม่
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // อัปเดตผู้ใช้ที่มีอยู่
      axios.put(`http://localhost:3000/api/users/${editingUser.id}`, editingUser)
        .then(() => {
          setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
          setEditingUser(null);
          setIsFormOpen(false);
          showToast('✅ อัพเดตข้อมูลเรียบร้อยแล้ว');
        })
        .catch(err => {
          console.error('❌ Error updating user:', err);
          showToast('❌ เกิดข้อผิดพลาดในการอัพเดตข้อมูล', true);
        });
    } else {
      // เพิ่มผู้ใช้ใหม่
      axios.post('http://localhost:3000/api/users', newUser)
        .then(res => {
          setUsers([...users, res.data]);
          setNewUser({ name: '', email: '' });
          setIsFormOpen(false);
          showToast('✅ เพิ่มนักเรียนเรียบร้อยแล้ว');
        })
        .catch(err => {
          console.error('❌ Error adding user:', err);
          showToast('❌ เกิดข้อผิดพลาดในการเพิ่มข้อมูล', true);
        });
    }
  };

  // ฟังก์ชันในการลบผู้ใช้
  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลนักเรียนนี้ใช่หรือไม่?')) {
      axios.delete(`http://localhost:3000/api/users/${id}`)
        .then(() => {
          setUsers(users.filter(user => user.id !== id));
          showToast('✅ ลบข้อมูลเรียบร้อยแล้ว');
        })
        .catch(err => {
          console.error('❌ Error deleting user:', err);
          showToast('❌ เกิดข้อผิดพลาดในการลบข้อมูล', true);
        });
    }
  };

  // ฟังก์ชันในการเริ่มแก้ไขผู้ใช้
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // ฟังก์ชันเพื่อยกเลิกการแก้ไข
  const cancelEdit = () => {
    setEditingUser(null);
    setNewUser({ name: '', email: '' });
    setIsFormOpen(false);
  };

  // แสดง Toast notification
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  
  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3000);
  };

  // กรองผู้ใช้ตามคำค้นหา
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
          toast.isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      
      <div className="max-w-5xl mx-auto">
        
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Card Header with Search and Add Button */}
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">📋</span> รายชื่อนักเรียนทั้งหมด
              </h2>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-indigo-300">🔍</span>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white bg-opacity-90"
                    placeholder="ค้นหานักเรียน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Add Button */}
                <button 
                  onClick={() => {setIsFormOpen(true); setEditingUser(null);}}
                  className="whitespace-nowrap flex items-center gap-2 bg-white text-indigo-700 py-2 px-4 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium shadow-sm"
                >
                  <span>➕</span>
                  เพิ่มนักเรียน
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : errorMsg ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
                <p className="text-lg mb-2">⚠️ {errorMsg}</p>
                <button 
                  onClick={fetchUsers}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ลองใหม่อีกครั้ง
                </button>
              </div>
            ) : (
              <>
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ลำดับ
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ชื่อ
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            อีเมล
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            จัดการ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                          <tr key={user.id} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                                  title="แก้ไขข้อมูล"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-105 hover:shadow-md"
                                  title="ลบข้อมูล"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-1">
                      {searchTerm ? "ไม่พบข้อมูลที่ตรงกับการค้นหา" : "ยังไม่มีข้อมูลนักเรียน"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? `ไม่พบผลลัพธ์สำหรับ "${searchTerm}" ลองคำค้นหาอื่น`
                        : "เริ่มต้นเพิ่มข้อมูลนักเรียนด้วยการคลิกที่ปุ่ม 'เพิ่มนักเรียน'"
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        ล้างการค้นหา
                      </button>
                    )}
                  </div>
                )}
                
                {/* Results Summary */}
                {filteredUsers.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span>แสดง {filteredUsers.length} รายการ {searchTerm && `จากการค้นหา "${searchTerm}"`}</span>
                    <button
                      onClick={fetchUsers}
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      🔄 รีเฟรช
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
     
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                {editingUser ? "✏️ แก้ไขข้อมูลนักเรียน" : "➕ เพิ่มนักเรียนใหม่"}
              </h3>
              <button 
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
              >
                ❌
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">ชื่อ</label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editingUser ? editingUser.name : newUser.name}
                    onChange={handleChange}
                    className="p-3 pl-10 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                    placeholder="กรอกชื่อนักเรียน"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">👤</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">อีเมล</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editingUser ? editingUser.email : newUser.email}
                    onChange={handleChange}
                    className="p-3 pl-10 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                    placeholder="user@example.com"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">✉️</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center justify-center gap-2 px-4 py-3 w-1/2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  ❌ ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-3 w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  💾 {editingUser ? "บันทึกการแก้ไข" : "เพิ่มนักเรียน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;