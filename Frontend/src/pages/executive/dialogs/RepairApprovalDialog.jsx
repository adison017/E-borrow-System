import { XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
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
import { MdAssignment, MdClose, MdFullscreen, MdGridView } from "react-icons/md";
import { RiCoinsFill } from "react-icons/ri";
import axios from 'axios';

export default function RepairApprovalDialog({
  open,
  onClose,
  repairRequest,
  onApprove,
  onReject,
  technicians = [] // Default empty array if not provided
}) {
  console.log('Repair Request Data:', repairRequest);
  console.log('Equipment Data:', repairRequest?.equipment);
  console.log('Requester Data:', repairRequest?.requester);
  console.log('Status:', repairRequest?.status);
  console.log('Request Date:', repairRequest?.request_date);
  console.log('Equipment Name:', repairRequest?.equipment_name);
  console.log('Equipment Code:', repairRequest?.equipment_code);
  console.log('Equipment Category:', repairRequest?.equipment_category);
  console.log('Problem Description:', repairRequest?.problem_description);
  console.log('Estimated Cost:', repairRequest?.estimated_cost);
  console.log('Equipment Pic:', repairRequest?.equipment_pic);

  const [notes, setNotes] = useState('')
  const [budgetApproved, setBudgetApproved] = useState(repairRequest?.estimatedCost || 0)
  const [assignedTo, setAssignedTo] = useState('')
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState('single') // 'single' or 'grid'
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [formError, setFormError] = useState("");

  // Sample technicians data if none provided
  const availableTechnicians = technicians.length > 0 ? technicians : [
    { id: 1, name: "นายช่างคนที่ 1" },
    { id: 2, name: "นายช่างคนที่ 2" },
    { id: 3, name: "นายช่างคนที่ 3" },
    { id: 4, name: "แผนกซ่อมบำรุง" },
  ]

  const rejectReasonOptions = [
    "งบประมาณไม่ผ่านการอนุมัติ",
    "ไม่สามารถซ่อมแซมได้",
    "รายการนี้ไม่อยู่ในขอบเขตงานซ่อม",
    "อื่นๆ (โปรดระบุในหมายเหตุ)"
  ];

  const handleApprove = async () => {
    console.log('Starting handleApprove function');
    console.log('repairRequest:', repairRequest);
    console.log('assignedTo:', assignedTo);

    // Validate required fields
    if (!assignedTo) {
      console.log('Validation failed: assignedTo is empty');
      setFormError("โปรดเลือกผู้รับผิดชอบ");
      return;
    }

    // Validate repair request ID and equipment code
    if (!repairRequest?.requestId) {
      console.log('Validation failed: requestId is missing');
      setFormError("ไม่พบรหัสคำขอซ่อม กรุณาลองใหม่อีกครั้ง");
      return;
    }

    if (!repairRequest?.equipment_code) {
      console.log('Validation failed: equipment_code is missing');
      setFormError("ไม่พบรหัสครุภัณฑ์ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    try {
      // Log the full repair request object for debugging
      console.log('Full Repair Request Object:', JSON.stringify(repairRequest, null, 2));

      const updateData = {
        problem_description: repairRequest.problem_description,
        request_date: repairRequest.request_date,
        estimated_cost: repairRequest.estimated_cost,
        status: "อนุมัติ",
        pic_filename: repairRequest.equipment_pic_filename,
        note: notes,
        budget: Number(budgetApproved),
        responsible_person: assignedTo,
        approval_date: new Date().toISOString().split('T')[0]
      };

      // Log the update data for debugging
      console.log('Sending update data:', updateData);

      // Make the API request to update repair request
      console.log('Making API request to update repair request...');
      const response = await axios.put(
        `http://localhost:5000/api/repair-requests/${repairRequest.requestId}`,
        updateData
      );
      console.log('Repair request update response:', response.data);

      // Check if the response contains data
      if (response.data) {
        // Update equipment status to "กำลังซ่อม"
        try {
          console.log('Updating equipment status for code:', repairRequest.equipment_code);
          const equipmentUpdateData = {
            status: "กำลังซ่อม",
            last_updated: new Date().toISOString().split('T')[0]
          };
          console.log('Equipment update data:', equipmentUpdateData);

          // First get equipment by code to get the item_id
          const equipmentResponse = await axios.get(
            `http://localhost:5000/api/equipment/code/${repairRequest.equipment_code}`
          );
          console.log('Equipment data:', equipmentResponse.data);

          if (equipmentResponse.data && equipmentResponse.data.item_id) {
            // Then update the equipment status using the ID
            const updateResponse = await axios.put(
              `http://localhost:5000/api/equipment/${equipmentResponse.data.item_id}/status`,
              equipmentUpdateData
            );
            console.log('Equipment status update response:', updateResponse.data);
          } else {
            throw new Error('Equipment not found');
          }
        } catch (equipmentError) {
          console.error('Error updating equipment status:', equipmentError);
          console.error('Error details:', {
            message: equipmentError.message,
            response: equipmentError.response?.data,
            status: equipmentError.response?.status,
            url: `http://localhost:5000/api/equipment/code/${repairRequest.equipment_code}`
          });
          setFormError("อัพเดทสถานะครุภัณฑ์ไม่สำเร็จ แต่การอนุมัติสำเร็จ");
        }

        // Reset form state
        setNotes('');
        setBudgetApproved(0);
        setAssignedTo('');
        setFormError('');

        // Notify parent component of successful approval
        console.log('Notifying parent component of successful approval');
        onApprove({
          repair_id: repairRequest.requestId,
          note: notes,
          budget: Number(budgetApproved),
          responsible_person: assignedTo,
          approval_date: new Date().toISOString().split('T')[0],
          status: "อนุมัติ"
        });

        // Close dialog after successful update
        console.log('Closing dialog');
        onClose();
      } else {
        console.error('No response data received');
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error in handleApprove:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });

      // Check if the request was actually successful despite the error
      if (error.response?.status === 200 || error.response?.data) {
        console.log('Request was successful despite error, updating equipment status');
        // Try to update equipment status
        try {
          console.log('Updating equipment status for code:', repairRequest.equipment_code);
          const equipmentUpdateData = {
            status: "กำลังซ่อม",
            last_updated: new Date().toISOString().split('T')[0]
          };
          console.log('Equipment update data:', equipmentUpdateData);

          // First get equipment by code to get the item_id
          const equipmentResponse = await axios.get(
            `http://localhost:5000/api/equipment/code/${repairRequest.equipment_code}`
          );
          console.log('Equipment data:', equipmentResponse.data);

          if (equipmentResponse.data && equipmentResponse.data.item_id) {
            // Then update the equipment status using the ID
            const updateResponse = await axios.put(
              `http://localhost:5000/api/equipment/${equipmentResponse.data.item_id}/status`,
              equipmentUpdateData
            );
            console.log('Equipment status update response:', updateResponse.data);
          } else {
            throw new Error('Equipment not found');
          }
        } catch (equipmentError) {
          console.error('Error updating equipment status:', equipmentError);
          console.error('Equipment error details:', {
            message: equipmentError.message,
            response: equipmentError.response?.data,
            status: equipmentError.response?.status,
            url: `http://localhost:5000/api/equipment/code/${repairRequest.equipment_code}`
          });
          setFormError("อัพเดทสถานะครุภัณฑ์ไม่สำเร็จ แต่การอนุมัติสำเร็จ");
        }

        // Reset form state
        setNotes('');
        setBudgetApproved(0);
        setAssignedTo('');
        setFormError('');

        // Notify parent component of successful approval
        console.log('Notifying parent component of successful approval');
        onApprove({
          repair_id: repairRequest.requestId,
          note: notes,
          budget: Number(budgetApproved),
          responsible_person: assignedTo,
          approval_date: new Date().toISOString().split('T')[0],
          status: "อนุมัติ"
        });

        // Close dialog after successful update
        console.log('Closing dialog');
        onClose();
        return;
      }

      // Handle specific error cases
      if (error.response) {
        console.log('Handling specific error cases');
        switch (error.response.status) {
          case 404:
            setFormError("ไม่พบคำขอซ่อมที่ต้องการอัพเดท");
            break;
          case 500:
            setFormError("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
            break;
          default:
            setFormError("เกิดข้อผิดพลาดในการอนุมัติคำขอซ่อม");
        }
      } else {
        setFormError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  }

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

  const handleConfirmReject = () => {
    if (!rejectReason) {
      setFormError("โปรดเลือกเหตุผลในการปฏิเสธ");
      return;
    }
    if (rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !notes.trim()) {
      setFormError("โปรดระบุเหตุผลเพิ่มเติม");
      return;
    }
    const finalNotes = rejectReason.includes("อื่นๆ")
      ? notes
      : `${rejectReason}${notes ? `. ${notes}` : ''}`.trim();
    onReject({
      requestId: repairRequest.requestId,
      approvalNotes: finalNotes,
      rejectionDate: new Date().toISOString().split('T')[0]
    });
    setNotes("");
    setShowRejectDialog(false);
    onClose();
  };

  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % repairRequest.images.length);
    setIsZoomed(false);
  }

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + repairRequest.images.length) % repairRequest.images.length);
    setIsZoomed(false);
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

          {/* รูปภาพ */}
          {repairRequest.equipment_pic_filename ? (
            <div className="bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FaImage className="text-gray-600" />
                  รูปภาพอุปกรณ์
                </h4>
              </div>
              <div className="relative rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden" style={{height: '200px'}}>
                <img
                  src={`http://localhost:5000/uploads/${repairRequest.equipment_pic_filename}`}
                  alt="รูปภาพอุปกรณ์"
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FaImage className="text-gray-600" />
                รูปภาพอุปกรณ์
              </h4>
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center">
                <FaImage className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">ไม่มีรูปภาพประกอบ</p>
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
          {repairRequest.status === 'รอการอนุมัติซ่อม' && (
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
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="" disabled>-- เลือกผู้รับผิดชอบ --</option>
                      {availableTechnicians.map(tech => (
                        <option key={tech.id} value={tech.name}>
                          {tech.name}
                        </option>
                      ))}
                    </select>
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
                    โดย {repairRequest.assignedTo || 'ไม่ระบุผู้รับผิดชอบ'}
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
                    วันที่ปฏิเสธ: {repairRequest.rejectionDate}
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
        <div className="modal-action mt-6 pt-3">
          {repairRequest.status === 'รอการอนุมัติซ่อม' && (
            <>
              <button onClick={handleRejectClick} className="btn btn-error hover:opacity-90 text-white rounded-2xl">
                <FaTimesCircle className="mr-1" />
                ปฏิเสธ
              </button>
              <button onClick={handleApprove} className="btn btn-success hover:opacity-90 text-white rounded-2xl">
                <FaCheckCircle className="mr-1" />
                อนุมัติ
              </button>
            </>
          )}
        </div>
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
                    disabled={!rejectReason || (rejectReason === "อื่นๆ (โปรดระบุในหมายเหตุ)" && !notes.trim())}
                  >
                    <XCircleIcon className="w-5 h-5" />
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}