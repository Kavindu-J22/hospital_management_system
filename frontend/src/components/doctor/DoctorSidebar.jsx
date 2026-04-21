import React from 'react';
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, PlusSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItemClass = (path) => `flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-bold transition-colors text-[14px] ${isActive(path)
        ? 'bg-[#0c3812] text-white'
        : 'text-gray-500 hover:bg-gray-100'
        }`;

    const iconClass = (path) => isActive(path) ? 'text-white' : 'text-gray-400';

    return (
        <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 shadow-[4px_0_15px_rgba(0,0,0,0.02)]">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => navigate('/doctor/dashboard')}>
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                        <PlusSquare size={18} />
                    </div>
                    <div>
                        <h2 className="text-[17px] font-extrabold text-[#0f172a] uppercase tracking-wide leading-tight">Hospital HMS</h2>
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest leading-tight">Doctor Portal</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-2">
                <div className="border-t border-gray-100"></div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                <button onClick={() => navigate('/doctor/dashboard')} className={navItemClass('/doctor/dashboard')}>
                    <LayoutDashboard size={20} className={iconClass('/doctor/dashboard')} /> Dashboard
                </button>
                <button onClick={() => navigate('/doctor/sessions')} className={navItemClass('/doctor/sessions')}>
                    <Calendar size={20} className={iconClass('/doctor/sessions')} /> My Sessions
                </button>
                <button className={navItemClass('/doctor/patients')}>
                    <Users size={20} className={iconClass('/doctor/patients')} /> Patients
                </button>
                <button onClick={() => navigate('/doctor/prescriptions')} className={navItemClass('/doctor/prescriptions')}>
                    <FileText size={20} className={iconClass('/doctor/prescriptions')} /> Prescription
                </button>
            </nav>

            <div className="p-4 space-y-1 mb-4">
                <div className="px-2 pb-4">
                    <div className="border-t border-gray-100"></div>
                </div>
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-bold transition-colors text-gray-500 hover:bg-gray-100 text-[14px]">
                    <Settings size={20} /> Settings
                </button>
                <button 
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/doctor');
                    }} 
                    className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-bold transition-colors text-red-500 hover:bg-red-50 text-[14px]"
                >
                    <LogOut size={20} /> Log Out
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;
