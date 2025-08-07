import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Typography, Button, Textarea, Input } from '@material-tailwind/react';
import {
  MdSettings,
  MdContactPhone,
  MdLocationOn,
  MdAccessTime,
  MdNotifications,
  MdSecurity,
  MdStorage,
  MdLanguage,
  MdSave,
  MdRefresh,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdPeople,
  MdBarChart,
  MdWifiTethering
} from 'react-icons/md';
import { ImMail4 } from "react-icons/im";
import { authFetch } from '../../utils/api';
import { getCloudinaryConfig, testCloudinaryConnection as testConnection, getCloudinaryUsageStats as getUsageStats, createCloudinaryFolders, listCloudinaryFolders } from '../../utils/cloudinaryUtils';
import Notification from '../../components/Notification';

const SystemSettings = () => {
  const [contactInfo, setContactInfo] = useState({
    location: '',
    phone: '',
    hours: ''
  });
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloud_name: '',
    api_key: '',
    is_configured: false
  });
  const [notificationStats, setNotificationStats] = useState({
    overall: { total_users: 0, users_with_line: 0, users_enabled_line: 0 },
    by_role: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [activeTab, setActiveTab] = useState('notifications');
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);

  useEffect(() => {
    fetchContactInfo();
    fetchCloudinaryConfig();
    if (activeTab === 'notifications') {
      fetchNotificationStats();
      fetchUsers();
    }
  }, [activeTab]);



  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:5000/api/contact-info');
      const data = await response.json();

      if (data.success && data.data) {
        setContactInfo({
          location: data.data.location || '',
          phone: data.data.phone || '',
          hours: data.data.hours || ''
        });
      } else {
        console.log('No contact info found or error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดึงข้อมูลติดต่อได้',
        type: 'error'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCloudinaryConfig = async () => {
    try {
      setLoading(true);
      const data = await getCloudinaryConfig();

      if (data.success && data.data) {
        setCloudinaryConfig(data.data);
      } else {
        console.log('No cloudinary config found or error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cloudinary config:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดึงข้อมูลการตั้งค่า Cloudinary ได้',
        type: 'error'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const testCloudinaryConnection = async () => {
    try {
      setLoading(true);
      const data = await testConnection();

      if (data.success) {
        setNotificationData({
          title: 'สำเร็จ',
          message: data.message,
          type: 'success'
        });
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message || 'ไม่สามารถเชื่อมต่อ Cloudinary ได้',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error testing cloudinary connection:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถทดสอบการเชื่อมต่อ Cloudinary ได้',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  const getCloudinaryUsageStats = async () => {
    try {
      setLoading(true);
      const data = await getUsageStats();

      if (data.success) {
        setNotificationData({
          title: 'ข้อมูลสถิติการใช้งาน',
          message: 'ดึงข้อมูลสถิติการใช้งาน Cloudinary สำเร็จ',
          type: 'success'
        });
        // You can display the stats in a modal or another component
        console.log('Cloudinary usage stats:', data.data);
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message || 'ไม่สามารถดึงข้อมูลสถิติการใช้งานได้',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error getting cloudinary usage stats:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดึงข้อมูลสถิติการใช้งานได้',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  const createCloudinaryFolderStructure = async () => {
    try {
      setLoading(true);
      const data = await createCloudinaryFolders();

      if (data.success) {
        setNotificationData({
          title: 'สร้าง Folder Structure สำเร็จ',
          message: 'สร้าง folder structure ใน Cloudinary สำเร็จแล้ว',
          type: 'success'
        });
        setShowNotification(true);
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message || 'ไม่สามารถสร้าง folder structure ได้',
          type: 'error'
        });
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error creating cloudinary folders:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถสร้าง folder structure ได้',
        type: 'error'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const listCloudinaryFolderStructure = async () => {
    try {
      setLoading(true);
      const data = await listCloudinaryFolders();

      if (data.success) {
        setNotificationData({
          title: 'รายการ Folder',
          message: `พบ folder ทั้งหมด ${data.data.folders.length} รายการ`,
          type: 'success'
        });
        setShowNotification(true);
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message || 'ไม่สามารถดึงรายการ folder ได้',
          type: 'error'
        });
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error listing cloudinary folders:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดึงรายการ folder ได้',
        type: 'error'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationStats = async (force = false) => {
    try {
      // Skip if we're in the middle of updating stats (unless forced)
      if (isUpdatingStats && !force) {
        console.log('Skipping stats fetch - currently updating');
        return;
      }

      const response = await authFetch('http://localhost:5000/api/notification-settings/stats');
      const data = await response.json();

      if (data.success && data.data) {
        console.log('Fetched fresh stats from server:', {
          overall: data.data.overall,
          by_role: data.data.by_role,
          explanation: 'users_enabled_line should only count users with LINE ID and enabled=1'
        });
        setNotificationStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authFetch('http://localhost:5000/api/notification-settings/users');
      const data = await response.json();

      if (data.success && data.data) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้',
        type: 'error'
      });
      setShowNotification(true);
    }
  };



  const testLineConnection = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:5000/api/notification-settings/test-line-connection', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        setNotificationData({
          title: 'การเชื่อมต่อสำเร็จ',
          message: data.message,
          type: 'success'
        });
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message || 'ไม่สามารถเชื่อมต่อ LINE Bot ได้',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error testing LINE connection:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถทดสอบการเชื่อมต่อ LINE Bot ได้',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  // ฟังก์ชันสำหรับเปิด/ปิดการแจ้งเตือนตาม role
  const toggleRoleNotification = async (roleName, enabled) => {
    try {
      setLoading(true);

      // หาผู้ใช้ที่มี role นี้และมี LINE ID
      const usersInRole = users.filter(user =>
        user.role_name === roleName &&
        user.line_id !== 'ยังไม่ผูกบัญชี'
      );

      if (usersInRole.length === 0) {
        setNotificationData({
          title: 'ไม่มีผู้ใช้งาน',
          message: `ไม่มีผู้ใช้งานในตำแหน่ง ${roleName} ที่ผูก LINE ID`,
          type: 'warning'
        });
        setShowNotification(true);
        return;
      }

      const userIds = usersInRole.map(user => user.user_id);

      const response = await authFetch('http://localhost:5000/api/notification-settings/bulk-toggle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds, enabled })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(prev => prev.map(user =>
          userIds.includes(user.user_id)
            ? { ...user, line_notify_enabled: enabled ? 1 : 0 }
            : user
        ));

        // Update stats immediately for instant UI feedback
        setNotificationStats(prev => {
          const updatedByRole = prev.by_role.map(roleStats => {
            if (roleStats.role_name === roleName) {
              return {
                ...roleStats,
                users_enabled_line: enabled ? roleStats.users_with_line : 0
              };
            }
            return roleStats;
          });

          // Calculate new overall stats - sum only from roles that have users with LINE
          const newOverallEnabled = updatedByRole.reduce((sum, role) => sum + role.users_enabled_line, 0);

          return {
            ...prev,
            overall: {
              ...prev.overall,
              users_enabled_line: newOverallEnabled
            },
            by_role: updatedByRole
          };
        });

        // Also refresh from server to ensure accuracy
        setTimeout(() => {
          fetchNotificationStats();
        }, 100);

        setNotificationData({
          title: 'สำเร็จ',
          message: `${enabled ? 'เปิด' : 'ปิด'}การแจ้งเตือน LINE สำหรับตำแหน่ง ${roleName} (${userIds.length} คน)`,
          type: 'success'
        });
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error toggling role notification:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเปลี่ยนการตั้งค่าการแจ้งเตือนตาม role ได้',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

    // ฟังก์ชันสำหรับเปิด/ปิดการแจ้งเตือนทั้งหมด
  const toggleAllNotifications = async (enabled) => {
    try {
      setLoading(true);
      setIsUpdatingStats(true);
      console.log('toggleAllNotifications called with:', { enabled, users: users.length });

      // หาผู้ใช้ทั้งหมดที่มี LINE ID
      const usersWithLine = users.filter(user =>
        user.line_id !== 'ยังไม่ผูกบัญชี'
      );

      console.log('Users with LINE:', {
        total: users.length,
        withLine: usersWithLine.length,
        usersWithLine: usersWithLine.map(u => ({ id: u.user_id, name: u.Fullname, line_id: u.line_id, enabled: u.line_notify_enabled }))
      });

      if (usersWithLine.length === 0) {
        setNotificationData({
          title: 'ไม่มีผู้ใช้งาน',
          message: 'ไม่มีผู้ใช้งานที่ผูก LINE ID',
          type: 'warning'
        });
        setShowNotification(true);
        return;
      }

      const userIds = usersWithLine.map(user => user.user_id);

      console.log('Making API call:', {
        url: 'http://localhost:5000/api/notification-settings/bulk-toggle',
        payload: { userIds, enabled }
      });

      const response = await authFetch('http://localhost:5000/api/notification-settings/bulk-toggle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds, enabled })
      });

      const data = await response.json();
      console.log('API response:', data);

      if (data.success) {
        // Update local state immediately for better UX
        setUsers(prev => {
          const updated = prev.map(user =>
            userIds.includes(user.user_id)
              ? { ...user, line_notify_enabled: enabled ? 1 : 0 }
              : user
          );
          console.log('Updated users state:', updated.filter(u => userIds.includes(u.user_id)));
          return updated;
        });

                                // Update stats immediately based on actual database logic
        setNotificationStats(prev => {
          // Calculate new enabled count: only users with LINE ID and enabled = 1
          const newEnabledCount = enabled ? prev.overall.users_with_line : 0;

          const newStats = {
            ...prev,
            overall: {
              ...prev.overall,
              users_enabled_line: newEnabledCount
            }
          };
          console.log('Updated notification stats:', {
            previous: prev.overall,
            new: newStats.overall,
            enabled,
            calculation: `${enabled ? 'enabling' : 'disabling'} all users with LINE`
          });
          return newStats;
        });

        // Delay server refresh to avoid UI flickering
        setTimeout(() => {
          console.log('Refreshing global stats from server...');
          setIsUpdatingStats(false);
          fetchNotificationStats(true); // Force refresh
        }, 1000);

        setNotificationData({
          title: 'สำเร็จ',
          message: `${enabled ? 'เปิด' : 'ปิด'}การแจ้งเตือน LINE สำหรับผู้ใช้งานทั้งหมด (${userIds.length} คน)`,
          type: 'success'
        });
      } else {
        console.error('API error:', data.message);
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error toggling all notifications:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเปลี่ยนการตั้งค่าการแจ้งเตือนทั้งหมดได้',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setShowNotification(true);
      // Reset updating flag in case of error
      setTimeout(() => {
        setIsUpdatingStats(false);
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:5000/api/contact-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo)
      });

      const data = await response.json();

      if (data.success) {
        setNotificationData({
          title: 'สำเร็จ',
          message: data.message || 'อัปเดตข้อมูลติดต่อสำเร็จ',
          type: 'success'
        });
        // อัปเดตข้อมูลใน state หลังจากบันทึกสำเร็จ
        setContactInfo({
          location: data.data.location || contactInfo.location,
          phone: data.data.phone || contactInfo.phone,
          hours: data.data.hours || contactInfo.hours
        });
      } else {
        setNotificationData({
          title: 'เกิดข้อผิดพลาด',
          message: data.message || 'ไม่สามารถอัปเดตข้อมูลได้',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      setNotificationData({
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถอัปเดตข้อมูลได้',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  const tabs = [
    {
      label: "การแจ้งเตือน",
      value: "notifications",
      icon: <MdNotifications className="w-5 h-5" />,
    },
    {
      label: "ความปลอดภัย",
      value: "security",
      icon: <MdSecurity className="w-5 h-5" />,
    },
    {
      label: "การจัดเก็บ",
      value: "storage",
      icon: <MdStorage className="w-5 h-5" />,
    },
    {
      label: "ภาษา",
      value: "language",
      icon: <MdLanguage className="w-5 h-5" />,
    },
  ];



  const renderNotificationSettings = () => {
    const uniqueRoles = [...new Set(users.map(user => user.role_name))];

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section - Modern & Clean */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                  <MdNotifications className="text-3xl text-indigo-600" />
          </div>
          <div>
                  <Typography variant="h4" className="text-gray-800 font-bold mb-1">
                    การแจ้งเตือน LINE
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
                    จัดการการแจ้งเตือนสำหรับผู้ใช้งานทั้งหมด
            </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="paragraph" className="text-sm text-gray-500 mb-1">
                  สถานะระบบ
                </Typography>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Typography variant="paragraph" className="text-sm font-medium text-green-600">
                    ออนไลน์
                  </Typography>
                </div>
              </div>
          </div>
        </div>
      </div>

        {/* Quick Stats - Compact & Beautiful */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="text-gray-800 font-bold">
                  {notificationStats.overall.total_users}
            </Typography>
                <Typography variant="paragraph" className="text-gray-500 text-sm mt-1">
                  ผู้ใช้งานทั้งหมด
            </Typography>
          </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MdPeople className="text-xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="text-gray-800 font-bold">
                  {notificationStats.overall.users_with_line}
                </Typography>
                <Typography variant="paragraph" className="text-gray-500 text-sm mt-1">
                  ผูก LINE แล้ว
                </Typography>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <MdWifiTethering className="text-xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="text-gray-800 font-bold">
                  {notificationStats.overall.users_enabled_line}
                </Typography>
                <Typography variant="paragraph" className="text-gray-500 text-sm mt-1">
                  เปิดการแจ้งเตือน
                </Typography>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <MdNotifications className="text-xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="text-gray-800 font-bold">
                  {Math.round((notificationStats.overall.users_enabled_line / notificationStats.overall.users_with_line) * 100) || 0}%
                </Typography>
                <Typography variant="paragraph" className="text-gray-500 text-sm mt-1">
                  อัตราการใช้งาน
                </Typography>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MdBarChart className="text-xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>



        {/* LINE Bot Connection Test - Simplified */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <MdWifiTethering className="text-2xl text-green-600" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-800 font-bold mb-1">
                  ทดสอบการเชื่อมต่อ LINE Bot
                </Typography>
                <Typography variant="paragraph" className="text-gray-600 text-sm">
                  ตรวจสอบว่าระบบสามารถส่งการแจ้งเตือนได้หรือไม่
                </Typography>
              </div>
            </div>
            <Button
              onClick={testLineConnection}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  กำลังทดสอบ...
                </>
              ) : (
                <>
                  <MdWifiTethering className="text-lg" />
                  ทดสอบการเชื่อมต่อ
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <MdContactPhone className="text-2xl text-blue-600" />
            </div>
            <div>
              <Typography variant="h6" className="text-gray-800 font-bold mb-1">
                ข้อมูลติดต่อเจ้าหน้าที่
              </Typography>
              <Typography variant="paragraph" className="text-gray-600 text-sm">
                ข้อมูลนี้จะแสดงในข้อความแจ้งเตือน LINE เมื่อมีการอนุมัติการขอยืมครุภัณฑ์
              </Typography>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MdLocationOn className="text-blue-600" />
                สถานที่ติดต่อ
              </label>
              <Input
                type="text"
                name="location"
                value={contactInfo.location}
                onChange={handleInputChange}
                placeholder="เช่น ห้องพัสดุ อาคาร 1 ชั้น 2"
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MdContactPhone className="text-blue-600" />
                เบอร์โทรศัพท์
              </label>
              <Input
                type="text"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                placeholder="เช่น 02-123-4567"
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MdAccessTime className="text-blue-600" />
                เวลาทำการ
              </label>
              <Input
                type="text"
                name="hours"
                value={contactInfo.hours}
                onChange={handleInputChange}
                placeholder="เช่น 8:30-16:30 น."
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{ className: "min-w-[100px]" }}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outlined"
                onClick={fetchContactInfo}
                disabled={loading}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <MdRefresh className="text-lg" />
                รีเฟรช
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <MdSave className="text-lg" />
                    บันทึก
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-50 rounded-xl">
              <MdInfo className="text-2xl text-green-600" />
            </div>
            <div>
              <Typography variant="h6" className="text-gray-800 font-bold mb-1">
                ตัวอย่างการแสดงผลใน LINE
              </Typography>
              <Typography variant="paragraph" className="text-gray-600 text-sm">
                ข้อมูลติดต่อจะแสดงในข้อความแจ้งเตือนเมื่อมีการอนุมัติการขอยืมครุภัณฑ์
              </Typography>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            {/* LINE Message Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <div>
                <Typography variant="paragraph" className="text-green-700 font-bold text-sm">
                  ระบบยืมครุภัณฑ์
                </Typography>
                <Typography variant="paragraph" className="text-green-600 text-xs">
                  📦 สถานะคำขอยืมของคุณ
                </Typography>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <Typography variant="paragraph" className="text-green-700 font-bold">
                    สถานะ: อนุมัติแล้ว
                  </Typography>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <Typography variant="paragraph" className="text-gray-600 text-sm mb-2">
                    รหัสการยืม: BR240115001
                  </Typography>
                  <Typography variant="paragraph" className="text-gray-600 text-sm mb-2">
                    วันที่ยืม: 15/01/2024
                  </Typography>
                  <Typography variant="paragraph" className="text-gray-600 text-sm mb-3">
                    วันที่คืน: 20/01/2024
                  </Typography>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <Typography variant="paragraph" className="text-gray-700 font-semibold text-sm mb-2">
                    รายการอุปกรณ์และสถานที่รับ:
                  </Typography>
                  <Typography variant="paragraph" className="text-gray-600 text-sm mb-3">
                    • โปรเจคเตอร์ (PROJ001) x1 รับที่: ห้องเรียน 101
                  </Typography>
                </div>

                {/* Contact Info Preview */}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2 mb-3">
                    <MdContactPhone className="text-blue-600 text-lg" />
                    <Typography variant="paragraph" className="text-blue-600 font-bold text-sm">
                      ติดต่อเจ้าหน้าที่:
                    </Typography>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MdLocationOn className="text-blue-600 text-sm" />
                        <Typography variant="paragraph" className="text-blue-700 text-sm">
                          {contactInfo.location || 'ห้องพัสดุ อาคาร 1 ชั้น 2'}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdContactPhone className="text-blue-600 text-sm" />
                        <Typography variant="paragraph" className="text-blue-700 text-sm">
                          โทร: {contactInfo.phone || '02-123-4567'}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdAccessTime className="text-blue-600 text-sm" />
                        <Typography variant="paragraph" className="text-blue-700 text-sm">
                          เวลา: {contactInfo.hours || '8:30-16:30 น.'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button Preview */}
                <div className="border-t border-gray-200 pt-3">
                  <div className="bg-green-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium">
                    ดูรายละเอียด
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Typography variant="paragraph" className="text-yellow-700 text-xs">
                💡 หมายเหตุ: นี่คือตัวอย่างการแสดงผลในแอป LINE ข้อมูลจริงจะอัปเดตตามที่คุณบันทึกไว้
              </Typography>
            </div>
          </div>
        </div>

        {/* Main Controls - Clean & Modern */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MdSettings className="text-2xl text-gray-700" />
                </div>
                <div>
                  <Typography variant="h5" className="text-gray-800 font-bold">
                    การควบคุมการแจ้งเตือน
                  </Typography>
                  <Typography variant="paragraph" className="text-gray-600 text-sm">
                    จัดการการแจ้งเตือนแบบกลุ่ม
                  </Typography>
                </div>
              </div>
              <Button
                onClick={() => {
                  fetchUsers();
                  fetchNotificationStats();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <MdRefresh className="text-lg" />
                รีเฟรช
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Global Control - Enhanced */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-200">
                    <MdPeople className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-gray-800 font-bold mb-1">
                      ควบคุมทั้งหมด
                    </Typography>
                    <Typography variant="paragraph" className="text-gray-600 text-sm">
                      เปิด/ปิดการแจ้งเตือนสำหรับผู้ใช้งานทั้งหมดที่ผูก LINE
                    </Typography>
                  </div>
                </div>
                                                        <div className="flex flex-col items-end gap-3">
                     <div className="flex items-center gap-3">
                       <Typography variant="paragraph" className="text-sm font-medium text-gray-700">
                         เปิดใช้งานทั้งหมด
                       </Typography>
                       <button
                         type="button"
                         disabled={loading || notificationStats.overall.users_with_line === 0}
                         className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none border-2 transform hover:scale-105 ${
                           notificationStats.overall.users_enabled_line === notificationStats.overall.users_with_line && notificationStats.overall.users_with_line > 0
                             ? 'bg-green-400 border-green-500 shadow-lg shadow-green-200'
                             : 'bg-white border-gray-400 hover:border-gray-500'
                         } ${loading || notificationStats.overall.users_with_line === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                         onClick={() => {
                           if (loading || notificationStats.overall.users_with_line === 0) return;

                           const allEnabled = notificationStats.overall.users_enabled_line === notificationStats.overall.users_with_line;
                           console.log('Global switch clicked:', {
                             allEnabled,
                             users_enabled: notificationStats.overall.users_enabled_line,
                             users_with_line: notificationStats.overall.users_with_line,
                             will_toggle_to: !allEnabled
                           });

                           toggleAllNotifications(!allEnabled);
                         }}
                       >
                                                  <span
                           className={`absolute left-1 top-0.5 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out ${
                             notificationStats.overall.users_enabled_line === notificationStats.overall.users_with_line && notificationStats.overall.users_with_line > 0
                               ? 'shadow-green-200'
                               : ''
                           }`}
                           style={{
                             transform: `translateX(${
                               notificationStats.overall.users_enabled_line === notificationStats.overall.users_with_line && notificationStats.overall.users_with_line > 0
                                 ? '28px'
                                 : '0px'
                             })`,
                             transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                             maxWidth: '24px', // Ensure thumb doesn't exceed container
                             maxHeight: '24px'
                           }}
                         >
                           <ImMail4 className={`w-4 h-4 transition-colors duration-300 ${
                             notificationStats.overall.users_enabled_line === notificationStats.overall.users_with_line && notificationStats.overall.users_with_line > 0
                               ? 'text-green-600'
                               : 'text-gray-500'
                           }`} />
                         </span>
                       </button>
                     </div>
                     <div className="text-center">
                       <Typography variant="paragraph" className={`text-xs font-medium px-3 py-1 rounded-full transition-colors duration-300 ${
                         notificationStats.overall.users_enabled_line === notificationStats.overall.users_with_line && notificationStats.overall.users_with_line > 0
                           ? 'bg-green-100 text-green-700 border border-green-400'
                           : 'bg-gray-100 text-gray-700 border border-gray-300'
                       }`}>
                         {notificationStats.overall.users_enabled_line}/{notificationStats.overall.users_with_line} เปิดใช้งาน
                       </Typography>
                       {notificationStats.overall.users_with_line === 0 && (
                         <Typography variant="paragraph" className="text-xs text-red-500 mt-1">
                           ไม่มีผู้ใช้ที่ผูก LINE
                         </Typography>
                       )}


                     </div>
                   </div>
                </div>
              </div>

            {/* Role-based Control - Redesigned */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-purple-200">
                  <MdPeople className="text-2xl text-purple-600" />
                </div>
                <div>
                  <Typography variant="h6" className="text-gray-800 font-bold mb-1">
                    ควบคุมตามบทบาท
                  </Typography>
                  <Typography variant="paragraph" className="text-gray-600 text-sm">
                    จัดการการแจ้งเตือนแยกตามตำแหน่งงาน
                  </Typography>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueRoles.map(role => {
                    const roleUsers = users.filter(user => user.role_name === role && user.line_id !== 'ยังไม่ผูกบัญชี');
                    const enabledCount = roleUsers.filter(user => user.line_notify_enabled === 1).length;
                    const totalCount = roleUsers.length;

                    return (
                <div key={role} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                        {role.charAt(0)}
                      </div>
                      <div>
                        <Typography variant="paragraph" className="font-bold text-gray-800 text-lg">
                          {role}
                        </Typography>
                        <Typography variant="paragraph" className="text-sm text-gray-500">
                          {totalCount} คนที่ผูก LINE
                        </Typography>
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        disabled={loading || totalCount === 0}
                        className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none border-2 shadow-sm hover:scale-105 ${
                          enabledCount === totalCount && totalCount > 0
                            ? 'bg-green-400 border-green-500 shadow-green-200'
                            : 'bg-gray-200 border-gray-300 hover:border-gray-400'
                        } ${loading || totalCount === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => {
                          if (totalCount === 0) return;
                          const allEnabled = enabledCount === totalCount;
                          toggleRoleNotification(role, !allEnabled);
                        }}
                      >
                        <span
                          className="absolute left-1 top-0.5 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
                          style={{
                            transform: `translateX(${
                              enabledCount === totalCount && totalCount > 0
                                ? '28px'
                                : '0px'
                            })`,
                            transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
                          }}
                        >
                          <ImMail4 className={`w-4 h-4 ${
                            enabledCount === totalCount && totalCount > 0
                              ? 'text-green-600'
                              : 'text-gray-500'
                          } transition-colors duration-300`} />
                        </span>
                      </button>
                      <div className="mt-3">
                        <Typography variant="paragraph" className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-300 ${
                          enabledCount === totalCount && totalCount > 0
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}>
                          {enabledCount}/{totalCount} เปิดใช้งาน
                        </Typography>
                        {totalCount === 0 && (
                          <Typography variant="paragraph" className="text-xs text-red-500 mt-2">
                            ไม่มีผู้ใช้ที่ผูก LINE
                          </Typography>
                        )}
                      </div>
                    </div>
                         </div>
    </div>
  );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <MdSecurity className="text-2xl text-red-600" />
          </div>
          <div>
            <Typography variant="h5" className="text-gray-800 font-bold">
              การตั้งค่าความปลอดภัย
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              จัดการการเข้าถึงระบบและความปลอดภัย
            </Typography>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardBody className="p-6">
          <div className="text-center py-12">
            <MdSecurity className="text-6xl text-gray-300 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              ฟีเจอร์นี้จะเปิดให้ใช้งานเร็วๆ นี้
            </Typography>
            <Typography variant="paragraph" className="text-gray-400">
              การตั้งค่าความปลอดภัยจะพร้อมใช้งานในเวอร์ชันถัดไป
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderStorageSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MdStorage className="text-2xl text-green-600" />
          </div>
          <div>
            <Typography variant="h5" className="text-gray-800 font-bold">
              การตั้งค่าการจัดเก็บ Cloudinary
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              จัดการการตั้งค่า Cloudinary สำหรับการจัดเก็บรูปภาพและไฟล์
            </Typography>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <MdStorage className="text-2xl text-blue-600" />
            <Typography variant="h6" className="text-gray-800 font-semibold">
              การตั้งค่า Cloudinary
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-6">
            {/* Cloudinary Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cloudinaryConfig.is_configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <Typography variant="h6" className="text-gray-800 font-semibold">
                    สถานะการเชื่อมต่อ Cloudinary
                  </Typography>
                </div>
                <Typography variant="paragraph" className={`font-medium ${cloudinaryConfig.is_configured ? 'text-green-600' : 'text-red-600'}`}>
                  {cloudinaryConfig.is_configured ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
                </Typography>
              </div>
            </div>

            {/* Cloudinary Configuration */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-gray-800 font-semibold">
                ข้อมูลการตั้งค่า
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Cloud Name</label>
                  <Input
                    type="text"
                    value={cloudinaryConfig.cloud_name || ''}
                    placeholder="your-cloud-name"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                    labelProps={{ className: "hidden" }}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">API Key</label>
                  <Input
                    type="text"
                    value={cloudinaryConfig.api_key || ''}
                    placeholder="your-api-key"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                    labelProps={{ className: "hidden" }}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={testCloudinaryConnection}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังทดสอบ...
                  </>
                ) : (
                  <>
                    <MdCheckCircle className="text-lg" />
                    ทดสอบการเชื่อมต่อ
                  </>
                )}
              </Button>

              <Button
                onClick={getCloudinaryUsageStats}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <MdInfo className="text-lg" />
                ดูสถิติการใช้งาน
              </Button>

              <Button
                onClick={createCloudinaryFolderStructure}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังสร้าง...
                  </>
                ) : (
                  <>
                    <MdStorage className="text-lg" />
                    สร้าง Folder Structure
                  </>
                )}
              </Button>

              <Button
                onClick={listCloudinaryFolderStructure}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <MdInfo className="text-lg" />
                ดูรายการ Folder
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cloudinary Features */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
          <div className="flex items-center gap-3">
            <MdStorage className="text-2xl text-purple-600" />
            <Typography variant="h6" className="text-gray-800 font-semibold">
              ฟีเจอร์ Cloudinary
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <Typography variant="h6" className="text-blue-600 font-semibold">อัปโหลดไฟล์</Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-600 text-sm">
                รองรับการอัปโหลดรูปภาพและไฟล์ต่างๆ ไปยัง Cloudinary
              </Typography>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Typography variant="h6" className="text-green-600 font-semibold">แปลงรูปภาพ</Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-600 text-sm">
                ปรับขนาดและคุณภาพรูปภาพอัตโนมัติ
              </Typography>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <Typography variant="h6" className="text-purple-600 font-semibold">จัดเก็บปลอดภัย</Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-600 text-sm">
                ไฟล์ถูกจัดเก็บอย่างปลอดภัยในระบบ Cloud
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MdLanguage className="text-2xl text-purple-600" />
          </div>
          <div>
            <Typography variant="h5" className="text-gray-800 font-bold">
              การตั้งค่าภาษา
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              จัดการภาษาและภูมิภาคของระบบ
            </Typography>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardBody className="p-6">
          <div className="text-center py-12">
            <MdLanguage className="text-6xl text-gray-300 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              ฟีเจอร์นี้จะเปิดให้ใช้งานเร็วๆ นี้
            </Typography>
            <Typography variant="paragraph" className="text-gray-400">
              การตั้งค่าภาษาจะพร้อมใช้งานในเวอร์ชันถัดไป
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'storage':
        return renderStorageSettings();
      case 'language':
        return renderLanguageSettings();
      default:
        return renderNotificationSettings();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <MdSettings className="text-3xl text-white" />
            </div>
            <div>
              <Typography variant="h3" className="text-gray-800 font-bold">
                ตั้งค่าระบบ
              </Typography>
              <Typography variant="paragraph" className="text-gray-600">
                จัดการการตั้งค่าระบบและการกำหนดค่าต่างๆ
              </Typography>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card className="shadow-lg border-0 mb-6">
          <CardBody className="p-0">
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map(({ label, value, icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                      activeTab === value
                        ? 'text-blue-600 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Notification */}
      <Notification
        show={showNotification}
        title={notificationData.title}
        message={notificationData.message}
        type={notificationData.type}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default SystemSettings;