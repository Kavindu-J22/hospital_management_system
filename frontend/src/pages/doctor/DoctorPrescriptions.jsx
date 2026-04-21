import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, ListChecks, CalendarCheck, Search, Filter,
    Plus, Download, Activity
} from 'lucide-react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { prescriptionAPI } from '../../services/api';

const statusStyle = (s) => {
    if (s === 'Active') return 'bg-green-100 text-green-700';
    if (s === 'Completed') return 'bg-gray-100 text-gray-600';
    if (s === 'Expired') return 'bg-gray-200 text-gray-500';
    return 'bg-yellow-100 text-yellow-700';
};

const DoctorPrescriptions = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const res = await prescriptionAPI.getByDoctor(user.id);
                setPrescriptions(res.data.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7fb] font-sans flex">

            <DoctorSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">

                {/* Embedded Optional Topbar */}
                <header className="bg-white px-8 py-4 flex items-center justify-end border-b border-gray-100 z-10 shrink-0">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right">
                            <p className="text-[14px] font-bold text-[#0f172a] leading-tight group-hover:text-blue-600 transition-colors">Dr. Sarah Jenkins</p>
                            <p className="text-[11px] text-gray-400 font-semibold tracking-wide">Chief Surgeon</p>
                        </div>
                        <div className="w-10 h-10 bg-teal-50 rounded-full border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=bbf7d0" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <main className="p-8 max-w-[1200px] w-full mx-auto flex-1 flex flex-col">

                    <div className="mb-8">
                        <h1 className="text-[32px] font-black text-[#0f172a] mb-2 tracking-tight">Prescriptions Overview</h1>
                        <p className="text-gray-500 font-medium text-[16px]">Manage and track all patient prescriptions issued across the network.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                            { title: 'Total Prescriptions', value: prescriptions.length, icon: <Calendar size={20} />, iconBg: 'bg-blue-50 text-blue-600' },
                            { title: 'Active', value: prescriptions.filter(p => p.status === 'Active').length, icon: <ListChecks size={20} />, iconBg: 'bg-green-50 text-green-600' },
                            { title: 'Completed / Expired', value: prescriptions.filter(p => ['Completed','Expired'].includes(p.status)).length, icon: <CalendarCheck size={20} />, iconBg: 'bg-purple-50 text-purple-600' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${s.iconBg}`}>{s.icon}</div>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-500 mb-0.5">{s.title}</p>
                                    <h3 className="text-[32px] font-black text-[#0f172a] leading-none tracking-tight">{loading ? '—' : s.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white pt-6">
                            <div className="relative w-full md:w-[450px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by doctor name, medication, or date..."
                                    className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium placeholder-gray-400"
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button className="bg-white border border-gray-200 text-[#0f172a] px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm shadow-sm">
                                    <Filter size={16} /> Filters
                                </button>
                                <button
                                    onClick={() => navigate('/doctor/new-prescription')}
                                    className="bg-[#0a2540] hover:bg-[#1e293b] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm shadow-[0_4px_12px_rgba(10,37,64,0.3)]"
                                >
                                    <Plus size={18} /> New Prescription
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Date</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Doctor Name</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Specialization</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Medication Summary</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center w-32">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <tr><td colSpan={6} className="py-6 text-center text-gray-400">Loading prescriptions...</td></tr>}
                                    {!loading && prescriptions.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-gray-400">No prescriptions found</td></tr>}
                                    {prescriptions.filter(p => !search || p.patientName?.toLowerCase().includes(search.toLowerCase()) || p.medications?.[0]?.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
                                        <tr key={p._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-5 px-6">
                                                <p className="font-extrabold text-[#0f172a] text-[14px] leading-tight mb-0.5">{new Date(p.issueDate || p.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 border border-gray-200 rounded-full overflow-hidden bg-gray-50 shrink-0">
                                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.patientName}&backgroundColor=bbf7d0`} alt={p.patientName} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#0f172a] text-[14px]">{p.patientName}</p>
                                                        <p className="text-xs text-gray-400">{p.patientId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-gray-600 font-medium text-[14px]">{p.specialization}</td>
                                            <td className="py-5 px-6">
                                                <p className="font-bold text-[#0f172a] text-[14px] leading-tight mb-0.5">{p.medications?.[0]?.name} {p.medications?.[0]?.dosage}</p>
                                                <p className="text-[12px] text-gray-400 font-medium leading-tight">{p.medications?.[0]?.frequency}, {p.medications?.[0]?.duration} {p.medications?.[0]?.durationUnit}</p>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <span className={`inline-block px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full ${statusStyle(p.status)}`}>{p.status}</span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-blue-600 hover:text-blue-800 p-1"><Download size={18} /></button>
                                                    <button className="bg-white border border-gray-200 text-[#0f172a] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">View</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-2xl">
                            <span className="text-sm text-gray-400 font-semibold">Showing 1 to 4 of 320 prescriptions</span>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">&lt;</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0a2540] text-white font-bold text-sm">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-[#0f172a] font-bold text-sm hover:bg-gray-50 transition-colors">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-[#0f172a] font-bold text-sm hover:bg-gray-50 transition-colors">3</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">&gt;</button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default DoctorPrescriptions;
