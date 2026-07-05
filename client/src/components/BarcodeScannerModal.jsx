import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Initialize scanner logic attached instantly to local canvas window wrapper
    const scanner = new Html5QrcodeScanner("scanner-frame-view", {
      fps: 10,
      qrbox: { width: 260, height: 160 }, // optimized rectangle dimensions for reading standard barcodes
      rememberLastUsedCamera: true
    });

    const handleScanResult = (decodedText) => {
      onScanSuccess(decodedText);
      scanner.clear();
      onClose();
    };

    scanner.render(handleScanResult, (err) => {
      // Non-blocking background log captures for stream framing noise
    });

    return () => {
      scanner.clear().catch(error => console.warn("Scanner shutdown cleanup safe exception", error));
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-900">Live Hardware Barcode Engine</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16}/></button>
        </div>
        {/* Mount point frame handler injected by html5-qrcode dynamically */}
        <div id="scanner-frame-view" className="w-full rounded-xl overflow-hidden text-xs bg-slate-50 border border-slate-100" />
      </div>
    </div>
  );
};

export default BarcodeScannerModal;