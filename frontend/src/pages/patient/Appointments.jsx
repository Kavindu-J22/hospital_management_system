import React, { useState, useEffect } from 'react';
import { Calendar, Clock, LayoutDashboard, CheckCircle, XCircle, Search } from 'lucide-react';
import { appointmentAPI } from '../../services/api';
import PatientSidebar from '../../components/patient/PatientSidebar';

const Appointments = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.id) return;
            try {
                const res = await appointmentAPI.getAll({ patientId: user.id });
                setAppointments(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [user?.id]);

    const handleConfirm = async (id) => {
        try {
            await appointmentAPI.confirm(id);
            setAppointments(appointments.map(a => a._id === id ? { ...a, attendanceConfirmed: true } : a));
        } catch (err) {
            console.error('Error confirming appointment:', err);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await appointmentAPI.cancel(id);
            setAppointments(appointments.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a));
        } catch (err) {
            console.error('Error cancelling appointment:', err);
        }
    };

    const filteredAppointments = appointments.filter(a => 
        (a.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.ticketNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
            <PatientSidebar />
            
            <div className="flex-1 ml-64">
                <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="w-[400px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-transparent rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                    </div>
                </header>

                <main className="p-8 max-w-[1200px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Your Appointments</h1>
                        <p className="text-gray-500 font-medium text-[15px]">Manage and view your upcoming and past medical appointments.</p>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredAppointments.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Appointments Found</h3>
                                    <p className="text-gray-500">You haven't booked any appointments yet or none match your search.</p>
                                </div>
                            ) : (
                                filteredAppointments.map((appt) => (
                                    <div key={appt._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-blue-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${appt.doctorName || 'Doctor'}&backgroundColor=e0f2fe`} alt={appt.doctorName} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{appt.doctorName}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(appt.status)}`}>
                                                        {appt.status}
                                                    </span>
                                                </div>
                                                <p className="text-blue-600 text-sm font-medium mb-3">{appt.department || 'General'}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {new Date(appt.appointmentDate).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {appt.timeSlot || '—'}</span>
                                                    <span className="flex items-center gap-1.5"><LayoutDashboard size={14} className="text-gray-400" /> Ticket: <span className="text-blue-600 font-bold">#{appt.ticketNumber}</span></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                            {!appt.attendanceConfirmed && ['Pending', 'Confirmed'].includes(appt.status) && (
                                                <button 
                                                    onClick={() => handleConfirm(appt._id)}
                                                    className="w-full sm:w-auto bg-[#0f172a] text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={18} /> Confirm
                                                </button>
                                            )}
                                            {['Pending', 'Confirmed'].includes(appt.status) && (
                                                <button 
                                                    onClick={() => handleCancel(appt._id)}
                                                    className="w-full sm:w-auto bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={18} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Appointments;
