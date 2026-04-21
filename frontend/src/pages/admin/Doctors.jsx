import React, { useState, useEffect } from 'react';
import { 
    Activity, Search, Filter, CheckCircle, XCircle, 
    MoreVertical, Mail, Phone, Calendar, User, 
    ShieldCheck, AlertCircle, Clock
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { doctorAPI } from '../../services/api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = statusFilter !== 'All' ? { status: statusFilter } : {};
            const res = await doctorAPI.getAll(params);
            setDoctors(res.data.data || []);
            
            // If we're showing all, calculate stats
            if (statusFilter === 'All') {
                const list = res.data.data || [];
                setStats({
                    total: list.length,
                    pending: list.filter(d => d.status === 'Pending').length,
                    approved: list.filter(d => d.status === 'Approved').length
                });
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [statusFilter]);

    const handleApprove = async (id, name) => {
        if (!window.confirm(`Are you sure you want to approve Dr. ${name}?`)) return;
        
        try {
            await doctorAPI.approve(id);
            toast.success(`Dr. ${name} has been approved!`);
            fetchDoctors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async (id, name) => {
        const reason = window.prompt(`Enter rejection reason for Dr. ${name}:`);
        if (reason === null) return;
        
        try {
            await doctorAPI.reject(id, { reason });
            toast.success(`Dr. ${name} has been rejected.`);
            fetchDoctors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Rejection failed');
        }
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-50 text-green-700 border-green-100';
            case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7fb] font-sans flex">
            <Toaster position="top-right" />
            <AdminSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white h-[76px] px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <Activity className="text-blue-600" size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-[#0f172a]">Doctor Management</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search by name, specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>
                </header>

                <main className="p-8 max-w-[1400px] w-full mx-auto">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><User size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registered</p>
                                    <h3 className="text-2xl font-black text-[#0f172a]">{stats.total}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl"><Clock size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Approval</p>
                                    <h3 className="text-2xl font-black text-yellow-600">{stats.pending}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl"><ShieldCheck size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved Doctors</p>
                                    <h3 className="text-2xl font-black text-green-600">{stats.approved}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Table */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400" />
                                <span className="text-sm font-bold text-[#0f172a]">Filter by Status:</span>
                                <div className="flex gap-2 ml-2">
                                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                                        <button 
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                                statusFilter === status 
                                                ? 'bg-[#0f172a] text-white border-[#0f172a]' 
                                                : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#f8fafc] border-b border-gray-100">
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Doctor Info</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Specialization</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Experience / License</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="border-b border-gray-50 animate-pulse">
                                                <td colSpan={6} className="py-8 px-6">
                                                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredDoctors.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="bg-gray-50 p-4 rounded-full text-gray-300"><User size={40} /></div>
                                                    <p className="text-gray-400 font-medium">No doctors found matching filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredDoctors.map((doc) => (
                                        <tr key={doc._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                        {doc.fullName.charAt(doc.fullName.startsWith('Dr.') ? 4 : 0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#0f172a] text-sm">{doc.fullName}</p>
                                                        <p className="text-[11px] text-gray-500 font-medium">{doc.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                                                    {doc.specialization}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-gray-600 flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {doc.contactNumber}</p>
                                                    {doc.nic && <p className="text-[11px] text-gray-400 font-medium ml-4.5">NIC: {doc.nic}</p>}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold text-[#0f172a]">{doc.yearsOfExperience} Years Exp.</p>
                                                    <p className="text-[11px] text-gray-500 font-medium">{doc.licenseNumber}</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                                {doc.status === 'Rejected' && doc.rejectionReason && (
                                                    <div className="group relative inline-block ml-1">
                                                        <AlertCircle size={14} className="text-red-400 cursor-help" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl z-20">
                                                            Reason: {doc.rejectionReason}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                {doc.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleApprove(doc._id, doc.fullName)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(doc._id, doc.fullName)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Doctors;
