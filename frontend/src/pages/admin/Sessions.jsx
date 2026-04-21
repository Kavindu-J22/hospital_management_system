import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, Plus, Calendar, Clock,
    MoreVertical, Edit2, Trash2, ExternalLink,
    TrendingUp, Activity, HelpCircle, User, ChevronRight,
    MapPin, X, Check
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { sessionAPI } from '../../services/api';
import Toast from '../../components/shared/Toast';

const AdminSessions = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState('');
    
    // Edit Modal State
    const [editingSession, setEditingSession] = useState(null);
    const [editForm, setEditForm] = useState({ maxPatients: 12, status: 'Upcoming' });

    const isSessionActiveNow = (session) => {
        try {
            const today = new Date();
            const sessionDate = new Date(session.date);
            const slTimeStr = today.toLocaleString("en-US", {timeZone: "Asia/Colombo"});
            const slTime = new Date(slTimeStr);
            if (sessionDate.toDateString() !== slTime.toDateString()) return false;

            const parseTime = (timeStr) => {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours, 10);
                if (hours === 12) hours = 0;
                if (modifier === 'PM') hours += 12;
                const d = new Date(slTime);
                d.setHours(hours, parseInt(minutes, 10), 0, 0);
                return d;
            };

            const startTime = parseTime(session.startTime);
            const endTime = parseTime(session.extendedEndTime || session.endTime);

            return slTime >= startTime && slTime <= endTime;
        } catch (e) { return false; }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessRes, statsRes] = await Promise.all([
                sessionAPI.getAll({ limit: 100 }), // Get more sessions for admin view
                sessionAPI.getStats()
            ]);
            setSessions(sessRes.data.data || []);
            setStats(statsRes.data.data || {});
        } catch (err) { 
            console.error(err); 
            setToast({ type: 'error', message: 'Failed to fetch sessions' });
        }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const upcoming = sessions.filter(s => ['Upcoming', 'Active', 'Extended'].includes(s.status));
    const history = sessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');

    const handleEditSave = async () => {
        if (!editingSession) return;
        try {
            await sessionAPI.updateStatus(editingSession._id, { status: editForm.status });
            setToast({ type: 'success', message: 'Session updated successfully!' });
            setEditingSession(null);
            fetchData();
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to update session' });
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

            <AdminSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen overflow-hidden">

                {/* Header */}
                <header className="bg-white px-8 py-3.5 flex items-center justify-between border-b border-gray-100 z-10 sticky top-0 bg-white/80 backdrop-blur-md">
                    <div className="flex-1 flex items-center relative max-w-xl">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search sessions, doctors, or rooms..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                        <h1 className="text-[28px] font-black tracking-tight mb-1">Sessions Management</h1>
                        <p className="text-gray-500 font-medium">Manage and monitor all doctor scheduled sessions across the hospital.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-[#0f172a]">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50/50 p-2.5 rounded-xl"><Calendar size={20} className="text-blue-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Total Today</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{stats.todayTotal || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-green-50/50 p-2.5 rounded-xl"><Activity size={20} className="text-green-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Active Now</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{stats.active || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-yellow-50/50 p-2.5 rounded-xl"><Clock size={20} className="text-yellow-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Upcoming</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{stats.upcoming || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-purple-50/50 p-2.5 rounded-xl"><TrendingUp size={20} className="text-purple-600" /></div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[13px] font-bold mb-1">Weekly Total</p>
                                <h3 className="text-[36px] font-black leading-none tracking-tight">{stats.weekly || 0}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Sessions Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-[18px] font-bold tracking-tight">Active & Upcoming Sessions</h2>
                            <button
                                onClick={() => navigate('/admin/new-session')}
                                className="bg-[#0a2540] hover:bg-[#1a3a5a] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                            >
                                <Plus size={16} /> Schedule New Session
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/20">
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Doctor</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Room</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <tr><td colSpan={6} className="py-10 text-center text-gray-400 font-medium italic">Loading sessions...</td></tr>}
                                    {!loading && upcoming.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-400 font-medium italic">No active or upcoming sessions found.</td></tr>}
                                    {upcoming.filter(s => 
                                        !search || 
                                        s.doctorName.toLowerCase().includes(search.toLowerCase()) || 
                                        s.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
                                        s.specialization.toLowerCase().includes(search.toLowerCase())
                                    ).map((session) => (
                                        <tr key={session._id} className="border-b border-gray-50 last:border-none group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs overflow-hidden">
                                                        {session.doctor?.avatar ? (
                                                            <img src={session.doctor.avatar} alt="" />
                                                        ) : (
                                                            session.doctorName.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-bold leading-tight">{session.doctorName}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">{session.specialization}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-[13px] font-bold">{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                            <td className="py-5 px-6 text-[13px] font-medium text-gray-500">
                                                {session.startTime} - {session.extendedEndTime || session.endTime}
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="bg-[#f0f4f8] text-[#0f172a] px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                    {session.roomNumber}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    {statusBadge(session.status)}
                                                    {isSessionActiveNow(session) && (
                                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingSession(session);
                                                        setEditForm({ maxPatients: session.maxPatients, status: session.status });
                                                    }}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-[18px] font-bold tracking-tight">Recent Session History</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/20">
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Doctor</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Room</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.slice(0, 10).map((h) => (
                                        <tr key={h._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <p className="text-[13px] font-bold">{h.doctorName}</p>
                                                <p className="text-[11px] text-gray-400">{h.specialization}</p>
                                            </td>
                                            <td className="py-4 px-6 text-[13px] text-gray-500">
                                                {new Date(h.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-[13px] font-medium">Room {h.roomNumber}</td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`text-[11px] font-bold uppercase tracking-wider ${h.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {h.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && history.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-gray-400 font-medium italic">No history records found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>

                {/* Edit Modal */}
                {editingSession && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black tracking-tight text-[#0f172a]">Manage Session</h3>
                                    <button onClick={() => setEditingSession(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Update Status</label>
                                    <select 
                                        value={editForm.status} 
                                        onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setEditingSession(null)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                    <button onClick={handleEditSave} className="flex-1 py-4 rounded-2xl font-black bg-[#0a2540] text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                                        <Check size={18} /> Update Session
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

export default AdminSessions;
