import React from 'react';

export const LoginSuccessDialog = () => (
  <dialog  id="login-success-alert" className="modal">
    <div className="modal-box max-w-sm text-center rounded-2xl shadow-2xl bg-white">
      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 shadow-lg">
        <svg className="h-14 w-14 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="font-bold text-2xl text-gray-800 mb-3">เข้าสู่ระบบสำเร็จ!</h3>
      <p className="py-4 text-gray-600">ยินดีต้อนรับเข้าสู่ระบบ</p>
      <form method="dialog" className="modal-action justify-center">
        <button className="btn bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-3 rounded-xl shadow-lg hover:shadow-xl border-0">ตกลง</button>
      </form>
    </div>
    <form method="dialog" className="modal-backdrop"><button>close</button></form>
  </dialog>
);

export const LoginErrorDialog = () => {
  return (
    <dialog id="login-error-alert" className="modal">
      <div className="modal-box bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">เข้าสู่ระบบไม่สำเร็จ</h3>
          <p className="text-gray-600 text-center mb-4">
            ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง<br />
            กรุณาตรวจสอบและลองใหม่อีกครั้ง
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-red-500 hover:bg-red-600 text-white">ลองอีกครั้ง</button>
            </form>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export const RegisterSuccessDialog = () => (
  <dialog id="register-success-alert" className="modal">
    <div className="modal-box max-w-sm text-center rounded-2xl shadow-2xl bg-white">
      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 shadow-lg">
        <svg className="h-14 w-14 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="font-bold text-2xl text-gray-800 mb-3">สมัครสมาชิกสำเร็จ!</h3>
      <p className="py-4 text-gray-600">บัญชีของคุณถูกสร้างเรียบร้อยแล้ว</p>
      <form method="dialog" className="modal-action justify-center">
        <button className="btn bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-3 rounded-xl shadow-lg hover:shadow-xl border-0">ตกลง</button>
      </form>
    </div>
    <form method="dialog" className="modal-backdrop"><button>close</button></form>
  </dialog>
);

export const RegisterErrorDialog = () => (
  <dialog id="register-error-alert" className="modal">
    <div className="modal-box max-w-sm text-center rounded-2xl shadow-2xl bg-white">
      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 shadow-lg">
        <svg className="h-14 w-14 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="font-bold text-2xl text-gray-800 mb-3">เกิดข้อผิดพลาด!</h3>
      <p className="py-4 text-gray-600">ไม่สามารถสมัครสมาชิกได้ กรุณาลองอีกครั้ง</p>
      <form method="dialog" className="modal-action justify-center">
        <button className="btn bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-3 rounded-xl shadow-lg hover:shadow-xl border-0">ตกลง</button>
      </form>
    </div>
    <form method="dialog" className="modal-backdrop"><button>close</button></form>
  </dialog>
);

export const PasswordMismatchDialog = () => (
  <dialog id="password-mismatch-alert" className="modal">
    <div className="modal-box max-w-sm text-center rounded-2xl shadow-2xl bg-white">
      <div className="w-24 h-24 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-5 shadow-lg">
        <svg className="h-14 w-14 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="font-bold text-2xl text-gray-800 mb-3">รหัสผ่านไม่ตรงกัน!</h3>
      <p className="py-4 text-gray-600">กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน</p>
      <form method="dialog" className="modal-action justify-center">
        <button className="btn bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-10 py-3 rounded-xl shadow-lg hover:shadow-xl border-0">ตกลง</button>
      </form>
    </div>
    <form method="dialog" className="modal-backdrop"><button>close</button></form>
  </dialog>
);
