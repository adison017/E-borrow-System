import { useState } from 'react';
import { FaTools } from 'react-icons/fa';

export default function InspectRepairedEquipmentDialog({
  open,
  onClose,
  equipment,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    inspectionNotes: '',
    isRepaired: true
  });

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      equipment: {
        name: equipment.name,
        code: equipment.id,
        category: 'อุปกรณ์ทั่วไป'
      },
      inspectionDate: new Date().toISOString().split('T')[0],
      status: 'พร้อมใช้งาน'  // Set status to ready for use after inspection
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-100 to-blue-50">
          <h3 className="text-xl font-bold flex items-center gap-3 text-blue-700">
            <FaTools className="text-blue-500 text-2xl" />
            <span>ตรวจรับครุภัณฑ์หลังซ่อม</span>
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost hover:opacity-70">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6  space-y-7 bg-white">
          {/* ข้อมูลครุภัณฑ์ */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 shadow-sm">
            <h4 className="font-semibold text-blue-600 flex items-center gap-2 mb-2 text-base">
              ข้อมูลครุภัณฑ์
            </h4>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">ชื่อ:</span> {equipment.name}
              </p>
              <p>
                <span className="font-medium">รหัส:</span> {equipment.item_code}
              </p>
            </div>
          </div>

          {/* บันทึกการตรวจสอบ */}
          <div>
            <label className="label mb-1">
              <span className="label-text text-base font-medium text-gray-700">บันทึกการตรวจสอบ</span>
            </label>
            <textarea
              rows={4}
              className="textarea w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition p-3 text-gray-800"
              value={formData.inspectionNotes}
              onChange={(e) => setFormData({ ...formData, inspectionNotes: e.target.value })}
              placeholder="บันทึกผลการตรวจสอบ..."
            />
          </div>

          {/* สถานะการซ่อม */}
          <div>
            <label className="label mb-1">
              <span className="label-text text-base font-medium text-gray-700">ผลการตรวจสอบ</span>
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 transition">
                <input
                  type="radio"
                  name="repairStatus"
                  className="radio radio-primary"
                  checked={formData.isRepaired}
                  onChange={() => setFormData({ ...formData, isRepaired: true })}
                />
                <span className="text-green-600 font-medium flex items-center gap-1">ซ่อมเสร็จสมบูรณ์</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-gray-200 hover:bg-red-50 transition">
                <input
                  type="radio"
                  name="repairStatus"
                  className="radio radio-primary"
                  checked={!formData.isRepaired}
                  onChange={() => setFormData({ ...formData, isRepaired: false })}
                />
                <span className="text-red-500 font-medium">ยังไม่สมบูรณ์</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-neutral bg-ghost border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition rounded-full px-6"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={!formData.inspectionNotes}
          >
            ยืนยัน
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
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
  );
}