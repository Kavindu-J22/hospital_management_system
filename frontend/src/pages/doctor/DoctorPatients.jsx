import React, { useState, useEffect } from 'react';
import {
    Search, Bell, Settings, Filter, Users,
    AlertTriangle, CheckCircle, Eye, Edit2, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { patientAPI } from '../../services/api';

const statusStyle = (s) => {
    if (s === 'Critical') return 'bg-red-100 text-red-700';
    if (s === 'Recovering') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
};

const calcAge = (dob) => {
    if (!dob) return '—';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
};

const DoctorPatients = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ total: 0, critical: 0, stable: 0 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchPatients = async (q = '', p = 1) => {
        setLoading(true);
        try {
            const [pRes, sRes] = await Promise.all([
                patientAPI.getAll({ search: q, page: p, limit: 10 }),
                patientAPI.getStats(),
            ]);
            setPatients(pRes.data.data || []);
            setTotal(pRes.data.total || 0);
            setTotalPages(pRes.data.pages || 1);
            setStats(sRes.data.data || {});
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPatients(search, page); }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPatients(search, 1);
    };

    return (
        <div className="min-h-screen bg-[#f4f7fa] font-sans flex">
            <DoctorSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
                {/* Embedded Optional Topbar */}
                <header className="bg-white px-8 py-4 flex items-center justify-end border-b border-gray-100 z-10 shrink-0">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right">
                            <p className="text-[14px] font-bold text-[#0f172a] leading-tight group-hover:text-blue-600 transition-colors">{user?.fullName || 'Doctor'}</p>
                            <p className="text-[11px] text-gray-400 font-semibold tracking-wide">{user?.specialization || 'General'}</p>
                        </div>
                        <div className="w-10 h-10 bg-teal-50 rounded-full border-2 border-white shadow-sm overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName || 'Doc'}&backgroundColor=bbf7d0`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6">

                    {/* Title & Actions */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-2">My Patients</h1>
                            <p className="text-gray-500 font-medium text-[15px]">Central database for managing patient status and records</p>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <form onSubmit={handleSearch} className="flex items-center gap-4 mt-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, patient ID, NIC..."
                                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                            />
                        </div>
                        <button type="button" className="bg-[#e4efff] text-blue-700 px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-blue-100 transition-colors">
                            All Categories <span className="text-[10px]">▼</span>
                        </button>
                        <button type="submit" className="bg-white border border-gray-200 p-3.5 rounded-xl text-gray-600 shadow-sm hover:bg-gray-50">
                            <Search size={18} />
                        </button>
                    </form>

                    {/* Table Area */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Patient ID</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Full Name</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Age/Gender</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Last Visit</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 text-center">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading...</td></tr>}
                                    {!loading && patients.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No patients found</td></tr>}
                                    {patients.map((p) => {
                                        const initials = p.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                        return (
                                            <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 px-6 font-bold text-blue-600 text-sm whitespace-nowrap">#{p.patientId}</td>
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">{initials}</div>
                                                        <span className="font-bold text-[#0f172a] text-[15px]">{p.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-gray-500 font-medium text-sm whitespace-nowrap">{calcAge(p.dateOfBirth)} / {p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : '—'}</td>
                                                <td className="py-5 px-6 text-gray-500 font-medium text-sm whitespace-nowrap">{p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '—'}</td>
                                                <td className="py-5 px-6 text-center">
                                                    <span className={`inline-block px-3 py-1 font-bold text-[11px] uppercase tracking-wider rounded-full ${statusStyle(p.status)}`}>{p.status}</span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <div className="flex justify-end gap-3 text-gray-400">
                                                        <button className="hover:text-blue-600 transition-colors" onClick={() => navigate('/doctor/prescriptions')} title="Prescriptions"><Eye size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-gray-100 p-4 px-6 flex items-center justify-between">
                            <span className="text-gray-500 font-medium text-sm">Showing {patients.length} of {total} patients</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 text-gray-500 font-semibold text-sm rounded-lg hover:bg-gray-50 disabled:opacity-40">Previous</button>
                                <span className="w-10 h-10 bg-[#0a2540] text-white font-bold text-sm rounded-lg flex items-center justify-center shadow-sm">{page}</span>
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 pb-10">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                            <div className="bg-[#eef4ff] text-blue-600 p-4 rounded-xl"><Users size={24} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Patients</p>
                                <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">{stats.total ?? '—'}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl"><AlertTriangle size={24} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Cases</p>
                                <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">{stats.critical ?? '—'}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                            <div className="bg-green-50 text-green-600 p-4 rounded-xl"><CheckCircle size={24} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stable</p>
                                <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">{stats.stable ?? '—'}</h3>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div >
    );
};

export default DoctorPatients;
