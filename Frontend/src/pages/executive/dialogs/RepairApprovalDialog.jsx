import { RiCoinsFill } from "react-icons/ri"; 
import { BsFillCalendarDateFill } from "react-icons/bs"; 
import { useState } from 'react'
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaImage,
  FaUser,
  FaTools,
  FaCalendarAlt,
  FaDollarSign
} from 'react-icons/fa'

export default function RepairApprovalDialog({
  open,
  onClose,
  repairRequest,
  onApprove,
  onReject
}) {
  const [notes, setNotes] = useState('')
  const [budgetApproved, setBudgetApproved] = useState(repairRequest?.estimatedCost || 0)
  const [assignedTo, setAssignedTo] = useState('')
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const handleApprove = () => {
    onApprove({
      ...repairRequest,
      approvalNotes: notes,
      budgetApproved: Number(budgetApproved),
      assignedTo,
      approvalDate: new Date().toISOString().split('T')[0]
    })
    setNotes('')
    onClose()
  }

  const handleReject = () => {
    onReject({
      ...repairRequest,
      approvalNotes: notes,
      rejectionDate: new Date().toISOString().split('T')[0]
    })
    setNotes('')
    onClose()
  }

  if (!repairRequest) return null

  return (
    <div data-theme="light" className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {repairRequest.status === 'pending' ? (
              <>
                <FaExclamationTriangle className="text-yellow-500" />
                <span>พิจารณาคำขอแจ้งซ่อมครุภัณฑ์</span>
              </>
            ) : (
              <>
                <FaTools className="text-blue-500" />
                <span>รายละเอียดการแจ้งซ่อม</span>
              </>
            )}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* ส่วนแสดงรูปภาพ */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex gap-4">
              {/* แถบรูปขนาดเล็กทางขวา */}
              {repairRequest.images?.length > 1 && (
                <div className="w-16 flex flex-col gap-2 overflow-y-auto max-h-48">
                  {repairRequest.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveImageIndex(index);
                        setIsZoomed(false);
                      }}
                      className={`w-full aspect-square rounded-md overflow-hidden border-2 ${
                        activeImageIndex === index 
                          ? 'border-primary' 
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`รูปภาพ ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* รูปภาพหลัก */}
              <div className="flex-1 bg-base-200 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                {repairRequest.images?.length > 0 ? (
                  <>
                    <img
                      src={repairRequest.images[activeImageIndex]}
                      alt="รูปภาพครุภัณฑ์เสียหาย"
                      className={`object-contain h-full w-full transition-transform duration-300 ${
                        isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                      }`}
                      onClick={() => setIsZoomed(!isZoomed)}
                    />
                    {repairRequest.images.length > 1 && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                        {repairRequest.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveImageIndex(idx);
                              setIsZoomed(false);
                            }}
                            className={`w-2 h-2 rounded-full ${
                              activeImageIndex === idx ? 'bg-primary' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <FaImage className="text-3xl" />
                    <span className="mt-2 text-sm">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>
            </div>

            {/* ปุ่มเลื่อนและหมายเลขรูปภาพ */}
            {repairRequest.images?.length > 1 && (
              <div className="flex justify-between items-center text-sm text-gray-500">
                <button
                  onClick={() => {
                    setActiveImageIndex(prev => (prev - 1 + repairRequest.images.length) % repairRequest.images.length);
                    setIsZoomed(false);
                  }}
                  className="btn btn-xs"
                >
                  ← ก่อนหน้า
                </button>
                <span>
                  รูปภาพ {activeImageIndex + 1}/{repairRequest.images.length}
                </span>
                <button
                  onClick={() => {
                    setActiveImageIndex(prev => (prev + 1) % repairRequest.images.length);
                    setIsZoomed(false);
                  }}
                  className="btn btn-xs"
                >
                  ถัดไป →
                </button>
              </div>
            )}

            {repairRequest.images?.length > 1 && (
              <div className="flex justify-between items-center text-sm text-gray-500">
                <button
                  onClick={() => {
                    setActiveImageIndex(prev => (prev - 1 + repairRequest.images.length) % repairRequest.images.length);
                    setIsZoomed(false);
                  }}
                  className="btn btn-xs"
                >
                  ← ก่อนหน้า
                </button>
                <span>
                  รูปภาพ {activeImageIndex + 1}/{repairRequest.images.length}
                </span>
                <button
                  onClick={() => {
                    setActiveImageIndex(prev => (prev + 1) % repairRequest.images.length);
                    setIsZoomed(false);
                  }}
                  className="btn btn-xs"
                >
                  ถัดไป →
                </button>
              </div>
            )}

            {/* ข้อมูลครุภัณฑ์ */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-medium text-primary flex items-center gap-2 mb-2">
                <FaTools />
                ข้อมูลครุภัณฑ์
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">ชื่อ:</span> {repairRequest.equipment.name}
                </p>
                <p>
                  <span className="font-medium">รหัส:</span> {repairRequest.equipment.code}
                </p>
                <p>
                  <span className="font-medium">ประเภท:</span> {repairRequest.equipment.category}
                </p>
              </div>
            </div>
          </div>

          {/* ส่วนรายละเอียดการซ่อม */}
          <div className="md:col-span-2 space-y-6">
            {/* ข้อมูลผู้แจ้ง */}
            <div className="flex items-start gap-4 p-3 bg-base-200 rounded-lg">
              <div className="bg-white p-2 rounded-full">
                <FaUser className="text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium">ผู้แจ้งซ่อม</h4>
                <p className="text-sm">
                  {repairRequest.requester.name} ({repairRequest.requester.department})
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  วันที่แจ้ง: {repairRequest.requestDate}
                </p>
              </div>
            </div>

            {/* รายละเอียดปัญหา */}
            <div>
              <h4 className="font-medium mb-2">รายละเอียดปัญหา</h4>
              <div className="bg-base-200 p-4 rounded-lg whitespace-pre-line text-sm">
                {repairRequest.description}
              </div>
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex-row items-center gap-2 p-6 border-2 border-blue-600 rounded-2xl">
                <div className="mb-1 flex items-center">
                  <BsFillCalendarDateFill size={22} className="text-gray-600" />
                  <span className="px-2"> วันที่แจ้ง </span>
                </div>
                <span className="text-md">
                  {repairRequest.requestDate}
                </span>
              </div>
              <div className="flex-row items-center gap-2 border-2 border-amber-500 p-6 rounded-2xl">
                <div className="mb-1 flex items-center">
                  <RiCoinsFill size={25}  className="text-gray-600" />
                  <span className="px-2"> ค่าใช้จ่ายประมาณ </span>
                </div>
                <span className="text-md">
                  {repairRequest.estimatedCost?.toLocaleString()} บาท
                </span>
              </div>
            </div>

            {/* สำหรับคำขอที่ยังไม่อนุมัติ */}
            {repairRequest.status === 'pending' && (
              <>
                <div>
                  <label className="label">
                    <span className="label-text">หมายเหตุ (ถ้ามี)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="textarea w-full"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ระบุหมายเหตุเพิ่มเติม..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">งบประมาณที่อนุมัติ (บาท)</span>
                    </label>
                    <input
                      type="number"
                      className="input w-full"
                      value={budgetApproved}
                      onChange={(e) => setBudgetApproved(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">มอบหมายให้</span>
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="ชื่อช่างหรือทีมงาน"
                    />
                  </div>
                </div>
              </>
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
        </div>

        <div className="modal-action">
          {repairRequest.status === 'pending' ? (
            <>
              <button onClick={handleReject} className="btn btn-error">
                <FaTimesCircle className="mr-1" />
                ปฏิเสธ
              </button>
              <button onClick={handleApprove} className="btn btn-success">
                <FaCheckCircle className="mr-1" />
                อนุมัติ
              </button>
            </>
          ) : (
            <button onClick={onClose} className="btn">
              ปิด
            </button>
          )}
        </div>
      </div>
    </div>
  )
}