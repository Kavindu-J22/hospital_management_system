import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, Plus, Calendar, Clock,
    MoreVertical, Edit2, Trash2, ExternalLink,
    TrendingUp, Activity, HelpCircle, User, ChevronRight,
    MapPin, X, Check
} from 'lucide-react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { sessionAPI } from '../../services/api';
import Toast from '../../components/shared/Toast';

const DoctorSessions = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState('');
    
    // Extension Modal State
    const [extendingSession, setExtendingSession] = useState(null);
    const [extDuration, setExtDuration] = useState('30');

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const [sessRes, statsRes] = await Promise.all([
                sessionAPI.getByDoctor(user.id, { bookable: 'false' }), // Get all sessions, not just bookable
                sessionAPI.getStats()
            ]);
            setSessions(sessRes.data.data || []);
            setStats(statsRes.data.data || {});
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const upcoming = sessions.filter(s => ['Upcoming', 'Active', 'Extended'].includes(s.status));
    const history = sessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');

    const handleExtend = async () => {
        if (!extendingSession) return;
        try {
            // Calculate new end time
            const baseTime = extendingSession.extendedEndTime || extendingSession.endTime;
            const [h, m_mod] = baseTime.split(':');
            const [m, mod] = m_mod.split(' ');
            let hours = parseInt(h);
            let minutes = parseInt(m);
            if (mod === 'PM' && hours < 12) hours += 12;
            if (mod === 'AM' && hours === 12) hours = 0;
            
            const date = new Date();
            date.setHours(hours, minutes + parseInt(extDuration), 0, 0);
            
            let nh = date.getHours();
            const nm = date.getMinutes().toString().padStart(2, '0');
            const nmod = nh >= 12 ? 'PM' : 'AM';
            if (nh > 12) nh -= 12;
            if (nh === 0) nh = 12;
            const newEndTime = `${nh.toString().padStart(2, '0')}:${nm} ${nmod}`;

            await sessionAPI.extend(extendingSession._id, { 
                minutes: parseInt(extDuration),
                newEndTime
            });
            setToast({ type: 'success', message: `Session extended to ${newEndTime}` });
            setExtendingSession(null);
            fetchData();
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to extend session' });
        }
    };

    const statusBadge = (s) => {
        const styles = {
            'Upcoming': 'bg-blue-50 text-blue-700',
            'Active': 'bg-green-50 text-green-700 border border-green-100 animate-pulse',
            'Extended': 'bg-purple-50 text-purple-700 border border-purple-100',
            'Completed': 'bg-gray-50 text-gray-500',
            'Cancelled': 'bg-red-50 text-red-700'
        };
        return <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[s] || 'bg-gray-100'}`}>{s}</span>;
    };

    return (
        <div className="min-h-screen bg-[#f4f7fb] font-sans flex text-[#0f172a]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
                            <span className="text-sm font-bold text-gray-500">
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto w-full max-w-[1300px] mx-auto">

                    <div className="mb-8">
                        <h1 className="text-[28px] font-black tracking-tight mb-1">Dashboard Overview</h1>
                        <p className="text-gray-500 font-medium">Welcome back, Dr. Jenkins. Here is what's happening today.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-[#0f172a]">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50/50 p-2.5 rounded-xl"><Calendar size={20} className="text-blue-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Total Sessions Today</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{stats.todayTotal || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50/50 p-2.5 rounded-xl"><Calendar size={20} className="text-blue-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Upcoming Sessions</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{upcoming.length}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50/50 p-2.5 rounded-xl"><Activity size={20} className="text-blue-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Active Sessions</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{stats.active || 0}</h3>
                            </div>
                        </div>
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
                                        placeholder="Search by Room..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
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
                                    {loading && <tr><td colSpan={5} className="py-10 text-center text-gray-400 font-medium italic">Loading your sessions...</td></tr>}
                                    {!loading && upcoming.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-400 font-medium italic">No active or upcoming sessions found.</td></tr>}
                                    {upcoming.filter(s => !search || s.roomNumber.toLowerCase().includes(search.toLowerCase())).map((session, idx) => (
                                        <tr key={session._id} className="border-b border-gray-50 last:border-none group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6 text-[13px] font-bold">{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                            <td className="py-5 px-6 text-[13px] font-medium text-gray-500">
                                                {session.startTime} - {session.extendedEndTime || session.endTime}
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="bg-[#f0f4f8] text-[#0f172a] px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                    {session.roomNumber}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 text-[13px] font-medium text-gray-500">{session.currentPatients || 0} / {session.maxPatients} Patients</td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-end gap-3 text-gray-400">
                                                    <div className="mr-2">{statusBadge(session.status)}</div>
                                                    {(session.status === 'Active' || session.status === 'Extended') && (
                                                        <button 
                                                            onClick={() => setExtendingSession(session)}
                                                            className="flex items-center gap-1.5 text-blue-600 font-bold text-[12px] hover:underline"
                                                        >
                                                            <Clock size={14} /> Extend
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg group-hover:text-gray-600 transition-colors">
                                                        <Edit2 size={16} />
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
                            {history.slice(0, 5).map((h, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-20 shrink-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5 leading-none">{new Date(h.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                                        <p className="text-[20px] font-black text-[#0f172a] leading-none">{new Date(h.date).getDate()}</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start text-[#0f172a]">
                                            <h4 className="font-extrabold text-[15px] mb-1">{h.specialization} Consulting</h4>
                                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium text-gray-400">
                                            <span className="flex items-center gap-1.5"><Clock size={13} /> {h.startTime} - {h.extendedEndTime || h.endTime}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={13} /> Room {h.roomNumber}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 self-center">
                                        <p className="text-[13px] font-bold text-[#0f172a] mb-0.5">{h.currentPatients || 0} Patients</p>
                                        <p className={`text-[11px] font-bold ${h.status === 'Completed' ? 'text-green-600' : 'text-red-500'} leading-tight lowercase`}>{h.status}</p>
                                    </div>
                                </div>
                            ))}
                            {!loading && history.length === 0 && <p className="text-center text-gray-400 font-medium py-4 italic">No session history found.</p>}
                        </div>
                    </div>

                </main>

                {/* Profile Peek Bottom Left */}
                <div className="p-6 border-t border-gray-100 mt-auto bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-teal-50">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName || 'Sarah'}&backgroundColor=bbf7d0`} alt="Profile" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold leading-tight">{user?.fullName || 'Dr. Sarah Jenkins'}</p>
                            <p className="text-[11px] font-semibold text-gray-400">{user?.specialization || 'Senior Clinician'}</p>
                        </div>
                    </div>
                </div>

                {/* Extension Modal */}
                {extendingSession && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black tracking-tight text-[#0f172a]">Extend Session Time</h3>
                                    <button onClick={() => setExtendingSession(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">Current Session</p>
                                    <p className="text-sm font-bold text-[#0f172a]">{extendingSession.roomNumber} • {extendingSession.startTime} - {extendingSession.extendedEndTime || extendingSession.endTime}</p>
                                </div>

                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Extension Duration</label>
                                <div className="grid grid-cols-3 gap-3 mb-10">
                                    {['15', '30', '60'].map(min => (
                                        <button 
                                            key={min} 
                                            onClick={() => setExtDuration(min)}
                                            className={`py-4 rounded-2xl font-black text-[15px] border transition-all ${extDuration === min ? 'bg-[#0a2540] border-[#0a2540] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            +{min}m
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setExtendingSession(null)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                    <button onClick={handleExtend} className="flex-1 py-4 rounded-2xl font-black bg-[#0a2540] text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                                        <Check size={18} /> Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DoctorSessions;
