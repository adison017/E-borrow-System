import { Typography } from "@material-tailwind/react";

export default function DeleteUserDialog({ 
  open, 
  onClose, 
  selectedUser, 
  onConfirm 
}) {
  return (
    <div className={`modal ${open ? 'modal-open' : ''} transition-all duration-300 ease-in-out`}>
      <div className={`modal-box max-w-sm bg-white mx-auto transition-all duration-300 ease-in-out ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <h3 className="font-bold text-lg text-center text-black">ยืนยันการลบผู้ใช้งาน</h3>
        <div className="py-4 text-center text-black">
          คุณแน่ใจว่าต้องการลบผู้ใช้งาน <strong>{selectedUser?.username}</strong> <br />
          (รหัส: {selectedUser?.user_code}) ใช่หรือไม่?
        </div>
        <div className="modal-action flex justify-center gap-3">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button 
            className="btn btn-error text-white" 
            onClick={onConfirm}
          >
            ยืนยันการลบ
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50 transition-opacity duration-300" onClick={onClose}></div>
    </div>
  );
}