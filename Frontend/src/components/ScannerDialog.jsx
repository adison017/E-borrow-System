import { useRef, useEffect, useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import Quagga from 'quagga';

const ScannerDialog = ({ isOpen, onClose, onScanComplete, onManualInput }) => {
  const scannerRef = useRef(null);
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const quaggaInitialized = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    if (isOpen && scannerRef.current && !quaggaInitialized.current) {
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
      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 480,
            height: 360,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader"
          ],
        },
        locate: true,
      }, (err) => {
        if (err) {
          console.error("Failed to initialize scanner:", err);
          setError("ไม่สามารถเริ่มต้นสแกนเนอร์ได้ กรุณาตรวจสอบการอนุญาตใช้กล้อง");
          setScanning(false);
          quaggaInitialized.current = false;
          return;
        }
        quaggaInitialized.current = true;
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result?.codeResult?.code) {
          const code = result.codeResult.code;
          stopScanner();
          onScanComplete(code);
        }
      });
    } catch (e) {
      console.error("Scanner initialization error:", e);
      setError("เกิดข้อผิดพลาดในการเริ่มต้นสแกนเนอร์");
      setScanning(false);
      quaggaInitialized.current = false;
    }
  };

  const stopScanner = () => {
    try {
      if (quaggaInitialized.current) {
        Quagga.offDetected();
        Quagga.stop();
      }
    } catch (e) {
      console.error("Error stopping scanner:", e);
    } finally {
      quaggaInitialized.current = false;
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
        <h3 className="font-bold text-lg text-center text-black mb-4">สแกน QR Code หรือ Barcode</h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">กรุณาสแกน QR Code หรือ Barcode ของครุภัณฑ์หรือการยืม</p>
        </div>

        <div className="flex justify-center mb-4">
          <div
            ref={scannerRef}
            className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-black"
            style={{ width: "480px", height: "360px" }}
          >
            {!scanning && (
              <div className="h-full flex flex-col items-center justify-center">
                <CameraIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-400">กำลังเริ่มกล้อง...</p>
                {error && (
                  <button 
                    className="btn btn-sm btn-primary mt-4"
                    onClick={initializeScanner}
                  >
                    ลองอีกครั้ง
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="input-group flex items-center gap-2 p-4 rounded-lg shadow-lg bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
          <input
            type="text"
            placeholder="ป้อนรหัสการยืมหรือรหัสครุภัณฑ์..."
            className="input input-bordered w-full text-white bg-opacity-90 bg-gray-800 placeholder-gray-300 py-2 px-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
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