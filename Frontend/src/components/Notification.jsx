import { createPortal } from "react-dom";

// type: 'success' | 'error' | 'info' | 'warning' | 'add' | 'edit' | 'delete'
const iconByType = {
  success: (
    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
      {/* Checkmark icon */}
      <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  add: (
    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
      {/* Plus icon */}
      <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  edit: (
    <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
      {/* Pencil icon */}
      <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.414 2.586a2 2 0 00-2.828 0l-9.9 9.9A2 2 0 004 14v2a1 1 0 001 1h2a2 2 0 001.414-.586l9.9-9.9a2 2 0 000-2.828zM6 16H5v-1l9.293-9.293 1 1L6 16z" />
      </svg>
    </div>
  ),
  delete: (
    <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
      {/* Trash icon */}
      <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zM4 6V4a2 2 0 012-2h8a2 2 0 012 2v2h2v2H2V6h2zm2-2v2h8V4H6z" />
      </svg>
    </div>
  ),
  error: (
    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
  info: (
    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
      <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 112 0 1 1 0 01-2 0zm2 8a1 1 0 11-2 0V9a1 1 0 112 0v5z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  warning: (
    <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
      <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
  )
};

const AlertDialog = ({ show, message, type = "info", onClose, buttonText = "ตกลง" }) => {
  if (!show) return null;
  return createPortal(
    <dialog open className="modal z-[100]">
      <div className="modal-box max-w-sm text-center rounded-3xl shadow-2xl bg-white">
        {iconByType[type]}
        <div className={`font-bold text-2xl mb-3 text-black`}>{message}</div>
        <form method="dialog" className="modal-action justify-center mt-4">
          <button
            className={`btn px-10 py-3 rounded-xl shadow-lg border-0 text-white text-lg font-semibold ${type === 'success' ? 'bg-gradient-to-r from-green-400 to-teal-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-400' : 'bg-gradient-to-r from-blue-400 to-blue-500'} hover:scale-105 transition-all duration-300`}
            onClick={onClose}
            type="button"
          >
            {buttonText}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
    </dialog>,
    document.body
  );
};

export default AlertDialog;