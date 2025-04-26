const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            <button 
              className="btn btn-outline" 
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onConfirm}
            >
              ยืนยัน
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
      </div>
    );
  };
  
  export default ConfirmDialog;