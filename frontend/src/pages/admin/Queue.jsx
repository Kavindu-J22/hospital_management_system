import React, { useState, useEffect } from 'react';
import {
    Bell, Settings, PlusSquare, Info,
    HeartPulse, Stethoscope, Microscope, Beaker, Zap, BrainCircuit, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { appointmentAPI } from '../../services/api';

const Queue = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Departments');
    const [liveQueues, setLiveQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchQueues = async () => {
        try {
            const res = await appointmentAPI.getQueue();
            setLiveQueues(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { fetchQueues(); }, []);
    const handleRefresh = () => { setRefreshing(true); fetchQueues(); };

    // Keep mock rooms for display context alongside live queues
    const rooms = [
        {
            room: 'ROOM 104',
            department: 'Pediatrics',
            doctor: 'Dr. Sarah Johnson',
            ticket: 'P-042',
            waitList: '5 people',
            status: 'Active',
            statusColor: 'text-green-600',
            bg: 'bg-green-50',
            icon: <HeartPulse className="text-blue-500" size={20} />
        },
        {
            room: 'ROOM 205',
            department: 'General Medicine',
            doctor: 'Dr. Michael Chen',
            ticket: 'G-189',
            waitList: '12 people',
            status: 'Active',
            statusColor: 'text-green-600',
            bg: 'bg-green-50',
            icon: <Stethoscope className="text-blue-500" size={20} />
        },
        {
            room: 'ROOM 302',
            department: 'Cardiology',
            doctor: 'Dr. Elena Rodriguez',
            ticket: 'C-021',
            waitList: '3 people',
            status: 'Active',
            statusColor: 'text-green-600',
            bg: 'bg-green-50',
            icon: <Zap className="text-blue-500" size={20} />
        },
        {
            room: 'ROOM 108',
            department: 'ENT',
            doctor: 'Main Lab',
            ticket: 'E-112',
            waitList: '8 people',
            status: 'Active',
            statusColor: 'text-green-600',
            bg: 'bg-green-50',
            icon: <Microscope className="text-blue-500" size={20} />
        },
        {
            room: 'ROOM 202',
            department: 'Radiology',
            doctor: 'Emergency Shift',
            statusOnly: true,
            statusText: 'On Break',
            waitList: 'Resume: 11:00 AM',
            status: 'Idle',
            statusColor: 'text-gray-500',
            bg: 'bg-gray-100',
            icon: <Beaker className="text-blue-500" size={20} />
        },
        {
            room: 'ROOM 401',
            department: 'Mental Health',
            doctor: 'Main Counter',
            ticket: 'MH-902',
            waitList: '21 people',
            status: 'Active',
            statusColor: 'text-green-600',
            bg: 'bg-green-50',
            icon: <BrainCircuit className="text-blue-500" size={20} />
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fc] font-sans flex">
            <AdminSidebar />
            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="bg-white px-8 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-sm shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                        <div className="bg-blue-600 text-white p-1 rounded-md">
                            <PlusSquare size={16} />
                        </div>
                        <span className="text-[17px] font-extrabold text-[#0f172a] uppercase tracking-wide">HealthGate Queue</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Live Connection Active</span>
                        </div>

                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200">
                            <Bell size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200">
                            <Settings size={18} />
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-orange-100 cursor-pointer">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=ffedd5" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-[1100px] mx-auto p-8 lg:p-12 flex flex-col gap-8 pb-32">

                    {/* Header Area */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-blue-600 font-extrabold text-[11px] tracking-widest uppercase mb-1">Main Waiting Area</p>
                            <h1 className="text-5xl font-black text-[#0f172a] tracking-tight">Now Serving</h1>
                        </div>
                        <div className="text-right text-sm text-gray-500 font-medium">
                            <p>Last updated: <span className="text-gray-900 font-bold">Just now</span></p>
                            <p>Tuesday, Oct 24 • 10:45 AM</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Waiting</p>
                            <h3 className="text-4xl font-black text-blue-600 tracking-tight">
                                {loading ? '—' : liveQueues.reduce((sum, q) => sum + (q.appointments?.length || 0), 0)}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Sessions</p>
                            <h3 className="text-4xl font-black text-[#0f172a] tracking-tight">{loading ? '—' : liveQueues.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmed</p>
                            <h3 className="text-4xl font-black text-[#0f172a] tracking-tight">
                                {loading ? '—' : liveQueues.reduce((sum, q) => sum + (q.appointments?.filter(a => a.attendanceConfirmed).length || 0), 0)}
                            </h3>
                        </div>
                        <div className="bg-[#0a2540] p-6 rounded-2xl border border-[#0a2540] shadow-xl shadow-[#0a2540]/20 flex flex-col justify-center text-white">
                            <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">Live Queue</p>
                            <h3 className="text-4xl font-black tracking-tight flex items-baseline gap-2">
                                {loading ? '—' : liveQueues.length} <span className="text-lg font-bold text-blue-300">sessions</span>
                            </h3>
                        </div>
                    </div>

                    {/* Live Queue from DB */}
                    {liveQueues.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                            Live Queue — Real-time
                            <button onClick={handleRefresh} className="ml-auto text-gray-400 hover:text-gray-700 p-1 rounded-lg"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /></button>
                        </h2>
                        {liveQueues.map((q) => (
                            <div key={q.session?._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-[#0f172a]">{q.session?.doctorName} <span className="text-gray-400 font-medium text-sm">— {q.session?.specialization}</span></h3>
                                        <p className="text-xs text-gray-500">Room {q.session?.roomNumber} • {q.session?.startTime}–{q.session?.endTime}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${q.session?.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{q.session?.status}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {q.appointments?.map((appt, i) => (
                                        <div key={appt._id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm">
                                            <span className="font-bold text-blue-600">#{i + 1}</span>
                                            <span className="font-medium text-[#0f172a]">{appt.patientName}</span>
                                            <span className="text-xs text-gray-400">#{appt.ticketNumber}</span>
                                            {appt.attendanceConfirmed && <span className="text-green-600 text-xs font-bold">✓</span>}
                                        </div>
                                    ))}
                                    {q.appointments?.length === 0 && <p className="text-gray-400 text-sm">No patients in queue yet</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    )}

                    {/* Tabs */}
                    <div className="flex items-center gap-8 border-b border-gray-200 mt-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
                        {['All Departments', 'Pediatrics', 'General Medicine', 'Cardiology', 'Dermatology'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 text-[14px] font-bold border-b-2 uppercase tracking-wide transition-colors ${activeTab === tab
                                    ? 'border-blue-600 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 border border-teal-100">
                                                {room.room}
                                            </span>
                                            <h3 className="text-[19px] font-extrabold text-[#0f172a] leading-tight mb-0.5">{room.department}</h3>
                                            <p className="text-xs font-medium text-gray-500">{room.doctor}</p>
                                        </div>
                                        <div className="bg-blue-50 p-2 rounded-full hidden sm:block">
                                            {room.icon}
                                        </div>
                                    </div>

                                    <div className="bg-[#f0f4f8] rounded-xl p-6 text-center mt-6 border border-gray-100">
                                        {room.statusOnly ? (
                                            <>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
                                                <h2 className="text-3xl font-black text-gray-400 tracking-tight">{room.statusText}</h2>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Ticket</p>
                                                <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">{room.ticket}</h2>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 p-4 px-5 flex items-center justify-between text-sm bg-gray-50/50">
                                    <span className="text-gray-600 font-medium">
                                        {room.statusOnly ? room.waitList : `Wait list: ${room.waitList}`}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${room.bg} ${room.statusColor}`}>
                                        {room.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Patient Information Box */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-8 max-w-4xl">
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-[15px] mb-6">
                            <Info size={18} />
                            Patient Information
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded bg-[#e8f0fe] text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">1</div>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Please watch the screen for your ticket number.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded bg-[#e8f0fe] text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">3</div>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    If you miss your turn, please approach the reception desk to be re-added to the queue.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded bg-[#e8f0fe] text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">2</div>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Proceed to the indicated room number immediately after your number appears on the dashboard.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded bg-[#e8f0fe] text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">4</div>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Emergency cases may be prioritized. We appreciate your patience and cooperation.
                                </p>
                            </div>
                        </div>
                    </div>

                </main>

                {/* Global Footer */}
                <footer className="mt-auto bg-white border-t border-gray-200 py-6 px-12 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <PlusSquare size={16} className="text-blue-600" />
                        <span className="text-gray-900 font-bold uppercase tracking-wider">Behealthy Systems v2.4.0</span>
                    </div>

                    <div className="flex gap-8 text-gray-500 mb-4 md:mb-0">
                        <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Accessibility</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Report Issue</a>
                    </div>

                    <div>
                        © 2026 Medical Management Inc.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Queue;
