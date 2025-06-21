import { XCircleIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsFillCalendarDateFill } from "react-icons/bs";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaImage,
  FaTimesCircle,
  FaTools,
  FaUser
} from 'react-icons/fa';
import { MdAssignment, MdClose } from "react-icons/md";
import { RiCoinsFill } from "react-icons/ri";

export default function RepairApprovalDialog({
  open,
  onClose,
  repairRequest,
  onApprove,
  onReject
}) {
  console.log('Repair Request Data:', repairRequest);
  console.log('Equipment Name:', repairRequest?.equipment_name);
  console.log('Equipment Code:', repairRequest?.equipment_code);
  console.log('Equipment Category:', repairRequest?.equipment_category);
  console.log('Requester Name:', repairRequest?.requester_name);
  console.log('Branch Name:', repairRequest?.branch_name);
  console.log('Status:', repairRequest?.status);
  console.log('Request Date:', repairRequest?.request_date);
  console.log('Problem Description:', repairRequest?.problem_description);
  console.log('Estimated Cost:', repairRequest?.estimated_cost);
  console.log('Equipment Pic:', repairRequest?.equipment_pic);

  // Normalize repairRequest fields in case they are objects
  const normalizedRepairRequest = {
    ...repairRequest,
    requester_name: typeof repairRequest?.requester_name === 'string'
      ? repairRequest.requester_name
      : repairRequest?.requester?.name || '',
    equipment_name: typeof repairRequest?.equipment_name === 'string'
      ? repairRequest.equipment_name
      : repairRequest?.equipment?.name || '',
    equipment_code: typeof repairRequest?.equipment_code === 'string'
      ? repairRequest.equipment_code
      : repairRequest?.equipment?.code || '',
    equipment_category: typeof repairRequest?.equipment_category === 'string'
      ? repairRequest.equipment_category
      : repairRequest?.equipment?.category || '',
  };

  const [notes, setNotes] = useState('')
  const [budgetApproved, setBudgetApproved] = useState(repairRequest?.estimated_cost || 0)
  const [assignedTo, setAssignedTo] = useState('')
  const [assignedToName, setAssignedToName] = useState('')
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState('grid') // 'single' or 'grid'
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [formError, setFormError] = useState("");
  const [repairImages, setRepairImages] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse repair images from pic_filename field
  useEffect(() => {
    console.log('=== Repair Images Debug ===');
    console.log('repairRequest:', repairRequest);
    console.log('pic_filename:', repairRequest?.pic_filename);
    console.log('pic_filename type:', typeof repairRequest?.pic_filename);
    console.log('pic_filename_raw:', repairRequest?.pic_filename_raw);
    console.log('repair_code:', repairRequest?.repair_code);

    if (repairRequest?.pic_filename) {
      // Check if it's already an array (parsed by backend)
      if (Array.isArray(repairRequest.pic_filename)) {
        console.log('✅ Already parsed array:', repairRequest.pic_filename);
        setRepairImages(repairRequest.pic_filename);
      } else if (typeof repairRequest.pic_filename === 'string') {
        try {
          console.log('pic_filename type:', typeof repairRequest.pic_filename);
          console.log('pic_filename starts with [:', repairRequest.pic_filename.startsWith('['));
          console.log('pic_filename starts with {:', repairRequest.pic_filename.startsWith('{'));

          // Check if it's a JSON string (multiple images)
          if (repairRequest.pic_filename.startsWith('[') || repairRequest.pic_filename.startsWith('{')) {
            const images = JSON.parse(repairRequest.pic_filename);
            console.log('Parsed JSON images:', images);
            setRepairImages(images);
          } else {
            // Single image - convert to array format
            console.log('Single image filename:', repairRequest.pic_filename);
            const singleImage = {
              filename: repairRequest.pic_filename,
              original_name: repairRequest.pic_filename,
              file_path: `uploads/repair/${repairRequest.pic_filename}`,
              url: `http://localhost:5000/uploads/repair/${repairRequest.pic_filename}`,
              repair_code: repairRequest.repair_code,
              index: 0
            };
            console.log('Created single image object:', singleImage);
            setRepairImages([singleImage]);
          }
        } catch (error) {
          console.error('Error parsing repair images:', error);
          setRepairImages([]);
        }
      } else {
        console.log('Unexpected pic_filename type:', typeof repairRequest.pic_filename);
        setRepairImages([]);
      }
    } else {
      console.log('No pic_filename found');
      setRepairImages([]);
    }

    console.log('Final repairImages state:', repairImages);
  }, [repairRequest?.pic_filename, repairRequest?.repair_code]);

  // Reset active image index when images change
  useEffect(() => {
    setActiveImageIndex(0);
  }, [repairImages]);

  // Fetch admin users when dialog opens
  useEffect(() => {
    if (open) {
      fetchAdminUsers();
    }
  }, [open]);

  const fetchAdminUsers = async () => {
    try {
      setLoadingAdmins(true);
      const response = await axios.get('http://localhost:5000/users/role/admin');
      console.log('Admin users response:', response.data);
      setAdminUsers(response.data);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setAdminUsers([]);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Helper function to get admin name by ID
  const getAdminNameById = (userId) => {
    const admin = adminUsers.find(user => user.user_id == userId);
    return admin ? admin.Fullname : 'ไม่ระบุ';
  };

  // Handle dropdown change to store both ID and name
  const handleAssignedToChange = (userId) => {
    setAssignedTo(userId);
    const selectedAdmin = adminUsers.find(user => user.user_id == userId);
    setAssignedToName(selectedAdmin ? selectedAdmin.Fullname : '');
  };

  const rejectReasonOptions = [
    "งบประมาณไม่ผ่านการอนุมัติ",
    "ไม่สามารถซ่อมแซมได้",
    "รายการนี้ไม่อยู่ในขอบเขตงานซ่อม",
    "อื่นๆ (โปรดระบุในหมายเหตุ)"
  ];

  const handleApprove = async () => {
    if (!normalizedRepairRequest) {
      setFormError("ไม่พบข้อมูลคำขอซ่อม");
      return;
    }

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    // Validate required fields
    const requiredFields = {
      requestId: normalizedRepairRequest.requestId,
      problem_description: normalizedRepairRequest.problem_description,
      request_date: normalizedRepairRequest.request_date,
      estimated_cost: normalizedRepairRequest.estimated_cost,
      equipment_code: normalizedRepairRequest.equipment_code
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      setFormError(`ข้อมูลไม่ครบถ้วน: ${missingFields.join(', ')}`);
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      console.log('Preparing approval payload for request ID:', normalizedRepairRequest.requestId);

      // Prepare payload for approval
      const payload = {
        requester_name: normalizedRepairRequest.requester_name,
        equipment_name: normalizedRepairRequest.equipment_name,
        equipment_code: normalizedRepairRequest.equipment_code,
        equipment_category: normalizedRepairRequest.equipment_category,
        problem_description: normalizedRepairRequest.problem_description,
        request_date: normalizedRepairRequest.request_date,
        estimated_cost: budgetApproved,
        status: "approved",
        pic_filename: normalizedRepairRequest.pic_filename || normalizedRepairRequest.repair_pic_raw || '',
        note: notes,
        budget: budgetApproved,
        responsible_person: assignedToName,
        approval_date: new Date().toISOString(),
        images: normalizedRepairRequest.repair_pic || []
      };

      console.log('Approval payload:', payload);

      // Update repair request status to approved
      await axios.put(`http://localhost:5000/api/repair-requests/${normalizedRepairRequest.requestId}`, payload);

      // Update equipment status to 'กำลังซ่อม'
      if (normalizedRepairRequest.equipment_code) {
        await axios.put(`http://localhost:5000/api/equipment/${normalizedRepairRequest.equipment_code}/status`, { status: "กำลังซ่อม" });
      }

      onApprove(payload);
      onClose();
    } catch (error) {
      console.error('Error approving repair request:', error);
      console.error('Error response:', error.response?.data);
      setFormError(`เกิดข้อผิดพลาดในการอนุมัติคำขอซ่อม: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectDialog(true);
    setRejectReason("");
    setFormError("");
  };

  const handleCancelReject = () => {
    setShowRejectDialog(false);
    setRejectReason("");
    setFormError("");
  };

  const handleConfirmReject = async () => {
    if (!normalizedRepairRequest) {
      setFormError("ไม่พบข้อมูลคำขอซ่อม");
      return;
    }

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    // Validate required fields
    const requiredFields = {
      requestId: normalizedRepairRequest.requestId,
      problem_description: normalizedRepairRequest.problem_description,
      request_date: normalizedRepairRequest.request_date,
      estimated_cost: normalizedRepairRequest.estimated_cost,
      equipment_code: normalizedRepairRequest.equipment_code
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      setFormError(`ข้อมูลไม่ครบถ้วน: ${missingFields.join(', ')}`);
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      console.log('Preparing rejection payload for request ID:', normalizedRepairRequest.requestId);

      // Prepare payload for rejection
      const payload = {
        requester_name: normalizedRepairRequest.requester_name,
        equipment_name: normalizedRepairRequest.equipment_name,
        equipment_code: normalizedRepairRequest.equipment_code,
        equipment_category: normalizedRepairRequest.equipment_category,
        problem_description: normalizedRepairRequest.problem_description,
        request_date: normalizedRepairRequest.request_date,
        estimated_cost: normalizedRepairRequest.estimated_cost,
        status: "rejected",
        pic_filename: normalizedRepairRequest.pic_filename || normalizedRepairRequest.repair_pic_raw || '',
        note: rejectReason ? `${rejectReason} ${notes}` : notes,
        budget: normalizedRepairRequest.estimated_cost,
        responsible_person: assignedToName,
        approval_date: new Date().toISOString(),
        images: normalizedRepairRequest.repair_pic || []
      };

      console.log('Rejection payload:', payload);

      // Update repair request status to rejected
      await axios.put(`http://localhost:5000/api/repair-requests/${normalizedRepairRequest.requestId}`, payload);

      // Update equipment status to 'ชำรุด'
      if (normalizedRepairRequest.equipment_code) {
        await axios.put(`http://localhost:5000/api/equipment/${normalizedRepairRequest.equipment_code}/status`, { status: "ชำรุด" });
      }

      onReject(payload);
      setShowRejectDialog(false);
      onClose();
    } catch (error) {
      console.error('Error rejecting repair request:', error);
      console.error('Error response:', error.response?.data);
      setFormError(`เกิดข้อผิดพลาดในการปฏิเสธคำขอซ่อม: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % repairImages.length);
  }

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + repairImages.length) % repairImages.length);
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'single' ? 'grid' : 'single');
    setIsZoomed(false);
  }

  if (!repairRequest) return null

  return (
    <div data-theme="light" className={`modal ${open ? 'modal-open ' : ''}`}>
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto bg-white ">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {repairRequest.status === 'รอการอนุมัติซ่อม' ? (
              <>
                <span className="text-primary">พิจารณาคำขอแจ้งซ่อมครุภัณฑ์</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                  รหัสคำขอซ่อม: {repairRequest.repair_code || '-'}
                </span>
              </>
            ) : (
              <>
                <span className="text-primary">รายละเอียดการแจ้งซ่อม</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                รหัสคำขอซ่อม: {repairRequest.repair_code || '-'}
                </span>
              </>
            )}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost hover:opacity-70">
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* ข้อมูลผู้แจ้งและครุภัณฑ์ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-blue-200/50 p-4 rounded-full">
            {/* ข้อมูลผู้แจ้ง */}
            <div className="flex items-start gap-3 bg-white py-4 px-10 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <FaUser className="text-xl" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">ผู้แจ้งซ่อม</h4>
                <p className="text-sm font-semibold mt-1">
                  {repairRequest.requester_name || '-'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {repairRequest.branch_name || '-'}
                </p>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <BsFillCalendarDateFill className="mr-1" /> วันที่แจ้ง: {new Date(repairRequest.request_date).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>

            {/* ข้อมูลครุภัณฑ์ */}
            <div className="bg-white py-3 px-12 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-primary flex items-center gap-2 mb-2">
                <FaTools className="text-primary" />
                ข้อมูลครุภัณฑ์
              </h4>
              <div className="space-y-1 text-sm">

                <div className="grid grid-cols-4">
                  <span className="font-medium">ชื่อ:</span>
                  <span className="col-span-3">{repairRequest.equipment_name || '-'}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-medium">รหัส:</span>
                  <span className="col-span-3">{repairRequest.equipment_code || '-'}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-medium">ประเภท:</span>
                  <span className="col-span-3">{repairRequest.equipment_category || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* รูปภาพความเสียหาย */}
          {repairImages.length > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FaImage className="text-gray-600" />
                  รูปภาพความเสียหาย ({repairImages.length} รูป)
                  {repairRequest.repair_code && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      รหัส: {repairRequest.repair_code}
                    </span>
                  )}
                </h4>
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
                  {repairImages.map((image, index) => (
                    <div key={image.filename || index} className="relative group cursor-pointer">
                      <img
                        src={image.url || `http://localhost:5000/${image.file_path}`}
                        alt={`รูปภาพความเสียหาย ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                        onClick={e => {
                          e.stopPropagation();
                          setActiveImageIndex(index);
                          setIsZoomed(true);
                        }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        รูปที่ {index + 1}
                      </div>
                      {image.repair_code && (
                        <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {image.repair_code}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {repairImages.map((image, index) => (
                    <div key={image.filename || index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <img
                        src={image.url || `http://localhost:5000/${image.file_path}`}
                        alt={`รูปภาพความเสียหาย ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                        onClick={e => {
                          e.stopPropagation();
                          setActiveImageIndex(index);
                          setIsZoomed(true);
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">รูปภาพความเสียหาย {index + 1}</p>
                        <p className="text-xs text-gray-500">คลิกเพื่อดูขนาดใหญ่</p>
                        {image.repair_code && (
                          <p className="text-xs text-blue-600 font-medium">รหัส: {image.repair_code}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FaImage className="text-gray-600" />
                รูปภาพความเสียหาย
              </h4>
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center">
                <FaImage className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">ไม่มีรูปภาพความเสียหาย</p>
              </div>
            </div>
          )}

          {/* รูปภาพอุปกรณ์ */}
          {repairRequest.equipment_pic || repairRequest.equipment_pic_filename ? (
            <div className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FaImage className="text-gray-600" />
                  รูปภาพอุปกรณ์
                </h4>
              </div>
              <div className="relative rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden" style={{height: '200px'}}>
                <img
                  src={repairRequest.equipment_pic || `http://localhost:5000/uploads/${repairRequest.equipment_pic_filename}`}
                  alt="รูปภาพอุปกรณ์"
                  className="object-contain max-h-full max-w-full"
                  onError={(e) => {
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3474/3474360.png";
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FaImage className="text-gray-600" />
                รูปภาพอุปกรณ์
              </h4>
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center">
                <FaImage className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">ไม่มีรูปภาพอุปกรณ์</p>
              </div>
            </div>
          )}

          {/* รายละเอียดปัญหา */}
          <div className="bg-white p-3 hover:bg-gray-50 transition-colors">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-primary">
              <FaClipboardList />
              รายละเอียดปัญหา
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg whitespace-pre-line text-sm">
              <div className="pl-2 border-l-4 border-amber-500">
                {repairRequest.problem_description || '-'}
              </div>
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="mb-1 flex items-center text-blue-800">
                  <BsFillCalendarDateFill size={16} className="text-blue-600" />
                  <span className="px-2 text-sm"> วันที่แจ้ง </span>
                </div>
                <span className="text-sm font-bold">
                  {new Date(repairRequest.request_date).toLocaleDateString('th-TH')}
                </span>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg hover:bg-amber-100 transition-colors">
                <div className="mb-1 flex items-center text-amber-800">
                  <RiCoinsFill size={16} className="text-amber-600" />
                  <span className="px-2 text-sm"> ค่าใช้จ่ายประมาณ </span>
                </div>
                <span className="text-sm font-bold">
                  {Number(repairRequest.estimated_cost).toLocaleString()} บาท
                </span>
              </div>
            </div>
          </div>

          {/* การดำเนินการ */}
          {(repairRequest.status === 'รออนุมัติซ่อม' || !repairRequest.status || repairRequest.status === 'pending') && (
            <div className="bg-white p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-primary">
                <MdAssignment />
                การดำเนินการ
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">หมายเหตุ (ถ้ามี)</span>
                  </label>
                  <textarea
                    rows={2}
                    className="textarea w-full focus:ring-2 focus:ring-primary/20 focus:outline-none rounded-2xl"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ระบุหมายเหตุเพิ่มเติม"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">งบประมาณที่อนุมัติ (บาท)</span>
                    </label>
                    <input
                      type="number"
                      className="input w-full focus:ring-2 focus:ring-primary/20 focus:outline-none rounded-2xl"
                      value={budgetApproved}
                      onChange={(e) => setBudgetApproved(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">มอบหมายให้</span>
                    </label>
                    <select
                      className="select w-full focus:ring-2 focus:ring-primary/20 focus:outline-none rounded-2xl"
                      value={assignedTo}
                      onChange={(e) => handleAssignedToChange(e.target.value)}
                      disabled={loadingAdmins}
                    >
                      <option value="" disabled>
                        {loadingAdmins ? 'กำลังโหลด...' : '-- เลือกผู้รับผิดชอบ --'}
                      </option>
                      {adminUsers.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.Fullname} ({user.role_name || 'Admin'})
                        </option>
                      ))}
                    </select>
                    {adminUsers.length === 0 && !loadingAdmins && (
                      <p className="text-xs text-gray-500 mt-1">ไม่พบผู้ดูแลระบบ</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* สำหรับคำขอที่อนุมัติแล้ว */}
          {repairRequest.status === 'approved' && (
            <div className="alert alert-success">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-xl mt-0.5" />
                <div>
                  <h4 className="font-bold">อนุมัติแล้ว</h4>
                  <p className="text-sm">
                    โดย {repairRequest.responsible_person || 'ไม่ระบุผู้รับผิดชอบ'}
                  </p>
                  <p className="text-xs mt-1">
                    วันที่อนุมัติ: {repairRequest.approvalDate}
                  </p>
                  {repairRequest.approvalNotes && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">หมายเหตุ:</span>{' '}
                      {repairRequest.approvalNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* สำหรับคำขอที่ปฏิเสธ */}
          {repairRequest.status === 'rejected' && (
            <div className="alert alert-error">
              <div className="flex items-start gap-3">
                <FaTimesCircle className="text-xl mt-0.5" />
                <div>
                  <h4 className="font-bold">ปฏิเสธคำขอ</h4>
                  <p className="text-xs mt-1">
                    วันที่ปฏิเสด: {repairRequest.rejectionDate}
                  </p>
                  {repairRequest.approvalNotes && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">เหตุผล:</span>{' '}
                      {repairRequest.approvalNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {(repairRequest.status === 'รออนุมัติซ่อม' || !repairRequest.status || repairRequest.status === 'pending') && (
          <div className="modal-action mt-6 pt-3">
            <button
              onClick={handleRejectClick}
              className="btn btn-error hover:opacity-90 text-white rounded-2xl"
              disabled={isSubmitting}
            >
              <FaTimesCircle className="mr-1" />
              {isSubmitting ? 'กำลังประมวลผล...' : 'ปฏิเสธ'}
            </button>
            <button
              onClick={handleApprove}
              className="btn btn-success hover:opacity-90 text-white rounded-2xl"
              disabled={isSubmitting}
            >
              <FaCheckCircle className="mr-1" />
              {isSubmitting ? 'กำลังประมวลผล...' : 'อนุมัติ'}
            </button>
          </div>
        )}
      </div>
      {/* Reject Reason Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl h-max-h-[90vh] transform transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                  <span>ปฏิเสธคำขอซ่อม</span>
                </h3>
                <button
                  onClick={handleCancelReject}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-150"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    โปรดเลือกเหตุผลในการปฏิเสธ
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="space-y-2 h-full overflow-y-auto pr-1 p-2">
                    {rejectReasonOptions.map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-start gap-3 p-3 cursor-pointer transition-colors duration-150 rounded-md
                          ${
                            rejectReason === reason
                              ? 'bg-red-50 border border-red-300 shadow-sm'
                              : 'border border-transparent hover:bg-red-50 hover:border-red-200'
                          }`}
                      >
                        <input
                          type="radio"
                          name="rejectReason"
                          value={reason}
                          checked={rejectReason === reason}
                          onChange={() => setRejectReason(reason)}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                  {formError && !rejectReason && (
                    <p className="mt-2 text-sm text-red-600">{formError}</p>
                  )}
                </div>
                {/* Additional notes for 'Other' reason */}
                {rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ระบุเหตุผลเพิ่มเติม
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="โปรดระบุเหตุผลในการปฏิเสธ"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      required
                    />
                    {formError && rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !notes.trim() && (
                      <p className="mt-2 text-sm text-red-600">{formError}</p>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCancelReject}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors duration-150 flex items-center gap-1"
                    disabled={!rejectReason || (rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !notes.trim()) || isSubmitting}
                  >
                    <XCircleIcon className="w-5 h-5" />
                    {isSubmitting ? 'กำลังประมวลผล...' : 'ยืนยัน'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomed && repairImages.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <div>
                <h3 className="font-medium">
                  รูปภาพความเสียหาย {activeImageIndex + 1} จาก {repairImages.length}
                </h3>
                {repairImages[activeImageIndex]?.repair_code && (
                  <p className="text-sm text-blue-600 font-medium">
                    รหัส: {repairImages[activeImageIndex].repair_code}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={repairImages[activeImageIndex]?.url || `http://localhost:5000/${repairImages[activeImageIndex]?.file_path}`}
                alt={`รูปภาพความเสียหาย ${activeImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain"
              />

              {/* Navigation buttons */}
              {repairImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {repairImages.length > 1 && (
              <div className="p-4 bg-gray-100">
                <div className="flex gap-2 overflow-x-auto">
                  {repairImages.map((image, index) => (
                    <button
                      key={image.filename || index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-colors ${
                        index === activeImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image.url || `http://localhost:5000/${image.file_path}`}
                        alt={`รูปภาพ ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}