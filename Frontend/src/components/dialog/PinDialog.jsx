
export default function PinDialog({ open, pin, setPin, pinError, onCancel, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full">
        <h3 className="text-lg font-bold mb-4 text-center">กรุณากรอกรหัส PIN เพื่อยืนยัน</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            autoFocus
            maxLength={8}
          />
          {pinError && <div className="text-red-500 text-sm text-center">{pinError}</div>}
          <div className="flex justify-between mt-2">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={onCancel}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
