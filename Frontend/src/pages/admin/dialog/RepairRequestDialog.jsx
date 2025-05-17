import { useState } from 'react';
import { FaTools, FaImage, FaUser } from 'react-icons/fa';

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

  const handleSubmit = () => {
    if (!equipment) return;

    onSubmit({
      ...formData,
      equipment: {
        name: equipment.name,
        code: equipment.id,
        category: 'อุปกรณ์ทั่วไป'
      },
      requester: {
        name: 'ผู้ดูแลระบบ',
        department: 'ฝ่ายครุภัณฑ์'
      },
      requestDate: new Date().toISOString().split('T')[0],
      status: 'รออนุมัติซ่อม'
    });
    onClose();
  };

  if (!open || !equipment) return null;

  return (
    <div className="modal modal-open backdrop-blur bg-black/50 bg-opacity-30 ">
      <div className="modal-box max-w-3xl bg-white">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaTools className="text-blue-500" />
            <span>แจ้งซ่อมครุภัณฑ์</span>
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

          {/* รายละเอียดปัญหา */}
          <div>
            <label className="label">
              <span className="label-text">รายละเอียดปัญหา</span>
            </label>
            <textarea
              rows={4}
              className="textarea w-full bg-gray-100"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ระบุรายละเอียดของปัญหา..."
            />
          </div>

          {/* ค่าใช้จ่ายประมาณการ */}
          <div>
            <label className="label">
              <span className="label-text">ค่าใช้จ่ายประมาณการ (บาท)</span>
            </label>
            <input
              type="number"
              className="input w-full bg-gray-100"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              placeholder="ระบุค่าใช้จ่ายประมาณการ"
            />
          </div>

          {/* อัพโหลดรูปภาพ */}
          <div>
            <label className="label">
              <span className="label-text">รูปภาพประกอบ</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-100">
              <FaImage className="mx-auto text-3xl text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const imageUrls = files.map(file => URL.createObjectURL(file));
                  setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
                }}
              />
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
            disabled={!formData.description || !formData.estimatedCost}
          >
            ส่งคำขอแจ้งซ่อม
          </button>
        </div>
      </div>
    </div>
  );
}