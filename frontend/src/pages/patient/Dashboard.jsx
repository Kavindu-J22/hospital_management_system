import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Calendar, FileText, CreditCard,
    Search, Bell, FileStack, Pill, FileSignature,
    Clock, User, ScanLine, AlertTriangle, CalendarDays, Check,
    MessageSquareText, X, Send, Store
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../../services/api';
import PatientSidebar from '../../components/patient/PatientSidebar';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const [apptRes, prescRes] = await Promise.all([
                    appointmentAPI.getAll({ patientId: user.id }),
                    prescriptionAPI.getByPatient(user.id),
                ]);
                setAppointments(apptRes.data.data || []);
                setPrescriptions(prescRes.data.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const upcoming = appointments.filter(a => ['Pending','Confirmed'].includes(a.status));
    const nextAppt = upcoming[0];

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
            <PatientSidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
                {/* Topbar */}
                <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="w-[400px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search records, doctors..."
                            className="w-full bg-[#f8f9fa] border border-transparent rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer">
                            <div className="text-right">
                                <p className="font-bold text-gray-900 text-sm">{user?.fullName || 'Patient'}</p>
                                <p className="text-xs text-gray-500 font-medium">Patient ID: #{user?.patientId || '—'}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName}&backgroundColor=fef3c7`} alt={user?.fullName} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-8 max-w-[1200px] mx-auto hidden lg:block overflow-hidden relative">

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-1 tracking-tight">Welcome back, {user?.fullName?.split(' ')[0] || 'Patient'}</h1>
                        <p className="text-gray-500 font-medium text-[15px]">You have {upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}.</p>
                    </div>

                    <div className="flex gap-8">
                        {/* Left Column (Main) */}
                        <div className="flex-1 max-w-[65%]">
                            {/* Upcoming */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[17px] font-bold text-[#0f172a] flex items-center gap-2">
                                    <CalendarDays size={18} className="text-blue-600" />
                                    Upcoming Appointment
                                </h2>
                                <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">View All</a>
                            </div>

                            {loading ? (
                                <div className="bg-white rounded-2xl p-6 h-28 animate-pulse border border-gray-100 mb-8" />
                            ) : nextAppt ? (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-xl overflow-hidden shadow-sm">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${nextAppt.doctorName}&backgroundColor=e0f2fe`} alt={nextAppt.doctorName} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{nextAppt.doctorName}</h3>
                                        <p className="text-blue-600 text-sm font-medium mb-1">{nextAppt.department}</p>
                                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                                            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" /> {new Date(nextAppt.appointmentDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> {nextAppt.timeSlot || '—'}</span>
                                            <span className="font-bold text-blue-600">#{nextAppt.ticketNumber}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {!nextAppt.attendanceConfirmed && (
                                        <button onClick={async () => { await appointmentAPI.confirm(nextAppt._id); window.location.reload(); }}
                                            className="bg-[#0f172a] text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-800 transition-colors">
                                            Confirm
                                        </button>
                                    )}
                                    <button onClick={async () => { await appointmentAPI.cancel(nextAppt._id); window.location.reload(); }}
                                        className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8 text-center text-gray-400 font-medium">No upcoming appointments. <button onClick={() => navigate('/specializations')} className="text-blue-600 hover:underline">Book one now →</button></div>
                            )}

                            {/* Patient Overview */}
                            <div className="mb-4">
                                <h2 className="text-[17px] font-bold text-[#0f172a] flex items-center gap-2">
                                    <User size={18} className="text-blue-600" />
                                    Patient Overview
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-[#f0f6ff] rounded-2xl p-5 border border-blue-50">
                                    <p className="text-blue-800/60 text-xs font-bold uppercase tracking-wider mb-2">Patient Name</p>
                                    <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{user?.fullName?.split(' ').slice(0,-1).join(' ') || '—'}<br />{user?.fullName?.split(' ').pop() || ''}</h3>
                                    <p className="text-blue-600 font-bold text-sm bg-white inline-block px-2 py-1 rounded-md mt-2 shadow-sm">ID: #{user?.patientId || '—'}</p>
                                </div>
                                <div className="bg-[#fff7ed] rounded-2xl p-5 border border-orange-50">
                                    <p className="text-orange-800/60 text-xs font-bold uppercase tracking-wider mb-2">Appointments</p>
                                    <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{appointments.length} Total</h3>
                                    <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs mt-3">
                                        <Calendar size={13} />
                                        <span className="uppercase tracking-wide">{upcoming.length} Upcoming</span>
                                    </div>
                                </div>
                                <div className="bg-[#f0fdf4] rounded-2xl p-5 border border-green-50">
                                    <p className="text-green-800/60 text-xs font-bold uppercase tracking-wider mb-2">Prescriptions</p>
                                    <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{prescriptions.length} Total</h3>
                                    <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs mt-3">
                                        <Check size={14} />
                                        <span className="uppercase tracking-wide">{prescriptions.filter(p => p.status === 'Active').length} Active</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="flex-1 max-w-[35%]">

                            {/* Queue Status */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[17px] font-bold text-[#0f172a] flex items-center gap-2">
                                    <FileStack size={18} className="text-blue-600" />
                                    Live Queue Status
                                </h2>
                            </div>

                            <div className="bg-[#1e293b] rounded-2xl p-6 text-white mb-8 shadow-md relative overflow-hidden">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Your Ticket</p>
                                        <h3 className="text-4xl font-black tracking-tight">#A-124</h3>
                                    </div>
                                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                        <ScanLine size={24} className="text-white/80" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-slate-400 text-sm font-medium">Current Status</p>
                                        <p className="font-bold text-lg">2 people ahead</p>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[70%] rounded-full relative">
                                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20"></div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 flex justify-between items-center border border-slate-700">
                                        <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
                                            <Clock size={16} />
                                            Estimated wait
                                        </div>
                                        <span className="font-bold">~12 mins</span>
                                    </div>
                                </div>
                            </div>


                            {/* Activities */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[17px] font-bold text-[#0f172a] flex items-center gap-2">
                                    <Clock size={18} className="text-blue-600" />
                                    Recent Activities
                                </h2>
                            </div>

                            <div className="space-y-3">

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 text-gray-500 p-2.5 rounded-xl border border-gray-100">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-[15px] mb-0.5">Lab Result Ready</h4>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Blood Test - Cardiology Unit</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">2 hours ago</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 text-gray-500 p-2.5 rounded-xl border border-gray-100">
                                        <Pill size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-[15px] mb-0.5">Prescription Renewed</h4>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Atorvastatin 20mg</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Yesterday</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 text-gray-500 p-2.5 rounded-xl border border-gray-100">
                                        <FileSignature size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-[15px] mb-0.5">Invoice Paid</h4>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Transaction ID #44921</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Oct 20, 2023</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </main>

                {/* Mobile fallback view message */}
                <div className="lg:hidden p-8 text-center text-gray-500 mt-20">
                    Please view on a larger screen layout. Mobile layout implementation skipped for brevity.
                </div>
            </div>

            {/* AI Chatbot Floating Action */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
                {isChatOpen && (
                    <div className="bg-white w-[360px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 mb-6 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Chat Header */}
                        <div className="bg-[#0859df] text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/20 flex items-center justify-center rounded-full">
                                    <MessageSquareText size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm leading-tight">Behealthy AI Assistant</h4>
                                    <p className="text-[11px] text-blue-100">Always online to help</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full hover:bg-white/20">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-5 bg-slate-50 overflow-y-auto space-y-4">
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#0859df]/10 flex items-center justify-center flex-shrink-0">
                                    <MessageSquareText size={15} className="text-[#0859df]" />
                                </div>
                                <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-bl-sm text-sm text-gray-700 shadow-sm max-w-[85%]">
                                    Hello Alex! 👋 How can I assist you with your health or appointments today?
                                </div>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-full pl-5 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-[#0859df]/20 focus-within:border-[#0859df] transition-all overflow-hidden">
                                <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 py-1" />
                                <button className="w-9 h-9 flex items-center justify-center bg-[#0859df] rounded-full text-white hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0">
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Toggle Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-16 h-16 bg-[#0859df] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 transition-transform active:scale-95"
                >
                    {isChatOpen ? <X size={28} /> : <MessageSquareText size={32} strokeWidth={2} />}
                </button>
            </div>

        </div>
    );
};

export default Dashboard;
