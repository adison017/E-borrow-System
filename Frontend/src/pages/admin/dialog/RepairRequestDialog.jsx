import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClipboardList, FaImage, FaTimes, FaTools, FaUser } from 'react-icons/fa';
import { RiCoinsFill } from "react-icons/ri";
import { globalUserData } from '../../../components/Header';
import Notification from '../../../components/Notification';

export default function RepairRequestDialog({
  open,
  onClose,
  equipment,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    description: '',
    estimatedCost: '',
    images: [],
    imageFiles: [] // Store actual File objects
  });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'single' or 'grid'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
        images: [],
        imageFiles: []
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
      images: [...prev.images, ...newImageUrls],
      imageFiles: [...prev.imageFiles, ...newImageFiles]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    const imageToRemove = formData.images[indexToRemove];
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
      imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove)
    }));

    // Adjust active image index if needed
    if (activeImageIndex >= indexToRemove && activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
    }
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

  // Function to upload images to server
  const uploadImagesToServer = async (files, repairCode) => {
    if (!files || files.length === 0) return [];

    setIsUploading(true);
    try {
      const formData = new FormData();

      // Add repair code first
      formData.append('repair_code', repairCode);

      // Add images
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      console.log('Uploading images with repair code:', repairCode);
      console.log('Files to upload:', files.length);

      const response = await axios.post(
        'http://localhost:5000/api/repair-requests/upload-images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Upload response:', response.data);
      return response.data.images;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!equipment) return;

    // Validate form
    if (!formData.description.trim()) {
      showNotification('โปรดกรอกรายละเอียดความเสียหาย', 'error');
      return;
    }

    if (!formData.estimatedCost || formData.estimatedCost <= 0) {
      showNotification('โปรดกรอกค่าใช้จ่ายประมาณการ', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate repair code first
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
        images: formData.images,
        imageFiles: formData.imageFiles
      });
      console.log('3. Requester Info:', requesterInfo);
      console.log('4. Request Date:', requestDate);
      console.log('5. Global User Data:', globalUserData);
      console.log('6. Generated Repair Code:', repairCode);

      // Upload images to server if there are any (with repair code)
      let uploadedImages = [];
      if (formData.imageFiles.length > 0) {
        uploadedImages = await uploadImagesToServer(formData.imageFiles, repairCode);
      }

      // Prepare the repair request data
      const repairData = {
        repair_code: repairCode,
        user_id: globalUserData?.user_id || "1",
        item_id: equipment.item_id || equipment.id,
        problem_description: formData.description,
        request_date: requestDate,
        estimated_cost: Number(formData.estimatedCost) || 0,
        status: "รออนุมัติซ่อม",
        pic_filename: uploadedImages.length > 0 ? uploadedImages[0].filename : null,
        images: uploadedImages
      };

      console.log('7. Final Data Being Sent to Server:', repairData);

      // Submit repair request to API
      const response = await axios.post('http://localhost:5000/api/repair-requests', repairData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('8. Server Response:', response.data);

      // Update equipment status to "รออนุมัติซ่อม"
      try {
        // Use item_code as canonical identifier
        const equipmentCode = equipment.item_code || equipment.id || equipment.item_id;
        console.log('Updating equipment status for item_code:', equipmentCode);

        if (equipmentCode) {
          const response = await axios.put(`http://localhost:5000/api/equipment/${equipmentCode}/status`, {
            status: "รออนุมัติซ่อม"
          });

          console.log('Equipment status update response:', response.data);
        } else {
          console.warn('No equipment item_code available for status update');
        }
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
        status: 'รออนุมัติซ่อม'
      });

      // Show success notification
      showNotification('ส่งคำขอแจ้งซ่อมสำเร็จ', 'success');

      // Close dialog
      onClose();
    } catch (error) {
      console.error('Error submitting repair request:', error);
      showNotification('เกิดข้อผิดพลาดในการส่งคำขอแจ้งซ่อม', 'error');
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

            {/* อัพโหลดรูปภาพ */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-primary">
                <FaImage />
                รูปภาพความเสียหาย (อัพโหลดได้หลายรูป)
              </h4>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDraggingOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleDropZoneClick}
              >
                <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  ลากและวางรูปภาพที่นี่ หรือ <span className="text-blue-600 font-medium">คลิกเพื่อเลือกไฟล์</span>
                </p>
                <p className="text-xs text-gray-500">
                  รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB ต่อไฟล์ (สูงสุด 10 ไฟล์)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => processFilesAndUpdateState(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">
                      รูปภาพที่เลือก ({formData.images.length} รูป)
                    </h5>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleViewMode}
                        className="btn btn-sm btn-ghost"
                        title={viewMode === 'grid' ? 'ดูแบบรายการ' : 'ดูแบบตาราง'}
                      >
                        {viewMode === 'grid' ? '📋' : '🖼️'}
                      </button>
                    </div>
                  </div>

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`รูปภาพ ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            รูปที่ {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <img
                            src={image}
                            alt={`รูปภาพ ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">รูปภาพ {index + 1}</p>
                            <p className="text-xs text-gray-500">คลิกเพื่อดูขนาดใหญ่</p>
                          </div>
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="btn btn-sm btn-error"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="modal-action">
            <button onClick={onClose} className="btn btn-ghost rounded-full">
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  กำลังส่ง...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaImage />
                  ส่งคำขอแจ้งซ่อม
                </div>
              )}
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