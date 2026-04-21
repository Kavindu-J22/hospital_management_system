import React, { useEffect, useState } from 'react';
import {
    Bell, Plus, User, Calendar, TrendingUp, History, Activity, Clock, Bed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { sessionAPI, appointmentAPI } from '../../services/api';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [mySessions, setMySessions] = useState([]);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [sessionStats, setSessionStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const [upRes, compRes, statsRes] = await Promise.all([
                    sessionAPI.getByDoctor(user.id, { status: 'Upcoming' }),
                    sessionAPI.getByDoctor(user.id, { status: 'Completed' }),
                    sessionAPI.getStats(),
                ]);
                setMySessions(upRes.data.data || []);
                setCompletedSessions(compRes.data.data || []);
                setSessionStats(statsRes.data.data || {});
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7fb] font-sans flex">

            {/* Sidebar */}
            <DoctorSidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">

                {/* Topbar */}
                <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <Activity className="text-gray-400" size={24} />
                        <h2 className="text-[16px] font-bold text-[#0f172a]">Welcome, {user?.fullName || 'Doctor'}</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors relative"><Bell size={20} /></button>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-[14px] font-bold text-[#0f172a] leading-tight group-hover:text-blue-600 transition-colors">{user?.fullName}</p>
                                <p className="text-[11px] text-gray-400 font-semibold tracking-wide">{user?.specialization}</p>
                            </div>
                            <div className="w-10 h-10 bg-teal-50 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName}&backgroundColor=bbf7d0`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 max-w-[1300px] w-full mx-auto flex-1 flex flex-col">

                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-[28px] font-black text-[#0f172a] mb-1 tracking-tight">Dashboard Overview</h1>
                            <p className="text-gray-500 font-medium text-[15px]">Here is what's happening with your practice today.</p>
                        </div>
                        <button onClick={() => navigate('/doctor/new-session')} className="bg-[#0c3812] hover:bg-[#1a4a22] text-white px-6 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm text-[14px]">
                            <Plus size={18} /> Create New Session
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Session History (this week) */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl"><History size={20} /></div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Recent Consultations</p>
                                <h3 className="text-[32px] font-black text-[#0f172a] leading-none tracking-tight">{loading ? '—' : completedSessions.length}</h3>
                            </div>
                        </div>
                        {/* Total Patients */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                                    <User size={20} />
                                </div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Total Patients</p>
                                <h3 className="text-[32px] font-black text-[#0f172a] leading-none tracking-tight">{loading ? '—' : [...mySessions, ...completedSessions].reduce((a, s) => a + (s.currentPatients || 0), 0)}</h3>
                            </div>
                        </div>
                        {/* Upcoming Sessions */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl"><Calendar size={20} /></div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Upcoming Sessions</p>
                                <h3 className="text-[32px] font-black text-[#0f172a] leading-none tracking-tight">{loading ? '—' : mySessions.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                        {/* Upcoming Session List */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-[18px] font-black mb-8 flex items-center gap-2.5">
                                <Calendar size={20} className="text-blue-600" /> Next Sessions
                            </h2>
                            <div className="space-y-6">
                                {!loading && mySessions.length === 0 && <p className="text-gray-400 font-medium italic py-10 text-center">No upcoming sessions scheduled.</p>}
                                {mySessions.slice(0, 3).map((session, idx) => (
                                    <div key={idx} className="flex gap-6 items-start group">
                                        <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-20 shrink-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5 leading-none">{new Date(session.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                                            <p className="text-[20px] font-black text-[#0f172a] leading-none">{new Date(session.date).getDate()}</p>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-extrabold text-[#0f172a] text-[15px] mb-1">{session.specialization || 'Clinical'} Session</h4>
                                            <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 uppercase tracking-wide">
                                                <span className="flex items-center gap-1.5"><Clock size={13} className="text-blue-600" /> {session.startTime}</span>
                                                <span className="flex items-center gap-1.5"><Bed size={13} className="text-blue-600" /> {session.roomNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* History & Records */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-[18px] font-black mb-8 flex items-center gap-2.5">
                                <History size={20} className="text-blue-600" /> History & Records
                            </h2>
                            <div className="space-y-6">
                                {!loading && completedSessions.length === 0 && <p className="text-gray-400 font-medium italic py-10 text-center">No session history records found.</p>}
                                {completedSessions.slice(0, 3).map((session, idx) => (
                                    <div key={idx} className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                            <Activity size={20} className="text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-extrabold text-[#0f172a] text-[15px] mb-0.5">{session.specialization || 'Clinical'} Summary</h4>
                                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">{new Date(session.date).toLocaleDateString()} • {session.currentPatients || 0} Patients</p>
                                        </div>
                                        <span className="text-green-600 font-bold text-[12px] uppercase">Completed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer embedded in Doctor Portal */}
                    <div className="mt-16 border-t border-gray-200 pt-8 pb-4 flex flex-col md:flex-row justify-between text-sm text-gray-500 max-w-[1300px]">
                        <div className="space-y-3 mb-6 md:mb-0">
                            <h3 className="text-[20px] font-bold text-[#0f172a]">Contact us</h3>
                            <div className="space-y-4 pt-2">
                                <p className="font-medium"><span className="w-24 inline-block">Email</span> info@behealthy.com</p>
                                <p className="font-medium"><span className="w-24 inline-block">Number</span> +94 11 029 4203</p>
                                <p className="font-medium"><span className="w-24 inline-block">Fax</span> 123456657768</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end mt-12 md:mt-0 pt-8 w-full md:w-auto">
                            <span className="font-extrabold text-[#0f172a] text-2xl mb-1 tracking-tight">#Behealthy</span>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default DoctorDashboard;
