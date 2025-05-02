import { useRef, useEffect, useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { BrowserMultiFormatReader, Exception } from "@zxing/library";

const ScannerDialog = ({ isOpen, onClose, onScanComplete, onManualInput }) => {
  const scannerRef = useRef(null);
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const codeReader = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    if (isOpen && scannerRef.current && !codeReader.current) {
      initializeScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const initializeScanner = async () => {
    setScanning(true);
    setError(null);

    try {
      // ตรวจสอบว่า videoRef ยังไม่ได้เริ่มเล่น
      if (videoRef.current && videoRef.current.paused === false) {
        return; // ถ้าวิดีโอกำลังเล่นอยู่แล้ว ไม่เริ่มใหม่
      }

      codeReader.current = new BrowserMultiFormatReader();
      const devices = await codeReader.current.listVideoInputDevices();

      const rearCamera = devices.find((device) =>
        device.label.toLowerCase().includes("back") ||
        device.label.toLowerCase().includes("rear")
      );
      const deviceId = rearCamera?.deviceId || devices[0]?.deviceId;

      if (!deviceId) throw new Error("ไม่พบอุปกรณ์กล้อง");
      if (!videoRef.current) throw new Error("Video element not ready");

      await codeReader.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            stopScanner();
            onScanComplete(result.getText());
          }
          if (err && !(err instanceof Exception)) {
            console.error("Error during scanning:", err);
            setError("เกิดข้อผิดพลาดในการสแกน");
          }
        }
      );
    } catch (e) {
      console.error("Scanner initialization error:", e);
      setError(e.message || "เกิดข้อผิดพลาดในการเริ่มต้นสแกนเนอร์");
      setScanning(false);
      codeReader.current = null;
    }
  };

  const stopScanner = () => {
    try {
      if (codeReader.current) {
        codeReader.current.reset();
        codeReader.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.error("Error stopping scanner:", e);
    } finally {
      setScanning(false);
    }
  };

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      stopScanner();
      onManualInput(manualCode.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open transition-all duration-300 ease-in-out">
      <div className="modal-box max-w-lg bg-white mx-auto transition-all duration-300 ease-in-out">
        <h3 className="font-bold text-lg text-center text-black mb-4">
          สแกน QR Code หรือ Barcode
        </h3>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button className="btn btn-sm btn-primary ml-4" onClick={initializeScanner}>
              ลองอีกครั้ง
            </button>
          </div>
        )}

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">
            กรุณาสแกน QR Code หรือ Barcode ของครุภัณฑ์หรือการยืม
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div
            ref={scannerRef}
            className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-black flex items-center justify-center relative"
            style={{ width: "480px", height: "360px" }}
          >
            <video
              ref={videoRef}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              autoPlay
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-dashed border-[#1E3A8A] rounded-lg pointer-events-none"></div>
          </div>
        </div>

        <div className="input-group flex items-center gap-2 p-4 rounded-lg shadow-lg bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
          <input
            type="text"
            placeholder="ป้อนรหัสการยืมหรือรหัสครุภัณฑ์..."
            className="input input-bordered w-full text-white bg-opacity-90 bg-gray-800 placeholder-gray-300 py-2 px-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
          />
          <button
            className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out disabled:opacity-50"
            onClick={handleManualSearch}
            disabled={!manualCode.trim()}
          >
            ค้นหา
          </button>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={() => {
              stopScanner();
              onClose();
            }}
          >
            ยกเลิก
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-opacity-30 backdrop-blur-sm transition-all duration-500 ease-in-out"
        onClick={() => {
          stopScanner();
          onClose();
        }}
      ></div>
    </div>
  );
};

export default ScannerDialog;
