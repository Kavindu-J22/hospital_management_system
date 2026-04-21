import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, User, Search, Star, Calendar,
    HeartPulse, Baby, Bone, Brain, Droplets, Eye,
    Users, CalendarPlus, ShieldPlus
} from 'lucide-react';

const ScheduleAppointment = () => {
    const navigate = useNavigate();

    const specializations = [
        {
            title: 'Cardiology',
            desc: 'Heart health, hypertension, and cardiovascular diseases.',
            available: '12 Specialists Available',
            status: 'AVAILABLE TODAY',
            statusStyle: 'bg-green-50 text-green-600',
            icon: <HeartPulse size={24} className="text-red-500" />,
            iconBg: 'bg-red-50'
        },
        {
            title: 'Pediatrics',
            desc: 'Medical care for infants, children, and adolescents.',
            available: '8 Specialists Available',
            status: 'TOMORROW: 09:00 AM',
            statusStyle: 'bg-gray-100 text-gray-600',
            icon: <Baby size={22} className="text-blue-500" />,
            iconBg: 'bg-blue-50'
        },
        {
            title: 'Orthopedics',
            desc: 'Treatment of the musculoskeletal system and injuries.',
            available: '15 Specialists Available',
            status: 'AVAILABLE TODAY',
            statusStyle: 'bg-green-50 text-green-600',
            icon: <Bone size={22} className="text-orange-500" />,
            iconBg: 'bg-orange-50'
        },
        {
            title: 'Neurology',
            desc: 'Disorders of the nervous system and brain functions.',
            available: '6 Specialists Available',
            status: 'NEXT: WED, OCT 25',
            statusStyle: 'bg-orange-50 text-orange-600',
            icon: <Brain size={22} className="text-purple-500" />,
            iconBg: 'bg-purple-50'
        },
        {
            title: 'Dermatology',
            desc: 'Diagnosis and treatment of skin, hair, and nail disorders.',
            available: '9 Specialists Available',
            status: 'AVAILABLE TODAY',
            statusStyle: 'bg-green-50 text-green-600',
            icon: <Droplets size={22} className="text-pink-500" />,
            iconBg: 'bg-pink-50'
        },
        {
            title: 'ENT',
            desc: 'Comprehensive eye care and vision correction surgeries.',
            available: '11 Specialists Available',
            status: 'NEXT: TODAY 4:00 PM',
            statusStyle: 'bg-gray-100 text-gray-600',
            icon: <Eye size={22} className="text-teal-500" />,
            iconBg: 'bg-teal-50'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans relative flex flex-col items-center">

            {/* Topbar */}
            <header className="bg-white w-full px-8 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                    <div className="bg-red-50 text-red-500 p-1.5 rounded-md">
                        <ShieldPlus size={20} />
                    </div>
                    <span className="text-[18px] font-bold text-[#0f172a]">Behealthy Portal</span>
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                    <button className="p-2.5 hover:text-gray-600 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200 transition-colors">
                        <Bell size={18} />
                    </button>
                    <button className="p-2.5 hover:text-gray-600 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200 transition-colors">
                        <User size={18} />
                    </button>
                </div>
            </header>

            {/* Emergency Button */}
            <div className="fixed right-0 top-32 z-30">
                <button className="bg-[#ff1e1e] hover:bg-red-700 text-white shadow-lg transition-colors flex items-center gap-3 px-4 py-3 rounded-l-xl font-bold text-sm">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="m4.9 4.9 14.2 14.2" /><path d="m4.9 19.1 14.2-14.2" /></svg>
                    <div className="text-left leading-tight">
                        <div className="text-[10px] font-semibold opacity-90 tracking-wide">EMERGENCY</div>
                        <div>AMBULANCE</div>
                    </div>
                </button>
            </div>

            {/* Main Content */}
            <main className="w-full max-w-[1000px] px-6 py-10 relative">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tight">Medical Specializations</h1>
                    <p className="text-gray-500 font-medium text-[15px]">Find and book appointments with our world-class specialists</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search specializations (e.g. Cardiology, Skin...)"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto h-full">
                        <button className="bg-[#0a2540] text-white px-8 py-3.5 rounded-xl font-semibold shadow-sm text-sm hover:bg-[#1e293b] transition-colors h-full">
                            All
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold shadow-sm flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors h-full">
                            <Star size={16} className="text-gray-400" /> Top Rated
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold shadow-sm flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors h-full">
                            <Calendar size={16} className="text-gray-400" /> Available Today
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {specializations.map((spec, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">

                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${spec.iconBg}`}>
                                    {spec.icon}
                                </div>
                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase ${spec.statusStyle}`}>
                                    {spec.status}
                                </span>
                            </div>

                            <h3 className="text-[19px] font-extrabold text-[#0f172a] mb-2">{spec.title}</h3>
                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6 flex-1">
                                {spec.desc}
                            </p>

                            <div className="flex items-center gap-2 text-gray-600 font-bold text-xs mb-6">
                                <Users size={14} /> {spec.available}
                            </div>

                            <button className="w-full bg-[#f8f9fc] hover:bg-[#f1f4f9] text-[#0f172a] font-bold text-sm py-3.5 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 border border-gray-100">
                                Book an appointment <CalendarPlus size={16} className="text-gray-400" />
                            </button>

                        </div>
                    ))}
                </div>


            </main>
        </div>
    );
};

export default ScheduleAppointment;
