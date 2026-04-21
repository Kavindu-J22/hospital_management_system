import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, PlusSquare,
    Calendar, Clock, UserPlus, Monitor,
    ChevronLeft, ChevronRight, Plus, RotateCcw,
    FileText, AlertCircle, CheckCircle
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import Toast from '../../components/shared/Toast';
import { doctorAPI, roomAPI, sessionAPI } from '../../services/api';

const FieldError = ({ msg }) => msg ? (
    <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1">
        <AlertCircle size={12} /> {msg}
    </p>
) : null;

const CALENDAR_DAYS = [28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const NewSession = ({ role = 'doctor' }) => {
    const navigate = useNavigate();
    const Sidebar = role === 'admin' ? AdminSidebar : DoctorSidebar;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const [doctors, setDoctors] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    
    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [docRes, roomRes] = await Promise.all([
                    doctorAPI.getAll({ status: 'Approved', limit: 100 }),
                    roomAPI.getAvailable(),
                ]);
                setDoctors(docRes.data.data || []);
                setAvailableRooms(roomRes.data.data || []);
            } catch (err) { console.error(err); }
        };
        fetchOptions();
    }, []);

    // Form state
    const [form, setForm] = useState({
        doctor: role === 'doctor' ? currentUser.id : '', 
        room: '', capacity: '12',
        startTime: '09:00 AM', endTime: '05:00 PM', autoIntervals: true
    });
    const [sessionType, setSessionType] = useState('In-Person');
    const [selectedSlots, setSelectedSlots] = useState(['09:00 AM']);
    const [selectedDate, setSelectedDate] = useState(null); // Single date selection for now as per simple requirement
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [customSlot, setCustomSlot] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const quickSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

    const toggleSlot = (slot) => {
        setSelectedSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
        );
    };

    // Correct month generation
    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        // Add prev month days to pad start
        const startDay = date.getDay();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ day: new Date(year, month, -i).getDate(), month: 'prev' });
        }
        // Current month
        while (date.getMonth() === month) {
            days.push({ day: date.getDate(), month: 'current' });
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    const handleDateClick = (dayObj) => {
        if (dayObj.month !== 'current') return;
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayObj.day);
        setSelectedDate(newDate);
    };

    const validate = () => {
        const e = {};
        if (!form.doctor) e.doctor = 'Please assign a doctor';
        if (!form.room) e.room = 'Please select a consultation room';
        if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) e.capacity = 'Enter a valid patient capacity';
        if (Number(form.capacity) > 100) e.capacity = 'Capacity cannot exceed 100';
        if (!form.startTime.trim()) e.startTime = 'Start time is required';
        if (!form.endTime.trim()) e.endTime = 'End time is required';
        if (!selectedDate) e.date = 'Please select a session date';
        if (selectedSlots.length === 0) e.slots = 'Select at least one time slot';
        return e;
    };

    const handleInitialize = async () => {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            setToast({ type: 'error', message: 'Please fix the highlighted errors.' });
            return;
        }
        setSubmitting(true);
        try {
            await sessionAPI.create({
                doctorId: form.doctor,
                roomId: form.room,
                date: selectedDate.toISOString(),
                startTime: form.startTime,
                endTime: form.endTime,
                maxPatients: Number(form.capacity),
                sessionType,
                timeSlots: selectedSlots,
            });
            setToast({ type: 'success', message: 'Session created successfully!' });
            setTimeout(() => navigate('/' + role + '/sessions'), 1800);
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create session.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setForm({ doctor: role === 'doctor' ? currentUser.id : '', room: '', capacity: '12', startTime: '09:00 AM', endTime: '05:00 PM', autoIntervals: true });
        setSessionType('In-Person');
        setSelectedSlots(['09:00 AM']);
        setSelectedDate(null);
        setErrors({});
        setToast({ type: 'success', message: 'Form reset successfully.' });
    };

    const rangeLabel = selectedDate
        ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No date selected';

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans flex text-[#0f172a]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <Sidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen">

                {/* Header */}
                <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100 z-10 shrink-0">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/' + role + '/dashboard')}>
                        <div className="bg-blue-600 text-white p-1 rounded-md">
                            <PlusSquare size={20} />
                        </div>
                        <span className="text-[18px] font-bold">Behealthy</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white transition-all">
                            <div className="text-right">
                                <p className="text-[12px] font-bold text-[#0f172a] leading-none">Admin Portal</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">St. Mary's Hospital</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10 max-w-[1200px] w-full mx-auto flex-1 flex flex-col">

                    <div className="mb-10">
                        <p className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Calendar size={14} /> Scheduling Module
                        </p>
                        <h1 className="text-[36px] font-black mb-2 tracking-tight">Set Consulting Hours</h1>
                        <p className="text-gray-500 font-medium text-[16px]">
                            Create and manage recurring or one-time consulting sessions for medical staff. Ensure room availability and patient capacity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-10 items-start">

                        <div className="space-y-8">
                            {/* Session Details Card */}
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                                <h2 className="text-[18px] font-black mb-8 flex items-center gap-2.5">
                                    <UserPlus size={20} className="text-blue-600" /> Session Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <label className="block text-[12px] font-black text-gray-500 mb-2 uppercase tracking-wide">Assign Doctor *</label>
                                        <select value={form.doctor} onChange={set('doctor')} className={`w-full bg-[#f8f9fa] border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all font-bold text-sm appearance-none ${errors.doctor ? 'border-red-300 focus:ring-red-100 bg-red-50/30' : 'border-gray-100 focus:ring-blue-100'}`}>
                                            <option value="">Select a doctor</option>
                                            {role === 'doctor' ? (
                                                <option value={currentUser.id}>{currentUser.fullName} ({currentUser.specialization})</option>
                                            ) : doctors.map(d => (
                                                <option key={d._id} value={d._id}>{d.fullName} ({d.specialization})</option>
                                            ))}
                                        </select>
                                        <FieldError msg={errors.doctor} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-[12px] font-black text-gray-500 uppercase tracking-wide">Consultation Room *</label>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/admin/room-allocation')}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={10} /> Assign Room
                                            </button>
                                        </div>
                                        <select value={form.room} onChange={set('room')} className={`w-full bg-[#f8f9fa] border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all font-bold text-sm appearance-none ${errors.room ? 'border-red-300 focus:ring-red-100 bg-red-50/30' : 'border-gray-100 focus:ring-blue-100'}`}>
                                            <option value="">Select a room</option>
                                            {availableRooms.map(r => (
                                                <option key={r._id} value={r._id}>{r.name || r.roomNumber} ({r.floor || r.type})</option>
                                            ))}
                                        </select>
                                        <FieldError msg={errors.room} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[12px] font-black text-gray-500 mb-2 uppercase tracking-wide">Session Type</label>
                                        <div className="flex gap-3">
                                            <button type="button"
                                                onClick={() => setSessionType('In-Person')}
                                                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${sessionType === 'In-Person' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}
                                            >
                                                <Calendar size={18} /> In-Person
                                            </button>
                                            <button type="button"
                                                onClick={() => setSessionType('Virtual')}
                                                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${sessionType === 'Virtual' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}
                                            >
                                                <Monitor size={18} /> Virtual
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-black text-gray-500 mb-2 uppercase tracking-wide">Patient Capacity *</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1" max="100"
                                                value={form.capacity}
                                                onChange={set('capacity')}
                                                className={`w-full bg-[#f8f9fa] border rounded-xl pl-5 pr-16 py-4 focus:outline-none focus:ring-2 font-bold ${errors.capacity ? 'border-red-300 focus:ring-red-100 bg-red-50/30' : 'border-gray-100 focus:ring-blue-100'}`}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">patients</span>
                                        </div>
                                        <FieldError msg={errors.capacity} />
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots Card */}
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-[#0f172a]">
                                <h2 className="text-[18px] font-black mb-8 flex items-center gap-2.5">
                                    <Clock size={20} className="text-blue-600" /> Time Slots
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-[#0f172a]">
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-widest">Start Time *</label>
                                        <input
                                            type="text"
                                            value={form.startTime}
                                            onChange={set('startTime')}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="e.g. 09:00 AM"
                                            className={`w-full bg-[#f8f9fa] border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 font-bold text-sm ${errors.startTime ? 'border-red-300 focus:ring-red-100 bg-red-50/30' : 'border-gray-100 focus:ring-blue-100'}`}
                                        />
                                        <FieldError msg={errors.startTime} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-widest">End Time *</label>
                                        <input
                                            type="text"
                                            value={form.endTime}
                                            onChange={set('endTime')}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="e.g. 05:00 PM"
                                            className={`w-full bg-[#f8f9fa] border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 font-bold text-sm ${errors.endTime ? 'border-red-300 focus:ring-red-100 bg-red-50/30' : 'border-gray-100 focus:ring-blue-100'}`}
                                        />
                                        <FieldError msg={errors.endTime} />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Or Select Quick Slots</p>
                                        {errors.slots && <p className="text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle size={12} /> {errors.slots}</p>}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {quickSlots.map(slot => (
                                            <button
                                                type="button"
                                                key={slot}
                                                onClick={() => toggleSlot(slot)}
                                                className={`px-5 py-3 rounded-full text-[13px] font-bold border transition-all ${selectedSlots.includes(slot) ? 'bg-[#0a2540] border-[#0a2540] text-white shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                        {selectedSlots.filter(s => !quickSlots.includes(s)).map(s => (
                                            <button type="button" key={s} onClick={() => toggleSlot(s)}
                                                className="px-5 py-3 rounded-full text-[13px] font-bold border bg-[#0a2540] border-[#0a2540] text-white shadow-md">{s}</button>
                                        ))}
                                        {showCustomInput ? (
                                            <div className="flex gap-2">
                                                <input value={customSlot} onChange={e => setCustomSlot(e.target.value)} placeholder="e.g. 04:30 PM" className="border border-gray-200 rounded-full px-4 py-2 text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 w-32" />
                                                <button type="button" onClick={() => { if (customSlot) { toggleSlot(customSlot); setCustomSlot(''); setShowCustomInput(false); } }} className="bg-blue-600 text-white rounded-full px-4 py-2 text-xs font-bold">Add</button>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => setShowCustomInput(true)} className="px-5 py-3 rounded-full text-[13px] font-bold border border-blue-200 text-blue-600 bg-blue-50 flex items-center gap-2 hover:bg-blue-100 transition-colors">
                                                <Plus size={16} /> Add Custom
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={form.autoIntervals} onChange={e => setForm(f => ({ ...f, autoIntervals: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-100" id="intervals" />
                                    <label htmlFor="intervals" className="text-[14px] font-bold text-gray-600">Generate 30-minute intervals automatically between selected range</label>
                                </div>
                            </div>
                        </div>

                        {/* Date Selection Card */}
                        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col h-full shrink-0">
                            <h2 className="text-[18px] font-black mb-8 flex items-center gap-2.5">
                                <Calendar size={20} className="text-blue-600" /> Date Selection
                            </h2>

                            <div className="flex items-center justify-between mb-8">
                                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20} /></button>
                                <h3 className="font-black text-[16px]">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} /></button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-8 text-center shrink-0">
                                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                    <span key={day} className="text-[10px] font-black text-gray-400 tracking-widest mb-4">{day}</span>
                                ))}
                                {days.map((dayObj, i) => {
                                    const isMuted = dayObj.month !== 'current';
                                    const isSelected = !isMuted && selectedDate && selectedDate.getDate() === dayObj.day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
                                    return (
                                        <button
                                            type="button"
                                            key={i}
                                            onClick={() => handleDateClick(dayObj)}
                                            className={`h-10 w-full flex items-center justify-center text-[13px] font-bold rounded-lg transition-colors
                                                ${isMuted ? 'text-gray-200 cursor-default' : 'text-gray-700 hover:bg-blue-50 cursor-pointer'}
                                                ${isSelected ? 'bg-[#0a2540] text-white shadow-lg' : ''}
                                            `}
                                        >
                                            {dayObj.day}
                                        </button>
                                    );
                                })}
                            </div>

                            {errors.date && (
                                <p className="text-red-500 text-[11px] font-bold mb-4 flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.date}
                                </p>
                            )}

                            <div className={`rounded-2xl p-5 mb-8 ${selectedDate ? 'bg-blue-50 border border-blue-100' : 'bg-[#f8f9fa]'}`}>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-tight">Date Selected</p>
                                <p className="text-[14px] font-bold leading-tight">{rangeLabel}</p>
                            </div>

                            <div className="space-y-4 mt-auto">
                                <button
                                    type="button"
                                    onClick={handleInitialize}
                                    disabled={submitting}
                                    className="w-full bg-[#0a2540] hover:bg-[#1e293b] disabled:opacity-60 text-white py-4 rounded-2xl font-black shadow-[0_10px_30px_-5px_rgba(10,37,64,0.3)] flex items-center justify-center gap-3 transition-all"
                                >
                                    {submitting
                                        ? <span className="flex items-center gap-3"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Initializing...</span>
                                        : <><FileText size={18} /> Initialize Session</>
                                    }
                                </button>
                                <button type="button" onClick={handleReset} className="w-full bg-white border border-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                                    <RotateCcw size={18} /> Reset Form
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Footer Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100 max-w-[1200px]">
                        <div className="bg-white border-l-4 border-blue-600 rounded-xl p-6 shadow-sm">
                            <p className="text-[12px] font-bold text-gray-400 mb-1">Total Sessions Today</p>
                            <h3 className="text-[32px] font-black leading-none">24</h3>
                        </div>
                        <div className="bg-white border-l-4 border-green-500 rounded-xl p-6 shadow-sm">
                            <p className="text-[12px] font-bold text-gray-400 mb-1">Available Slots</p>
                            <h3 className="text-[32px] font-black leading-none">112</h3>
                        </div>
                        <div className="bg-white border-l-4 border-orange-500 rounded-xl p-6 shadow-sm">
                            <p className="text-[12px] font-bold text-gray-400 mb-1">Cancellations Today</p>
                            <h3 className="text-[32px] font-black leading-none">0</h3>
                        </div>
                    </div>

                    {/* Final Site Footer */}
                    <div className="mt-20 flex flex-col md:flex-row items-center justify-between text-[13px] font-medium text-gray-400 pb-10">
                        <p>© 2026 behealthyPro Systems. All rights reserved.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <button className="hover:text-[#0f172a] transition-colors">Support</button>
                            <button className="hover:text-[#0f172a] transition-colors">System Logs</button>
                            <button className="hover:text-[#0f172a] transition-colors">Security Policy</button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default NewSession;
