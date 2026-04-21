import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const isSuccess = type === 'success';
    return (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold transition-all animate-slide-up
            ${isSuccess ? 'bg-white border-green-100 text-[#0f172a]' : 'bg-white border-red-100 text-[#0f172a]'}`}>
            <div className={`p-2 rounded-xl ${isSuccess ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <span>{message}</span>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors ml-2">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
