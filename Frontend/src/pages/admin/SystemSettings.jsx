import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Typography, Button, Input, Textarea, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
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
  MdInfo
} from 'react-icons/md';
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
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [activeTab, setActiveTab] = useState('contact');

  useEffect(() => {
    fetchContactInfo();
    fetchCloudinaryConfig();
  }, []);

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
      label: "ข้อมูลติดต่อ",
      value: "contact",
      icon: <MdContactPhone className="w-5 h-5" />,
    },
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

  const renderContactSettings = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MdContactPhone className="text-2xl text-blue-600" />
          </div>
          <div>
            <Typography variant="h5" className="text-gray-800 font-bold">
              ข้อมูลติดต่อเจ้าหน้าที่
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              ข้อมูลนี้จะแสดงในข้อความแจ้งเตือน LINE เมื่อมีการอนุมัติการขอยืมครุภัณฑ์
            </Typography>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Card className="shadow-lg border-0">
        <CardBody className="p-6">
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
                    บันทึกการตั้งค่า
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Preview Section */}
      <Card className="shadow-lg border-0">
        <CardHeader
          className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <MdInfo className="text-2xl text-gray-600" />
            <Typography variant="h6" className="text-gray-800 font-semibold">
              ตัวอย่างการแสดงผลใน LINE Notify
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Typography variant="h6" className="text-blue-600 font-semibold">
                📞 ติดต่อเจ้าหน้าที่:
              </Typography>
            </div>
            <div className="space-y-2 text-gray-700 bg-white p-4 rounded-lg border border-blue-100">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {contactInfo.location || 'ห้องพัสดุ อาคาร 1 ชั้น 2'}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                โทร: {contactInfo.phone || '02-123-4567'}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                เวลา: {contactInfo.hours || '8:30-16:30 น.'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MdNotifications className="text-2xl text-orange-600" />
          </div>
          <div>
            <Typography variant="h5" className="text-gray-800 font-bold">
              การตั้งค่าการแจ้งเตือน
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              จัดการการแจ้งเตือนผ่าน LINE และอีเมล
            </Typography>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardBody className="p-6">
          <div className="text-center py-12">
            <MdNotifications className="text-6xl text-gray-300 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              ฟีเจอร์นี้จะเปิดให้ใช้งานเร็วๆ นี้
            </Typography>
            <Typography variant="paragraph" className="text-gray-400">
              การตั้งค่าการแจ้งเตือนจะพร้อมใช้งานในเวอร์ชันถัดไป
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );

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
      case 'contact':
        return renderContactSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'storage':
        return renderStorageSettings();
      case 'language':
        return renderLanguageSettings();
      default:
        return renderContactSettings();
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
            <Tabs value={activeTab} onChange={setActiveTab}>
              <TabsHeader className="rounded-none bg-transparent p-0 border-b border-gray-200">
                {tabs.map(({ label, value, icon }) => (
                  <Tab
                    key={value}
                    value={value}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === value
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {icon}
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
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