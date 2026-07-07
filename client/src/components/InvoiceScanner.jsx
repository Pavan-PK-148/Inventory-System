import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';

const InvoiceScanner = ({ onExtractionComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFileName(selectedFile.name);
    
    const formData = new FormData();
    formData.append('invoice', selectedFile);

    setScanning(true);
    try {
      const { data } = await API.post('/ocr/scan-invoice', formData);
      if (data.success) {
        toast.success("Groq AI Invoice extraction pass succeeded!");
        onExtractionComplete(data.payload);
      }
    } catch (err) {
      toast.error("Cloud invoice parsing intelligence failed.");
      setFileName('');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:bg-slate-50">
      <input type="file" id="invoice-file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} disabled={scanning} />
      <label htmlFor="invoice-file" className="cursor-pointer flex flex-col items-center justify-center gap-2">
        {scanning ? (
          <>
            <Loader2 size={32} className="text-emerald-600 animate-spin" />
            <p className="text-xs font-black text-slate-700">Groq AI Reading & Instantiating Ledger Data...</p>
          </>
        ) : fileName ? (
          <>
            <CheckCircle2 size={32} className="text-emerald-500" />
            <p className="text-xs font-black text-slate-700">{fileName} Extracted</p>
          </>
        ) : (
          <>
            <UploadCloud size={32} className="text-slate-400" />
            <p className="text-xs font-black text-slate-700">Scan Invoice via Groq AI Lens</p>
            <p className="text-[10px] font-semibold text-slate-400">Upload product bill or supplier sheet asset</p>
          </>
        )}
      </label>
    </div>
  );
};

export default InvoiceScanner;