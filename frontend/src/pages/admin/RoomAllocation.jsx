import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Bell, HelpCircle, PlusSquare,
    Calendar, Edit2, Trash2, Filter, Download as Export,
    Bed, FileText, CheckCircle, AlertCircle
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Toast from '../../components/shared/Toast';

const INITIAL_ALLOCATIONS = [
    { id: 1, room: 'OR-101', session: 'SESS-201', doctor: 'Dr. Alan Grant', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alan&backgroundColor=bbf7d0', date: 'Oct 24, 2023', time: '08:00 - 12:00', status: 'Occupied', statusColor: 'bg-orange-100 text-orange-600' },
    { id: 2, room: 'CON-305', session: 'SESS-205', doctor: 'Dr. Ellie Sattler', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ellie&backgroundColor=c0aede', date: 'Oct 24, 2023', time: '14:00 - 17:30', status: 'Scheduled', statusColor: 'bg-green-100 text-green-600' },
    { id: 3, room: 'LAB-1', session: 'SESS-209', doctor: 'Dr. Ian Malcolm', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ian&backgroundColor=fed7aa', date: 'Oct 25, 2023', time: '09:00 - 11:00', status: 'Available', statusColor: 'bg-gray-100 text-gray-500' },
];

const FieldError = ({ msg }) => msg ? (
    <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1">
        <AlertCircle size={12} /> {msg}
    </p>
) : null;

const RoomAllocation = () => {
    const navigate = useNavigate();
    const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
    const [form, setForm] = useState({ sessionId: '', doctor: '', date: '', startTime: '', endTime: '', room: '' });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.sessionId.trim()) e.sessionId = 'Session ID is required';
        else if (!/^SESS-\d+$/i.test(form.sessionId.trim())) e.sessionId = 'Format must be SESS-XXXX (e.g. SESS-402)';
        if (!form.doctor || form.doctor === '') e.doctor = 'Please select a doctor';
        if (!form.date.trim()) e.date = 'Date is required';
        else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.date)) e.date = 'Use format MM/DD/YYYY';
        if (!form.startTime.trim()) e.startTime = 'Start time required';
        if (!form.endTime.trim()) e.endTime = 'End time required';
        if (!form.room || form.room === '') e.room = 'Please select a room';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            setToast({ type: 'error', message: 'Please fix errors before confirming.' });
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            const newEntry = {
                id: Date.now(),
                room: form.room,
                session: form.sessionId.toUpperCase(),
                doctor: form.doctor,
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${form.doctor}&backgroundColor=c0aede`,
                date: form.date,
                time: `${form.startTime} - ${form.endTime}`,
                status: 'Scheduled',
                statusColor: 'bg-green-100 text-green-600'
            };
            setAllocations(prev => [newEntry, ...prev]);
            setForm({ sessionId: '', doctor: '', date: '', startTime: '', endTime: '', room: '' });
            setErrors({});
            setSubmitting(false);
            setToast({ type: 'success', message: `Room ${form.room} allocated successfully to ${form.doctor}!` });
        }, 1200);
    };

    const handleDelete = (id) => {
        setAllocations(prev => prev.filter(a => a.id !== id));
        setDeleteConfirm(null);
        setToast({ type: 'success', message: 'Allocation removed.' });
    };

    const inputCls = (hasErr) =>
        `w-full bg-[#f8f9fa] border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 font-bold text-sm transition-all ${hasErr
            ? 'border-red-300 focus:ring-red-100 bg-red-50/30'
            : 'border-gray-100 focus:ring-blue-100'}`;

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans flex text-[#0f172a]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-black mb-2">Remove Allocation?</h3>
                        <p className="text-gray-500 text-sm font-medium mb-6">This will permanently remove this room allocation. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors">Remove</button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <AdminSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen overflow-hidden">
                <header className="bg-white px-8 py-3.5 flex items-center justify-between border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm"><PlusSquare size={20} /></div>
                        <span className="text-[18px] font-black tracking-tight">CareStream HMS</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-10 mx-auto px-10">
                        <button onClick={() => navigate('/admin/dashboard')} className="text-[14px] font-bold text-gray-400 hover:text-[#0f172a]">Dashboard</button>
                        <button className="text-[14px] font-bold text-blue-600 border-b-2 border-blue-600 pb-px">Rooms</button>
                        <button className="text-[14px] font-bold text-gray-400 hover:text-[#0f172a]">Staff</button>
                        <button className="text-[14px] font-bold text-gray-400 hover:text-[#0f172a]">Patients</button>
                    </nav>
                    <div className="flex-1 flex items-center relative max-w-md mx-6">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input type="text" placeholder="Search rooms, sessions, or doctors..." className="w-full bg-[#f4f7fb] border-none rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-4 text-gray-400">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><HelpCircle size={18} /></button>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="text-right">
                                <p className="text-[13px] font-bold leading-tight">Dr. Sarah Smith</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Administrator</p>
                            </div>
                            <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-teal-50">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=bbf7d0" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10 flex-1 overflow-y-auto w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">

                    <div className="space-y-8 flex flex-col">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex-1">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><PlusSquare size={18} /></div>
                                <div>
                                    <h2 className="text-[17px] font-black">New Room Allocation</h2>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Schedule a clinical session</p>
                                </div>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Session ID *</label>
                                    <input type="text" placeholder="e.g. SESS-402" value={form.sessionId} onChange={set('sessionId')} className={inputCls(errors.sessionId)} />
                                    <FieldError msg={errors.sessionId} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Doctor *</label>
                                    <select value={form.doctor} onChange={set('doctor')} className={`${inputCls(errors.doctor)} appearance-none`}>
                                        <option value="">Select Doctor</option>
                                        <option>Dr. Alan Grant</option>
                                        <option>Dr. Ellie Sattler</option>
                                        <option>Dr. Sarah Jenkins</option>
                                        <option>Dr. Ian Malcolm</option>
                                    </select>
                                    <FieldError msg={errors.doctor} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Date *</label>
                                    <input type="text" placeholder="MM/DD/YYYY" value={form.date} onChange={set('date')} className={inputCls(errors.date)} />
                                    <FieldError msg={errors.date} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Start Time *</label>
                                        <input type="text" placeholder="e.g. 09:00 AM" value={form.startTime} onChange={set('startTime')} className={inputCls(errors.startTime)} />
                                        <FieldError msg={errors.startTime} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">End Time *</label>
                                        <input type="text" placeholder="e.g. 12:00 PM" value={form.endTime} onChange={set('endTime')} className={inputCls(errors.endTime)} />
                                        <FieldError msg={errors.endTime} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Room Selection *</label>
                                    <select value={form.room} onChange={set('room')} className={`${inputCls(errors.room)} appearance-none`}>
                                        <option value="">Select Room</option>
                                        <option>OR-101</option>
                                        <option>CON-305</option>
                                        <option>LAB-1</option>
                                        <option>ROOM-204</option>
                                        <option>ICU-02</option>
                                    </select>
                                    <FieldError msg={errors.room} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[#0a2540] hover:bg-[#1a3a5a] disabled:opacity-60 text-white py-4 rounded-xl font-black shadow-[0_10px_30px_-5px_rgba(10,37,64,0.3)] flex items-center justify-center gap-3 transition-all mt-4"
                                >
                                    {submitting
                                        ? <span className="flex items-center gap-3"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Allocating...</span>
                                        : <><Calendar size={18} /> Confirm Allocation</>
                                    }
                                </button>
                            </form>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-8">
                            <h3 className="text-[11px] font-black text-blue-600 mb-6 uppercase tracking-[0.2em]">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Rooms</p>
                                    <h4 className="text-[24px] font-black tracking-tight">42</h4>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Occupancy</p>
                                    <h4 className="text-[24px] font-black tracking-tight">{Math.round((allocations.filter(a => a.status === 'Occupied' || a.status === 'Scheduled').length / 42) * 100) || 78}%</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full shrink-0">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-[20px] font-black tracking-tight mb-1">Current Allocations</h2>
                                <p className="text-gray-400 text-[13px] font-medium">Live view of room statuses — {allocations.length} entries</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-white border border-gray-100 text-[#0f172a] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
                                    <Filter size={14} /> Filter
                                </button>
                                <button className="bg-white border border-gray-100 text-[#0f172a] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
                                    <Export size={14} /> Export
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Room</th>
                                        <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Session ID</th>
                                        <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Doctor</th>
                                        <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                        <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocations.map((row) => (
                                        <tr key={row.id} className="border-b border-gray-50 last:border-none group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-blue-600"><Bed size={18} /></div>
                                                    <span className="text-[14px] font-extrabold">{row.room}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-[13px] font-bold text-gray-400">{row.session}</td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shrink-0">
                                                        <img src={row.avatar} alt={row.doctor} />
                                                    </div>
                                                    <span className="text-[13px] font-bold">{row.doctor}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <p className="text-[13px] font-extrabold leading-tight">{row.date}</p>
                                                <p className="text-[11px] text-gray-400 font-bold mt-0.5">{row.time}</p>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide ${row.statusColor}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Occupied' ? 'bg-orange-500' : row.status === 'Scheduled' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-end gap-2 text-gray-300">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg hover:text-[#0f172a] transition-all">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteConfirm(row.id)} className="p-2 hover:bg-red-50 rounded-lg hover:text-red-500 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 mt-auto border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[13px] text-gray-400 font-bold">Showing {allocations.length} of {allocations.length} entries</span>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-[#0f172a]">Previous</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0a2540] text-white font-black text-sm">1</button>
                                <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-[#0f172a]">Next</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RoomAllocation;
