import React, { useState, useEffect } from 'react';
import {
    Users, Calendar, BedDouble, Stethoscope,
    Search, Bell, Settings, Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { adminAPI, appointmentAPI, doctorAPI } from '../../services/api';

const hospitalIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-6 h-6 bg-[#0a2540] rounded-full border-2 border-white shadow flex items-center justify-center"></div>`,
    iconSize: [24, 24], iconAnchor: [12, 12]
});
const ambulanceIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10]
});

const statusStyle = (s) => {
    if (s === 'Confirmed') return 'bg-green-100 text-green-700';
    if (s === 'Completed') return 'bg-blue-100 text-blue-700';
    if (s === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, apptRes, docRes] = await Promise.all([
                    adminAPI.getStats(),
                    appointmentAPI.getAll({ limit: 5 }),
                    doctorAPI.getAll({ status: 'Approved', limit: 5 }),
                ]);
                setStats(statsRes.data.data);
                setAppointments(apptRes.data.data || []);
                setDoctors(docRes.data.data || []);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7fb] font-sans flex">

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
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=ccfbf1" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-10 max-w-[1400px] w-full mx-auto flex-1">

                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">Dashboard Overview</h1>
                        <p className="text-gray-500 font-medium text-[15px]">Welcome back, {user?.fullName || 'Admin'}. Here is a summary of today's hospital status.</p>
                    </div>

                    {/* Stats Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-32 animate-pulse" />)}
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Users size={22} /></div>
                                {stats?.doctors?.pending > 0 && <span className="bg-yellow-50 text-yellow-700 text-[11px] font-bold px-2 py-1 rounded-full border border-yellow-100">{stats.doctors.pending} Pending</span>}
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Total Patients</p>
                                <h3 className="text-[28px] font-black text-[#0f172a] tracking-tight">{stats?.patients?.total ?? '—'}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Calendar size={22} /></div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Today's Appointments</p>
                                <h3 className="text-[28px] font-black text-[#0f172a] tracking-tight">{stats?.appointments?.today ?? '—'}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-orange-50 text-orange-500 p-3 rounded-xl"><BedDouble size={22} /></div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Available Rooms</p>
                                <h3 className="text-[28px] font-black text-[#0f172a] tracking-tight">{stats?.rooms?.available ?? '—'} / {stats?.rooms?.total ?? '—'}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Stethoscope size={22} /></div>
                                <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-full">On Duty</span>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-400 mb-1">Doctors on Duty</p>
                                <h3 className="text-[28px] font-black text-[#0f172a] tracking-tight">{stats?.doctors?.total ?? '—'}</h3>
                            </div>
                        </div>
                    </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                        {/* Recent Activities */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-[#0f172a]">Recent Activities</h2>
                                <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Patient</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date/Time</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.length === 0 && !loading && (
                                            <tr><td colSpan={4} className="py-8 text-center text-gray-400 font-medium">No appointments found</td></tr>
                                        )}
                                        {appointments.map((appt) => {
                                            const initials = appt.patientName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                            return (
                                                <tr key={appt._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{initials}</div>
                                                            <div>
                                                                <p className="font-bold text-[#0f172a] text-[14px]">{appt.patientName}</p>
                                                                <p className="text-[11px] text-gray-500 font-medium">{appt.ticketNumber}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600 font-medium text-sm">{appt.department}</td>
                                                    <td className="py-4 px-6 text-gray-600 font-medium text-sm whitespace-nowrap">{new Date(appt.appointmentDate).toLocaleString()}</td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-block px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full ${statusStyle(appt.status)}`}>
                                                            {appt.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Column Layout */}
                        <div className="flex flex-col gap-8">

                            {/* Active Doctors */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 pb-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#0f172a]">Active Doctors</h2>
                                    <button className="text-blue-600 text-sm font-bold hover:underline">View Schedule</button>
                                </div>
                                <div className="space-y-4">
                                    {doctors.slice(0, 5).map((doc) => (
                                        <div key={doc._id} className="flex items-center justify-between group pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doc.fullName}&backgroundColor=bbf7d0`} alt={doc.fullName} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">{doc.fullName}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">{doc.specialization}</p>
                                                </div>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${doc.availability === 'Available' ? 'bg-green-500' : 'bg-gray-300'} ring-4 ring-white shadow-sm`}></div>
                                        </div>
                                    ))}
                                    {doctors.length === 0 && !loading && <p className="text-gray-400 text-sm text-center py-4">No approved doctors</p>}
                                </div>
                            </div>

                            {/* Hospital Capacity */}
                            <div className="bg-[#0a2540] rounded-xl shadow-lg p-6 relative overflow-hidden">
                                <h3 className="text-xl font-bold text-white mb-2">Hospital Capacity</h3>
                                <p className="text-blue-200/80 text-sm font-medium mb-6 leading-relaxed pr-8">
                                    Real-time bed availability and ward utilization monitoring.
                                </p>

                                <div className="mb-2 w-full bg-[#1b365d] rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: '87.5%' }}></div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold text-white">
                                    <span>87.5% Utilized</span>
                                    <span>105 Rooms Occupied</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Ambulance Dispatch Map */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col mt-8">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                                <Navigation className="text-blue-600" size={20} /> Ambulance Dispatch Tracking
                            </h2>
                            <span className="bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full border border-green-100 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                2 Active Units
                            </span>
                        </div>
                        <div className="h-[350px] w-full bg-gray-50 relative z-0">
                            <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                                <Marker position={[6.9271, 79.8612]} icon={hospitalIcon}>
                                    <Popup className="font-sans">
                                        <div className="font-bold text-[#0f172a]">City General Hospital</div>
                                        <div className="text-xs text-gray-500">Main Facility</div>
                                    </Popup>
                                </Marker>

                                {/* Ambulance 1 */}
                                <Marker position={[6.9310, 79.8520]} icon={ambulanceIcon}>
                                    <Popup className="font-sans">
                                        <div className="font-bold text-red-600 mb-1">AMB-01 (In Transit)</div>
                                        <div className="text-xs text-gray-600 font-medium">ETA: 8 mins to Hospital</div>
                                        <div className="text-[10px] text-gray-400 mt-1">Paramedic: John D.</div>
                                    </Popup>
                                </Marker>

                                {/* Ambulance 2 */}
                                <Marker position={[6.9150, 79.8700]} icon={ambulanceIcon}>
                                    <Popup className="font-sans">
                                        <div className="font-bold text-orange-600 mb-1">AMB-04 (Dispatched)</div>
                                        <div className="text-xs text-gray-600 font-medium">ETA: 15 mins to Patient</div>
                                        <div className="text-[10px] text-gray-400 mt-1">Paramedic: Mike S.</div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
