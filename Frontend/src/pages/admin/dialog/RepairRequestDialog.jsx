import { useEffect, useRef, useState } from 'react';
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClipboardList, FaImage, FaTimes, FaTools, FaUser } from 'react-icons/fa';
import { RiCoinsFill } from "react-icons/ri";

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

  // Static data for this dialog
  const requesterInfo = {
    name: 'ผู้ดูแลระบบ',
    department: 'ฝ่ายครุภัณฑ์'
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
  }, [open]); //formData.images dependency removed to avoid loop with setFormData

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

  const handleSubmit = () => {
    if (!equipment) return;

    onSubmit({
      description: formData.description,
      estimatedCost: formData.estimatedCost,
      images: formData.images,
      equipment: {
        name: equipment.name,
        code: equipment.id,
        category: equipmentCategory
      },
      requester: {
        name: requesterInfo.name,
        department: requesterInfo.department
      },
      requestDate: requestDate,
      status: 'รออนุมัติซ่อม'
    });
    onClose();
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
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
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
                  <span className="col-span-3">{equipment.id}</span>
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
        <div className="modal-action ">
          <button onClick={onClose} className="btn btn-ghost rounded-full">
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary rounded-full hover:opacity-90"
            disabled={!formData.description || !formData.estimatedCost}
          >
            ส่งคำขอแจ้งซ่อม
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}