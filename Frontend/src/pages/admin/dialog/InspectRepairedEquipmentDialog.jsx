import { useState } from 'react';
import { FaTools, FaCheck } from 'react-icons/fa';

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
    <div className="modal modal-open backdrop-blur bg-black/50 bg-opacity-30 ">
      <div className="modal-box max-w-3xl bg-white">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaTools className="text-blue-500" />
            <span>ตรวจรับครุภัณฑ์หลังซ่อม</span>
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* ข้อมูลครุภัณฑ์ */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-medium text-primary flex items-center gap-2 mb-2">
              <FaTools />
              ข้อมูลครุภัณฑ์
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">ชื่อ:</span> {equipment.name}
              </p>
              <p>
                <span className="font-medium">รหัส:</span> {equipment.id}
              </p>
            </div>
          </div>

          {/* บันทึกการตรวจสอบ */}
          <div>
            <label className="label">
              <span className="label-text">บันทึกการตรวจสอบ</span>
            </label>
            <textarea
              rows={4}
              className="textarea w-full bg-gray-100"
              value={formData.inspectionNotes}
              onChange={(e) => setFormData({ ...formData, inspectionNotes: e.target.value })}
              placeholder="บันทึกผลการตรวจสอบ..."
            />
          </div>

          {/* สถานะการซ่อม */}
          <div>
            <label className="label">
              <span className="label-text">ผลการตรวจสอบ</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repairStatus"
                  className="radio radio-primary"
                  checked={formData.isRepaired}
                  onChange={() => setFormData({ ...formData, isRepaired: true })}
                />
                <span>ซ่อมเสร็จสมบูรณ์</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repairStatus"
                  className="radio radio-primary"
                  checked={!formData.isRepaired}
                  onChange={() => setFormData({ ...formData, isRepaired: false })}
                />
                <span>ยังไม่สมบูรณ์</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn">
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={!formData.inspectionNotes}
          >
            ยืนยันการตรวจรับ
          </button>
        </div>
      </div>
    </div>
  );
}