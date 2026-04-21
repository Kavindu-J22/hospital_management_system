import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, Plus, Calendar, Clock,
    MoreVertical, Edit2, Trash2, ExternalLink,
    TrendingUp, Activity, HelpCircle, User, ChevronRight
} from 'lucide-react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';

const DoctorSessions = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Sessions Today', value: '12', trend: '+5% today', trendStyle: 'text-green-600 bg-green-50', icon: <Calendar size={20} className="text-blue-600" /> },
        { label: 'Weekly Sessions', value: '58', trend: '-2% vs last week', trendStyle: 'text-red-600 bg-red-50', icon: <Calendar size={20} className="text-blue-600" /> },
        { label: 'Active Sessions', value: '3', trend: 'Real-time', trendStyle: 'text-blue-600 bg-blue-50', icon: <Activity size={20} className="text-blue-600" /> },
    ];

    const upcomingSessions = [
        { date: 'Oct 24, 2023', time: '09:00 AM - 10:30 AM', room: 'Room 302', capacity: '12 Patients', status: 'Upcoming' },
        { date: 'Oct 24, 2023', time: '11:00 AM - 12:30 PM', room: 'Room 105', capacity: '8 Patients', status: 'Upcoming' },
        { date: 'Oct 25, 2023', time: '02:00 PM - 04:00 PM', room: 'Virtual (A)', capacity: '15 Patients', status: 'Upcoming' },
    ];

    const history = [
        { title: 'General Medical Consultation', date: 'Oct 22', time: '10:00 AM - 11:30 AM', room: 'Room 204', patients: '10 Patients', status: 'Completed', statusColor: 'text-green-600' },
        { title: 'Pediatric Follow-up Session', date: 'Oct 21', time: '02:00 PM - 03:30 PM', room: 'Virtual', patients: '6 Patients', status: '2 reports pending', statusColor: 'text-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-[#f4f7fb] font-sans flex text-[#0f172a]">

            <DoctorSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen overflow-hidden">

                {/* Header */}
                <header className="bg-white px-8 py-3.5 flex items-center justify-between border-b border-gray-100 z-10 sticky top-0 bg-white/80 backdrop-blur-md">
                    <div className="flex-1 flex items-center relative max-w-xl">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search sessions, patients, or records..."
                            className="w-full bg-[#f8f9fa] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <HelpCircle size={20} />
                            </button>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-500">Monday, Oct 23</span>
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto w-full max-w-[1300px] mx-auto">

                    <div className="mb-8">
                        <h1 className="text-[28px] font-black tracking-tight mb-1">Dashboard Overview</h1>
                        <p className="text-gray-500 font-medium">Welcome back, Dr. Jenkins. Here is what's happening today.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50/50 p-2.5 rounded-xl">
                                        {s.icon}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${s.trendStyle}`}>
                                        {s.trend}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[13px] font-bold mb-1">{s.label}</p>
                                    <h3 className="text-[36px] font-black leading-none tracking-tight">{s.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Sessions Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-[18px] font-bold tracking-tight">Upcoming Sessions</h2>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search sessions..."
                                        className="w-full bg-[#f8f9fa] border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-50"
                                    />
                                </div>
                                <button
                                    onClick={() => navigate('/doctor/new-session')}
                                    className="bg-[#0a2540] hover:bg-[#1a3a5a] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                                >
                                    <Plus size={16} /> New Session
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/20">
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Time Range</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Room</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Patient Capacity</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingSessions.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-none group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6 text-[13px] font-bold">{row.date}</td>
                                            <td className="py-5 px-6 text-[13px] font-medium text-gray-500">{row.time}</td>
                                            <td className="py-5 px-6">
                                                <span className="bg-[#f0f4f8] text-[#0f172a] px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                    {row.room}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 text-[13px] font-medium text-gray-500">{row.capacity}</td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-end gap-3 text-gray-400">
                                                    <button className="flex items-center gap-1.5 text-blue-600 font-bold text-[12px] hover:underline">
                                                        <Clock size={14} /> Extend
                                                    </button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg group-hover:text-gray-600 transition-colors">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Session History */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-[18px] font-bold tracking-tight">Session History</h2>
                            <button className="text-blue-600 hover:text-blue-800 font-bold text-[13px] flex items-center gap-1.5">
                                View All History <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {history.map((h, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-20 shrink-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5 leading-none">OCT</p>
                                        <p className="text-[20px] font-black text-[#0f172a] leading-none">{h.date.split(' ')[1]}</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-extrabold text-[15px] mb-1">{h.title}</h4>
                                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium text-gray-400">
                                            <span className="flex items-center gap-1.5"><Clock size={13} /> {h.time}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={13} /> {h.room}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 self-center">
                                        <p className="text-[13px] font-bold text-[#0f172a] mb-0.5">{h.patients}</p>
                                        <p className={`text-[11px] font-bold ${h.statusColor} leading-tight`}>{h.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>

                {/* Profile Peek Bottom Left */}
                <div className="p-6 border-t border-gray-100 mt-auto bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-teal-50">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=bbf7d0" alt="Sarah" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold leading-tight">Dr. Sarah Jenkins</p>
                            <p className="text-[11px] font-semibold text-gray-400">Senior Clinician</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorSessions;
