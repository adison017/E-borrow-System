import { useState, useEffect } from "react";
import { CheckCircleIcon, InformationCircleIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const BorrowFormDialog = ({ borrow, isOpen, onClose, onSave }) => {
  const initialFormState = {
    borrower: {
      name: "",
      department: "",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    equipment: {
      name: "",
      code: "",
      image: "/equipment-default.png"
    },
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: "",
    purpose: "",
    notes: "",
    status: "active"
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Reset form when dialog opens/closes or borrow changes
  useEffect(() => {
    if (isOpen) {
      if (borrow) {
        // Edit mode - populate form with borrow data
        setFormData(borrow);
      } else {
        // Add mode - reset form
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, borrow]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects like borrower.name
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate borrower
    if (!formData.borrower.name) newErrors["borrower.name"] = "กรุณาระบุชื่อผู้ยืม";
    if (!formData.borrower.department) newErrors["borrower.department"] = "กรุณาระบุแผนก";
    
    // Validate equipment
    if (!formData.equipment.name) newErrors["equipment.name"] = "กรุณาระบุชื่อครุภัณฑ์";
    if (!formData.equipment.code) newErrors["equipment.code"] = "กรุณาระบุรหัสครุภัณฑ์";
    
    // Validate dates
    if (!formData.borrow_date) newErrors.borrow_date = "กรุณาระบุวันที่ยืม";
    if (!formData.due_date) newErrors.due_date = "กรุณาระบุกำหนดวันคืน";
    
    // Validate due date is after borrow date
    if (formData.borrow_date && formData.due_date && new Date(formData.due_date) <= new Date(formData.borrow_date)) {
      newErrors.due_date = "กำหนดคืนต้องเป็นวันที่หลังจากวันยืม";
    }
    
    // Validate purpose
    if (!formData.purpose) newErrors.purpose = "กรุณาระบุวัตถุประสงค์การยืม";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="bg-blue-900 p-6 rounded-t-lg">
          <h2 className="text-xl font-bold text-white text-center">
            {borrow ? "แก้ไขข้อมูลการยืม" : "เพิ่มรายการยืมใหม่"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Equipment Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg font-bold text-blue-800 border-b pb-2">ข้อมูลครุภัณฑ์</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">ชื่อครุภัณฑ์</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="equipment.name"
                      placeholder="ระบุชื่อครุภัณฑ์"
                      className={`input input-bordered w-full ${errors["equipment.name"] ? "input-error" : ""}`}
                      value={formData.equipment.name}
                      onChange={handleInputChange}
                    />
                    <button className="btn btn-square btn-outline" type="button">
                      <QrCodeIcon className="h-5 w-5" />
                    </button>
                  </div>
                  {errors["equipment.name"] && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors["equipment.name"]}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">รหัสครุภัณฑ์</span>
                  </label>
                  <input
                    type="text"
                    name="equipment.code"
                    placeholder="ระบุรหัสครุภัณฑ์"
                    className={`input input-bordered w-full ${errors["equipment.code"] ? "input-error" : ""}`}
                    value={formData.equipment.code}
                    onChange={handleInputChange}
                  />
                  {errors["equipment.code"] && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors["equipment.code"]}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg font-bold text-blue-800 border-b pb-2">ข้อมูลผู้ยืม</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">ชื่อผู้ยืม</span>
                  </label>
                  <input
                    type="text"
                    name="borrower.name"
                    placeholder="ระบุชื่อผู้ยืม"
                    className={`input input-bordered w-full ${errors["borrower.name"] ? "input-error" : ""}`}
                    value={formData.borrower.name}
                    onChange={handleInputChange}
                  />
                  {errors["borrower.name"] && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors["borrower.name"]}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">แผนก</span>
                  </label>
                  <input
                    type="text"
                    name="borrower.department"
                    placeholder="ระบุแผนก"
                    className={`input input-bordered w-full ${errors["borrower.department"] ? "input-error" : ""}`}
                    value={formData.borrower.department}
                    onChange={handleInputChange}
                  />
                  {errors["borrower.department"] && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors["borrower.department"]}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Details */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg font-bold text-blue-800 border-b pb-2">รายละเอียดการยืม</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">วันที่ยืม</span>
                  </label>
                  <input
                    type="date"
                    name="borrow_date"
                    className={`input input-bordered w-full ${errors.borrow_date ? "input-error" : ""}`}
                    value={formData.borrow_date}
                    onChange={handleInputChange}
                  />
                  {errors.borrow_date && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.borrow_date}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">กำหนดคืน</span>
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    className={`input input-bordered w-full ${errors.due_date ? "input-error" : ""}`}
                    value={formData.due_date}
                    onChange={handleInputChange}
                  />
                  {errors.due_date && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.due_date}</span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">วัตถุประสงค์</span>
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="ระบุวัตถุประสงค์การยืม"
                    className={`input input-bordered w-full ${errors.purpose ? "input-error" : ""}`}
                    value={formData.purpose}
                    onChange={handleInputChange}
                  />
                  {errors.purpose && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.purpose}</span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">หมายเหตุเพิ่มเติม</span>
                  </label>
                  <textarea
                    name="notes"
                    placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Information Alert */}
          <div className="alert alert-info shadow-lg">
            <InformationCircleIcon className="h-6 w-6" />
            <div>
              <h3 className="font-bold">โปรดตรวจสอบข้อมูลให้ถูกต้อง</h3>
              <div className="text-xs">
                ครุภัณฑ์ที่ถูกยืมจะไม่สามารถให้ผู้อื่นยืมได้จนกว่าจะมีการคืน
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              {borrow ? "บันทึกการแก้ไข" : "บันทึกการยืม"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowFormDialog;