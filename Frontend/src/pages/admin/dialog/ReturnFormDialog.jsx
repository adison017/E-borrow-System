import { ExclamationTriangleIcon, InformationCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, CheckCircleIcon as CheckCircleSolidIcon, ClipboardDocumentListIcon, DocumentCheckIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button } from "@material-tailwind/react";
dayjs.extend(utc);
dayjs.extend(timezone);

const ReturnFormDialog = ({
  borrowedItem,
  isOpen,
  onClose,
  onConfirm,
  isOverdue,
  fineAmount,
  setFineAmount,
  showNotification,
  paymentDetails,
}) => {
  const [returnCondition, setReturnCondition] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [damageLevels, setDamageLevels] = useState([]);
  const [selectedDamageLevelId, setSelectedDamageLevelId] = useState(null);
  const [damageLevelDetail, setDamageLevelDetail] = useState("");
  const [showUploadSlip, setShowUploadSlip] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
  const [slipVerifyResult, setSlipVerifyResult] = useState(null);

  const userId = borrowedItem?.user_id;

  // fallback ถ้า parent ไม่ได้ส่ง showNotification มา
  const notify = showNotification || ((msg, type) => alert(msg));

  useEffect(() => {
    fetch("http://localhost:5000/api/damage-levels")
      .then(res => res.json())
      .then(data => setDamageLevels(data));
  }, []);

  useEffect(() => {
    if (selectedDamageLevelId) {
      const found = damageLevels.find(dl => dl.damage_id === Number(selectedDamageLevelId));
      setDamageLevelDetail(found ? found.detail : "");
    } else {
      setDamageLevelDetail("");
    }
  }, [selectedDamageLevelId, damageLevels]);

  useEffect(() => {
    if (!selectedDamageLevelId || !damageLevels.length || !borrowedItem || !borrowedItem.equipment) {
      setFineAmount(0);
      return;
    }
    const level = damageLevels.find(dl => dl.damage_id === Number(selectedDamageLevelId) || dl.id === Number(selectedDamageLevelId));
    if (level) {
      let totalPrice = 0;
      if (Array.isArray(borrowedItem.equipment)) {
        totalPrice = borrowedItem.equipment.reduce((sum, eq) => sum + (Number(eq.price || 0) * (eq.quantity || 1)), 0);
      } else if (borrowedItem.equipment) {
        totalPrice = Number(borrowedItem.equipment.price || 0) * (borrowedItem.equipment.quantity || 1);
      }
      const fine = Math.round((Number(level.fine_percent) / 100) * totalPrice);
      setFineAmount(fine);
    } else {
      setFineAmount(0);
    }
  }, [selectedDamageLevelId, damageLevels, borrowedItem]);

  // สมมุติค่าปรับล่าช้าต่อวัน
  const LATE_FINE_PER_DAY = 20;
  const dueDate = borrowedItem?.due_date ? new Date(borrowedItem.due_date) : null;
  const returnDate = getThailandNow(); // วันคืนจริง (ปัจจุบัน)
  const overdayCount = dueDate ? Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24))) : 0;
  const lateFineAmount = overdayCount * LATE_FINE_PER_DAY;

  // รวมค่าปรับล่าช้าและค่าปรับเสียหาย
  const totalFineAmount = fineAmount + lateFineAmount;

  // เพิ่มการอ่าน damage_cost จาก paymentDetails (ถ้ามี) และคำนวณยอดรวม
  const fineAmountValue = Number(paymentDetails?.fine_amount ?? fineAmount) || 0;
  const damageCost = Number(paymentDetails?.damage_cost ?? 0);
  const totalAmount = lateFineAmount + fineAmountValue;

  if (!isOpen || !borrowedItem) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    try {
      onConfirm({
        borrowedItem,
        returnCondition,
        returnNotes,
        fineAmount,
        paymentMethod,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionOptions = [
    { value: "good", label: "สภาพดี", color: "success" },
    { value: "minor_damage", label: "ชำรุดเล็กน้อย", color: "warning" },
    { value: "major_damage", label: "ชำรุดหนัก", color: "error" },
    { value: "lost", label: "สูญหาย", color: "error" },
  ];

  const paymentMethods = [
    { value: "cash", label: "เงินสด" },
    { value: "transfer", label: "โอนเงิน" },
    { value: "other", label: "อื่นๆ" },
    { value: "online", label: "ออนไลน์" },
  ];

  const equipmentItems = Array.isArray(borrowedItem.equipment) ? borrowedItem.equipment : [borrowedItem.equipment];

  const handleSubmit = async () => {
    // Validate ข้อมูลก่อนส่ง
    if (!borrowedItem?.borrow_id) {
      notify('ไม่พบข้อมูลการยืม', 'error');
      return;
    }
    if (!userId) {
      notify('ไม่พบข้อมูลผู้คืน (userId)', 'error');
      return;
    }
    if (!selectedDamageLevelId) {
      notify('กรุณาเลือกสภาพครุภัณฑ์', 'error');
      return;
    }
    setIsSubmitting(true);
    // หา damage level object
    const selectedDamageLevel = damageLevels.find(dl => dl.damage_id === Number(selectedDamageLevelId) || dl.id === Number(selectedDamageLevelId));
    const proofImage = null;
    const payload = {
      borrow_id: borrowedItem.borrow_id,
      return_date: getThailandNowString(),
      return_by: userId,
      condition_level_id: selectedDamageLevel ? (selectedDamageLevel.damage_id || selectedDamageLevel.id) : selectedDamageLevelId,
      condition_text: selectedDamageLevel ? selectedDamageLevel.detail : '',
      fine_amount: totalFineAmount,
      proof_image: proofImage || null,
      status: 'pending',
      notes: returnNotes || '',
      pay_status: (paymentMethod === 'online' || paymentMethod === 'transfer') ? 'pending' : 'paid',
      paymentMethod,
    };
    console.log('submit payload', payload);
    try {
      const res = await fetch('http://localhost:5000/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error('เกิดข้อผิดพลาดในการบันทึกการคืน: ' + errText);
      }
      notify(
        'บันทึกข้อมูลการคืนสำเร็จ' + ((paymentMethod === 'online' || paymentMethod === 'transfer') ? '\nผู้ใช้ต้องไปชำระเงินในหน้า "ชำระค่าปรับ"' : ''),
        'success'
      );
      onClose();
    } catch (err) {
      notify(err.message || 'เกิดข้อผิดพลาดในการบันทึกการคืน', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชัน mapping สีและไอคอนตาม damage level
  const getDamageLevelStyle = (level) => {
    if (!level) return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: null };
    switch (level.name) {
      case 'สภาพดี':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: <CheckCircleSolidIcon className="w-5 h-5 text-green-400 inline mr-1" /> };
      case 'ชำรุดเล็กน้อย':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <InformationCircleIcon className="w-5 h-5 text-blue-400 inline mr-1" /> };
      case 'ชำรุดปานกลาง':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 inline mr-1" /> };
      case 'ชำรุดหนัก':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: <ExclamationCircleIcon className="w-5 h-5 text-orange-400 inline mr-1" /> };
      case 'สูญหาย':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: <XCircleIcon className="w-5 h-5 text-red-400 inline mr-1" /> };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: null };
    }
  };

  // เพิ่มฟังก์ชัน getThailandNow
  function getThailandNow() {
    // ใช้ toLocaleString เพื่อให้ได้เวลาตาม timezone ไทย แล้วแปลงกลับเป็น Date
    const tzDateStr = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
    return new Date(tzDateStr);
  }

  function getThailandNowString() {
    return dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  const handleUploadSlip = async (e) => {
    const file = e.target.files[0];
    setSlipFile(file);
    setIsVerifyingSlip(true);
    // ตัวอย่าง: ส่งไฟล์ไป backend เพื่อตรวจสอบกับ Easy Slip
    const formData = new FormData();
    formData.append("slip", file);
    try {
      const res = await fetch("http://localhost:5000/api/verify-slip", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      setSlipVerifyResult(result);
      setIsVerifyingSlip(false);
    } catch (err) {
      setSlipVerifyResult({ success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบสลิป" });
      setIsVerifyingSlip(false);
    }
  };

  const isReadOnly = borrowedItem?.status === 'waiting_payment';

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white rounded-xl shadow-xl w-full max-w-8xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-lg shadow-sm">
                <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">บันทึกการคืนครุภัณฑ์</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-mono font-medium text-blue-600">รหัสการยืม: {borrowedItem.borrow_code}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Borrower Info */}
            <div className="space-y-6 lg:order-1">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-gray-800">ข้อมูลผู้ยืม</h3>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={
                      borrowedItem?.borrower?.avatar
                        ? borrowedItem.borrower.avatar.startsWith('http')
                          ? borrowedItem.borrower.avatar
                          : `http://localhost:5000/uploads/user/${borrowedItem.borrower.avatar}`
                        : '/default-avatar.png'
                    }
                    alt={borrowedItem?.borrower?.name}
                    className="w-24 h-24 rounded-full object-cover bg-white border-4 border-gray-200 shadow-lg flex-shrink-0"
                  />
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-800">{borrowedItem.borrower.name}</p>
                    <p className="text-gray-500 ">{borrowedItem.borrower.position}</p>
                    <p className="text-gray-500 mt-1">{borrowedItem.borrower.department}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">รหัสการยืม</span>
                    <span className="font-mono text-blue-700">{borrowedItem.borrow_code}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">ระยะเวลายืม</span>
                    <span className="font-semibold text-gray-800 text-right">{borrowedItem.borrow_date ? new Date(borrowedItem.borrow_date).toLocaleDateString() : '-'} ถึง {borrowedItem.due_date ? new Date(borrowedItem.due_date).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>

              {isOverdue && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-700">พบการคืนล่าช้า!</h3>
                    <div className="text-sm text-red-600">
                      คืนช้า {overdayCount} วัน มีค่าปรับ {lateFineAmount} บาท
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Equipment List and Form */}
            <div className="lg:col-span-2 space-y-6 lg:order-2">
              {/* Equipment List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  รายการครุภัณฑ์ที่คืน
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">รหัสการยืม:</span>
                      <span className="font-mono text-gray-800 font-medium">{borrowedItem.borrow_code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">จำนวนครุภัณฑ์:</span>
                      <span className="font-mono text-gray-800 font-medium">
                        {equipmentItems?.reduce((total, eq) => total + (eq.quantity || 1), 0) || 0} ชิ้น
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">รูป</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ครุภัณฑ์</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">จำนวน</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {equipmentItems.length > 0 ? equipmentItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 py-3 align-middle text-center">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mx-auto border border-gray-200 bg-white">
                                {item.pic ? (
                                  <img src={item.pic} alt={item.name} className="max-w-full max-h-full object-contain p-1" onError={e => { e.target.onerror = null; e.target.src = '/lo.png'; }} />
                                ) : (
                                  <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle"><span className="font-semibold text-gray-800 text-base leading-tight">{item.name}</span><div className="text-xs text-gray-500 italic mt-1 leading-tight">{item.code}</div></td>
                            <td className="px-4 py-3 text-right align-middle"><span className="font-medium text-blue-700 text-base">{item.quantity || 1}</span></td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-gray-400 text-base">ไม่พบข้อมูลครุภัณฑ์</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Return Form */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />ข้อมูลการคืน</h3>
                  {isReadOnly && paymentDetails ? (
                    <div className="space-y-3 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">สถานะชำระเงิน</span>
                        <span className={`font-semibold px-2 py-1 rounded-full ${paymentDetails.pay_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>{paymentDetails.pay_status === 'paid' ? 'ชำระแล้ว' : 'รอชำระเงิน'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">วิธีการชำระเงิน</span>
                        <span className="font-medium text-gray-800">{paymentDetails.payment_method || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">ค่าปรับล่าช้า</span>
                        <span className="font-medium text-amber-800">{Number(paymentDetails.fine_amount) || 0} บาท</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">ค่าเสียหาย</span>
                        <span className="font-medium text-amber-800">{Number(paymentDetails.damage_cost) || 0} บาท</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2 mt-2">
                        <span className="text-base font-bold text-gray-700">รวมทั้งสิ้น</span>
                        <span className="font-bold text-blue-700 text-lg">{totalAmount} บาท</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-600 font-medium">หมายเหตุ</span>
                        <span className="text-gray-800 text-sm mt-1 whitespace-pre-line">{paymentDetails.notes || '-'}</span>
                      </div>
                    </div>
                  ) : (
                    <fieldset disabled={isReadOnly} style={isReadOnly ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* สภาพครุภัณฑ์ */}
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">สภาพครุภัณฑ์</label>
                          <select
                            className="w-full px-4 py-2.5 bg-white border border-white-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={isReadOnly && paymentDetails ? paymentDetails.condition_level_id : (selectedDamageLevelId || "")}
                            onChange={e => setSelectedDamageLevelId(e.target.value)}
                            disabled={isReadOnly}
                          >
                            <option value="">เลือกสภาพครุภัณฑ์</option>
                            {damageLevels.map(dl => (
                              <option key={dl.damage_id || dl.id} value={dl.damage_id || dl.id}>
                                {dl.name} {dl.fine_percent !== undefined && `(${dl.fine_percent}%)`}
                              </option>
                            ))}
                          </select>
                          {damageLevelDetail && selectedDamageLevelId && (() => {
                            const level = damageLevels.find(dl => dl.damage_id === Number(selectedDamageLevelId) || dl.id === Number(selectedDamageLevelId));
                            const style = getDamageLevelStyle(level);
                            return (
                              <div className={`mt-2 text-sm rounded p-2 flex items-start gap-2 ${style.bg} ${style.border} ${style.text}`}>
                                {style.icon}
                                <div>
                                  <div className="font-semibold mb-1">
                                    {level.name} {level.fine_percent !== undefined && `(${level.fine_percent}%)`}
                                  </div>
                                  <span>{damageLevelDetail}</span>
                                </div>
                              </div>
                            );
                          })()}
                          <label className="block text-sm font-medium text-gray-700 mt-4">หมายเหตุ</label>
                          <textarea
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="ระบุรายละเอียดเพิ่มเติม..."
                            rows={4}
                            value={isReadOnly && paymentDetails ? paymentDetails.notes : returnNotes}
                            onChange={(e) => setReturnNotes(e.target.value)}
                            disabled={isReadOnly}
                          />
                        </div>
                        {/* ค่าปรับ */}
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">ค่าปรับล่าช้า</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            value={lateFineAmount.toLocaleString()}
                            readOnly
                          />
                          <label className="block text-sm font-medium text-gray-700">ค่าเสียหาย</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            value={fineAmountValue.toLocaleString()}
                            readOnly
                          />
                          <label className="block text-sm font-medium text-gray-700">รวมทั้งสิ้น</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-blue-100 border border-blue-300 rounded-lg shadow-sm focus:outline-none font-bold text-blue-700 text-lg"
                            value={totalAmount.toLocaleString()}
                            readOnly
                          />
                          <label className="block text-sm font-medium text-gray-700">วิธีการชำระค่าปรับ</label>
                          <select
                            className="w-full px-4 py-2.5 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                            value={isReadOnly && paymentDetails ? paymentDetails.payment_method : paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            disabled={isReadOnly}
                          >
                            {paymentMethods.map((method) => (
                              <option key={method.value} value={method.value}>
                                {method.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </fieldset>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />กำลังดำเนินการ...</>
              ) : (
                <><CheckCircleSolidIcon className="w-5 h-5 mr-2" />ยืนยันการคืน</>
              )}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
};

export default ReturnFormDialog;