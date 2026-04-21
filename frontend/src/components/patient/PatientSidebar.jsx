import React from 'react';
import { 
    LayoutDashboard, Calendar, FileStack, 
    CreditCard, Store, LogOut, AlertTriangle, Stethoscope
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const PatientSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItemClass = (path) => `flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-medium transition-colors ${
        isActive(path)
            ? 'bg-[#f0f4ff] text-blue-700 font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between fixed h-full shadow-sm z-20">
            <div>
                {/* Logo Section */}
                <div className="p-6 flex items-center gap-3 border-b border-white">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Behealthy</span>
                </div>

                {/* Navigation Section */}
                <nav className="px-4 py-8 space-y-2">
                    <button onClick={() => navigate('/dashboard')} className={navItemClass('/dashboard')}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/specializations')} className={navItemClass('/specializations')}>
                        <Stethoscope size={20} />
                        Specializations
                    </button>
                    <button onClick={() => navigate('/book-appointment')} className={navItemClass('/book-appointment')}>
                        <Calendar size={20} />
                        Book Appointment
                    </button>
                    <button onClick={() => navigate('/appointments')} className={navItemClass('/appointments')}>
                        <Calendar size={20} />
                        Appointments
                    </button>
                    <button onClick={() => navigate('/prescriptions')} className={navItemClass('/prescriptions')}>
                        <FileStack size={20} />
                        Prescriptions
                    </button>
                    <button onClick={() => navigate('/billing')} className={navItemClass('/billing')}>
                        <CreditCard size={20} />
                        Billing
                    </button>
                    <button onClick={() => navigate('/pharmacy')} className={navItemClass('/pharmacy')}>
                        <Store size={20} />
                        Pharmacy
                    </button>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-4 space-y-3 pb-8">
                {/* Emergency Button */}
                <button 
                    className="w-full bg-[#db2736] hover:bg-red-700 text-white font-extrabold py-4 px-4 rounded-2xl shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 transition-colors tracking-wide text-[14px]"
                    onClick={() => window.confirm('Calling emergency services...') && window.location.assign('tel:1990')}
                >
                    <AlertTriangle size={20} className="text-white" strokeWidth={2.5} />
                    EMERGENCY
                </button>

                {/* Logout Button */}
                <div className="px-2 pt-2">
                    <div className="border-t border-gray-100 mb-3"></div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-bold transition-colors text-red-500 hover:bg-red-50 text-[14px]"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default PatientSidebar;
