import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Calendar, Users, Activity,
    Search, Bell, Settings, Plus, List as ListIcon,
    CalendarDays, Filter, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { appointmentAPI } from '../../services/api';

const statusStyle = (s) => {
    if (s === 'Confirmed') return 'bg-green-100 text-green-700';
    if (s === 'Pending') return 'bg-orange-100 text-orange-700';
    if (s === 'Cancelled') return 'bg-red-100 text-red-700';
    if (s === 'Completed') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
};

const Appointments = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [apptRes, statsRes] = await Promise.all([
                    appointmentAPI.getAll({ limit: 50 }),
                    appointmentAPI.getStats(),
                ]);
                setAppointments(apptRes.data.data || []);
                setStats(statsRes.data.data || {});
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const filtered = appointments.filter(a => {
        const tabMatch = activeTab === 'Upcoming' ? ['Pending','Confirmed'].includes(a.status)
            : activeTab === 'Completed' ? a.status === 'Completed'
            : activeTab === 'Cancelled' ? a.status === 'Cancelled' : true;
        const searchMatch = !search || a.patientName?.toLowerCase().includes(search.toLowerCase()) || a.ticketNumber?.toLowerCase().includes(search.toLowerCase()) || a.doctorName?.toLowerCase().includes(search.toLowerCase());
        return tabMatch && searchMatch;
    });

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex font-sans">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white h-[76px] px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4 w-96 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search patients, doctors..."
                            className="w-full bg-[#f4f6fa] rounded-lg pl-11 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200">
                            <Bell size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200">
                            <Settings size={18} />
                        </button>
                        <div className="w-9 h-9 bg-teal-100 rounded-full overflow-hidden border border-teal-200 ml-2">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=ccfbf1" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <main className="p-10 max-w-[1200px] w-full mx-auto flex-1">

                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-1">Appointments</h1>
                            <p className="text-gray-500 font-medium text-[15px]">Manage and schedule upcoming patient visits</p>
                        </div>
                        <button onClick={() => navigate('/admin/schedule-appointment')} className="bg-[#0a2540] hover:bg-[#061626] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-sm text-sm">
                            <Plus size={18} /> Schedule New Appointment
                        </button>
                    </div>

                    {/* Tabs & View Toggle */}
                    <div className="flex items-center justify-between border-b border-gray-200 mb-6">
                        <div className="flex gap-8">
                            {['Upcoming', 'Completed', 'Cancelled'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 text-[15px] font-bold border-b-2 ${activeTab === tab
                                        ? 'border-blue-600 text-blue-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center bg-[#f4f6fa] p-1 rounded-lg border border-gray-200 mb-2">
                            <button className="flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-bold text-gray-800">
                                <ListIcon size={16} /> List
                            </button>
                            <button className="flex items-center gap-2 px-4 py-1.5 text-gray-500 text-sm font-semibold hover:text-gray-800">
                                <CalendarDays size={16} /> Calendar
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-4">
                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50">
                                <Filter size={14} className="text-gray-400" /> All Departments <span className="ml-1 text-xs">▼</span>
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50">
                                <Activity size={14} className="text-gray-400" /> Doctor <span className="ml-1 text-xs">▼</span>
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50">
                                <CalendarDays size={14} className="text-gray-400" /> This Week <span className="ml-1 text-xs">▼</span>
                            </button>
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Filter size={14} /> {filtered.length} FOUND
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {loading && <div className="py-10 text-center text-gray-400 font-medium">Loading appointments...</div>}
                        {!loading && filtered.length === 0 && <div className="py-10 text-center text-gray-400 font-medium">No appointments found</div>}
                        {filtered.map((app) => (
                            <div key={app._id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                                {/* Patient Info */}
                                <div className="flex items-center gap-4 w-[25%]">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${app.patientName}&backgroundColor=bbf7d0`} alt={app.patientName} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f172a] text-[15px]">{app.patientName}</h4>
                                        <p className="text-xs text-gray-500 font-medium">#{app.ticketNumber}</p>
                                    </div>
                                </div>
                                {/* Doctor / Dept */}
                                <div className="flex items-start gap-3 w-[25%]">
                                    <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg mt-0.5"><Activity size={16} /></div>
                                    <div>
                                        <h4 className="font-bold text-[#0f172a] text-[14px]">{app.doctorName}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{app.department} • {app.consultType}</p>
                                    </div>
                                </div>
                                {/* Date / Time */}
                                <div className="flex items-start gap-3 w-[25%]">
                                    <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg mt-0.5"><Calendar size={16} /></div>
                                    <div>
                                        <h4 className="font-bold text-[#0f172a] text-[14px]">{new Date(app.appointmentDate).toLocaleDateString()}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{app.timeSlot || '—'} • via {app.bookingSource}</p>
                                    </div>
                                </div>
                                {/* Status */}
                                <div className="flex items-center justify-end w-[15%] gap-4">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle(app.status)}`}>{app.status}</span>
                                    <button className="text-gray-400 hover:text-gray-600 p-1"><MoreVertical size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">Showing 4 of 12 upcoming appointments</span>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-gray-200 text-gray-500 font-semibold text-sm rounded-lg hover:bg-gray-50">Previous</button>
                            <button className="w-10 h-10 bg-[#0a2540] text-white font-bold text-sm rounded-lg flex items-center justify-center shadow-sm">1</button>
                            <button className="w-10 h-10 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg flex items-center justify-center hover:bg-gray-50">2</button>
                            <button className="w-10 h-10 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg flex items-center justify-center hover:bg-gray-50">3</button>
                            <button className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50">Next</button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

// SVG component missing from default lucid-react easily accessible
const Clock = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export default Appointments;
