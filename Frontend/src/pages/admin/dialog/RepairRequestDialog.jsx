import { useEffect, useRef, useState } from 'react';
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClipboardList, FaImage, FaTimes, FaTools, FaUser } from 'react-icons/fa';
import { RiCoinsFill } from "react-icons/ri";
import axios from 'axios';
import { globalUserData } from '../../../components/Header';
import Notification from '../../../components/Notification';
import Swal from 'sweetalert2';

export default function RepairRequestDialog({
  open,
  onClose,
  equipment,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    description: '',
    estimatedCost: '',
    images: []
  });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'grid'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Function to generate random repair code
  const generateRepairCode = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Random 5 digits
    return `RP${randomNum}`;
  };

  // Get requester info from globalUserData
  const requesterInfo = {
    name: globalUserData?.Fullname || 'ไม่ระบุชื่อ',
    department: globalUserData?.branch_name || 'ไม่ระบุแผนก'
  };
  const requestDate = new Date().toISOString().split('T')[0];
  const equipmentCategory = 'อุปกรณ์ทั่วไป'; // Hardcoded category

  useEffect(() => {
    // Reset form and clean up images when dialog is closed or equipment changes
    if (!open) {
      formData.images.forEach(url => URL.revokeObjectURL(url));
      setFormData({
        description: '',
        estimatedCost: '',
        images: []
      });
    }
    // Cleanup object URLs on component unmount
    return () => {
      formData.images.forEach(url => URL.revokeObjectURL(url));
    };
  }, [open]);

  const processFilesAndUpdateState = (files) => {
    const newImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (newImageFiles.length === 0) return;

    const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(formData.images[indexToRemove]); // Clean up memory
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSubmit = async () => {
    if (!equipment) return;

    setIsSubmitting(true);
    try {
      // Generate repair code
      const repairCode = generateRepairCode();

      // Log all relevant data
      console.log('=== Debug Information ===');
      console.log('1. Equipment Object:', {
        id: equipment.id,
        item_id: equipment.item_id,
        name: equipment.name,
        item_code: equipment.item_code,
        category: equipment.category
      });
      console.log('2. Form Data:', {
        description: formData.description,
        estimatedCost: formData.estimatedCost,
        images: formData.images
      });
      console.log('3. Requester Info:', requesterInfo);
      console.log('4. Request Date:', requestDate);
      console.log('5. Global User Data:', globalUserData);
      console.log('6. Generated Repair Code:', repairCode);

      // Prepare the repair request data
      const repairData = {
        repair_code: repairCode,
        user_id: globalUserData?.user_id || "1",
        item_id: equipment.item_id || equipment.id,
        problem_description: formData.description,
        request_date: requestDate,
        estimated_cost: Number(formData.estimatedCost) || 0,
        status: "รอการอนุมัติซ่อม",
        pic_filename: formData.images.length > 0 ? formData.images[0] : null
      };

      console.log('7. Final Data Being Sent to Server:', repairData);

      // Submit repair request to API
      const response = await axios.post('http://localhost:5000/api/repair-requests', repairData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('8. Server Response:', response.data);

      // Update equipment status to "รอการอนุมัติซ่อม"
      try {
        const equipmentId = equipment.item_id;
        console.log('Updating equipment status for ID:', equipmentId);

        const response = await axios.put(`http://localhost:5000/api/equipment/${equipmentId}/status`, {
          status: "รอการอนุมัติซ่อม"
        });

        console.log('Equipment status update response:', response.data);
      } catch (error) {
        console.error('Error updating equipment status:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        // Continue with the process even if status update fails
      }

      // If successful, call the onSubmit callback with the response data
      onSubmit({
        description: formData.description,
        estimatedCost: formData.estimatedCost,
        images: formData.images,
        equipment: {
          name: equipment.name,
          item_id: equipment.item_id,
          code: equipment.item_code,
          category: equipmentCategory
        },
        requester: {
          name: requesterInfo.name,
          department: requesterInfo.department
        },
        requestDate: requestDate,
        status: 'รอการอนุมัติซ่อม'
      });

      // Show success notification
      showNotification('ส่งคำขอแจ้งซ่อมสำเร็จ', 'success');

      // Show success alert using SweetAlert2
      await Swal.fire({
        title: 'ส่งคำขอแจ้งซ่อมสำเร็จ',
        text: 'ระบบได้บันทึกคำขอแจ้งซ่อมของคุณแล้ว และอัพเดทสถานะครุภัณฑ์เป็น "รอการอนุมัติซ่อม"',
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      // Close dialog after alert
      onClose();
    } catch (error) {
      console.error('=== Error Details ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);

      // Show error notification
      showNotification(
        error.response?.data?.error || error.message || 'เกิดข้อผิดพลาดในการส่งคำขอแจ้งซ่อม',
        'error'
      );

      // Show error alert using SweetAlert2
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.error || error.message || 'เกิดข้อผิดพลาดในการส่งคำขอแจ้งซ่อม',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % formData.images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + formData.images.length) % formData.images.length);
    setIsZoomed(false);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'single' ? 'grid' : 'single');
    setIsZoomed(false);
  };

  if (!open || !equipment) return null;

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFilesAndUpdateState(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
      {/* Success Alert Dialog */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl transform transition-all">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ส่งคำขอแจ้งซ่อมสำเร็จ</h3>
            <p className="text-gray-600">ระบบได้บันทึกคำขอแจ้งซ่อมของคุณแล้ว</p>
          </div>
        </div>
      )}

      <div className="modal modal-open">
        <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
          {/* Notification Component */}
          <Notification
            show={notification.show}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          />

          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FaTools className="text-primary" />
              <span className="text-primary">แจ้งซ่อมครุภัณฑ์</span>
            </h3>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost hover:opacity-70">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* ข้อมูลผู้แจ้งและครุภัณฑ์ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-blue-300/50 p-4 rounded-full">
              {/* ข้อมูลผู้แจ้ง */}
              <div className="flex items-start gap-3 bg-white py-5 px-8 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">ผู้แจ้งซ่อม</h4>
                  <p className="text-sm font-semibold mt-1">
                    {requesterInfo.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {requesterInfo.department}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <BsFillCalendarDateFill className="mr-1 mt-1" /> วันที่แจ้ง: {requestDate}
                  </p>
                </div>
              </div>

              {/* ข้อมูลครุภัณฑ์ */}
              <div className="bg-white px-10 py-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-primary flex items-center gap-2 mb-2">
                  <FaTools className="text-primary" />
                  ข้อมูลครุภัณฑ์
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="grid grid-cols-4">
                    <span className="font-medium">ชื่อ:</span>
                    <span className="col-span-3">{equipment.name}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-medium">รหัส:</span>
                    <span className="col-span-3">{equipment.item_code}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-medium">ประเภท:</span>
                    <span className="col-span-3">{equipmentCategory}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* รายละเอียดปัญหา */}
            <div className="bg-white p-3 transition-colors">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-primary">
                <FaClipboardList />
                รายละเอียดปัญหา
              </h4>
              <textarea
                rows={3}
                className="textarea w-full bg-gray-50 focus:ring-1 focus:ring-primary/30 focus:outline-none border-gray-300 rounded-xl"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ระบุรายละเอียดของปัญหาที่พบ เช่น อาการ, สาเหตุเบื้องต้น..."
              />

              {/* ข้อมูลเพิ่มเติม */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-blue-50 p-3 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="mb-1 flex items-center text-blue-800">
                    <BsFillCalendarDateFill size={16} className="text-blue-600" />
                    <span className="px-2 text-sm"> วันที่แจ้ง </span>
                  </div>
                  <span className="text-sm font-bold">
                    {requestDate}
                  </span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl hover:bg-amber-100 transition-colors">
                  <div className="mb-1 flex items-center text-amber-800">
                    <RiCoinsFill size={16} className="text-amber-600" />
                    <span className="px-2 text-sm"> ค่าใช้จ่ายประมาณ </span>
                  </div>
                  <input
                    type="number"
                    className="input input-sm w-full bg-transparent border-none focus:outline-none text-sm font-bold p-0"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    placeholder="ระบุค่าใช้จ่าย"
                  />
                </div>
              </div>
            </div>

            {/* อัพโหลดรูปภาพ & Preview */}
            <div className="bg-white p-3 ">
              <label className="label">
                <span className="label-text font-medium mb-2">รูปภาพประกอบ (ถ้ามี)</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 cursor-pointer transition-colors
                  ${isDraggingOver ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}
                `}
                onClick={handleDropZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {formData.images.length === 0 ? (
                  <>
                    <FaImage className={`mx-auto text-4xl mb-2 ${isDraggingOver ? 'text-primary' : 'text-gray-400'}`} />
                    <p className={`mt-1 text-sm ${isDraggingOver ? 'text-primary' : 'text-gray-600'}`}>
                      ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์
                    </p>
                  </>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={imageUrl}
                          alt={`preview ${index + 1}`}
                          className="object-cover w-full h-full rounded-md border border-gray-200"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="ลบรูปภาพ"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => processFilesAndUpdateState(e.target.files)}
                  onClick={(event) => { event.target.value = null }} // Allow re-selecting the same file
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="modal-action">
            <button onClick={onClose} className="btn btn-ghost rounded-full">
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary rounded-full hover:opacity-90"
              disabled={!formData.description || !formData.estimatedCost || isSubmitting}
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอแจ้งซ่อม'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </>
  );
}