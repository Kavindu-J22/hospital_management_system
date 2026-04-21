import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, Search, ArrowLeft, 
  Loader, AlertCircle, Bell 
} from 'lucide-react';
import { doctorAPI, sessionAPI, appointmentAPI } from '../../services/api';
import Toast from '../../components/shared/Toast';

import PatientSidebar from '../../components/patient/PatientSidebar';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const initialSpecialization = location.state?.specialization || '';
  
  const [step, setStep] = useState(1); // 1: Specialization, 2: Doctor, 3: Session, 4: Confirm
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [specializations, setSpecializations] = useState([]);

  // Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await doctorAPI.getSpecializations();
        setSpecializations(res.data.data || []);
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setError('Failed to load specializations');
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch doctors when specialization is selected
  useEffect(() => {
    if (specialization && step === 2) {
      const fetchDoctors = async () => {
        setLoading(true);
        try {
          const res = await doctorAPI.getPublic({
            specialization,
            limit: 100
          });
          setDoctors(res.data.data || []);
          if ((res.data.data || []).length === 0) {
            setError('No doctors available for this specialization');
          } else {
            setError('');
          }
        } catch (err) {
          console.error('Error fetching doctors:', err);
          setError('Failed to load doctors');
        } finally {
          setLoading(false);
        }
      };
      fetchDoctors();
    }
  }, [specialization, step]);

  // Fetch sessions when doctor is selected
  useEffect(() => {
    if (selectedDoctor && step === 3) {
      const fetchSessions = async () => {
        setLoading(true);
        try {
          // No status param → backend returns upcoming/active sessions with available slots
          const res = await sessionAPI.getByDoctor(selectedDoctor._id);
          const sessions = res.data.data || [];
          setSessions(sessions);
          if (sessions.length === 0) {
            setError('No available sessions for this doctor. Please try another doctor.');
          } else {
            setError('');
          }
        } catch (err) {
          console.error('Error fetching sessions:', err);
          setError('Failed to load sessions');
        } finally {
          setLoading(false);
        }
      };
      fetchSessions();
    }
  }, [selectedDoctor, step]);

  const handleSelectSpecialization = (spec) => {
    setSpecialization(spec);
    setSelectedDoctor(null);
    setSelectedSession(null);
    setStep(2);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSession(null);
    setStep(3);
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setStep(4);
  };

  const handleBookAppointment = async () => {
    if (!selectedSession || !selectedDoctor) {
      setError('Please select a session');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patientId: user.id,
        doctorId: selectedDoctor._id,
        sessionId: selectedSession._id,
        department: specialization,
        specialization: specialization,
        appointmentDate: selectedSession.date,
        timeSlot: `${selectedSession.startTime} - ${selectedSession.endTime}`,
        notes: notes,
        bookingSource: 'web'
      };

      const res = await appointmentAPI.create(appointmentData);
      setToast({ type: 'success', message: 'Appointment booked successfully!' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.message || 'Failed to book appointment');
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to book appointment' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    } else {
      navigate('/specializations');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
      <PatientSidebar />

      <div className="flex-1 ml-64">
        {/* Topbar */}
        <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Book an Appointment</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Step {step} of 4</p>
            </div>
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

        {/* Main Content */}
        <main className="p-8 max-w-[1000px] mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Specialization */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Select a Specialization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specializations.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-gray-500">
                    <Loader className="animate-spin mx-auto mb-2" size={24} />
                    <p className="font-medium italic">Loading specializations...</p>
                  </div>
                ) : (
                  specializations.map(spec => (
                    <button
                      key={spec}
                      onClick={() => handleSelectSpecialization(spec)}
                      className="p-5 border border-gray-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left font-bold text-gray-800 shadow-sm"
                    >
                      {spec}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Doctor Selection */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Select a Doctor</h2>
              <p className="text-gray-500 font-medium mb-8">Specialization: <span className="text-blue-600 font-bold">{specialization}</span></p>
              
              {loading ? (
                <div className="py-12 text-center text-gray-500">
                  <Loader className="animate-spin mx-auto mb-2" size={24} />
                  <p className="italic">Finding specialists for you...</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">No doctors available for this specialization at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {doctors.map(doctor => (
                    <button
                      key={doctor._id}
                      onClick={() => handleSelectDoctor(doctor)}
                      className="p-5 border border-gray-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left group shadow-sm"
                    >
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl overflow-hidden border border-blue-100 shadow-sm flex-shrink-0">
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doctor.fullName}&backgroundColor=e0f2fe`} alt={doctor.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{doctor.fullName}</h3>
                          <p className="text-sm font-bold text-blue-600/70 mb-2 uppercase tracking-wide">{doctor.specialization}</p>
                          {doctor.bio && <p className="text-sm text-gray-500 line-clamp-2">{doctor.bio}</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Session Selection */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Select a Session</h2>
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedDoctor?.fullName}&backgroundColor=f8fafc`} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold leading-tight">Booking with <span className="text-gray-900">{selectedDoctor?.fullName}</span></p>
                  <p className="text-xs text-blue-600 font-black uppercase tracking-widest">{specialization}</p>
                </div>
              </div>
              
              {loading ? (
                <div className="py-12 text-center text-gray-500">
                  <Loader className="animate-spin mx-auto mb-2" size={24} />
                  <p className="italic">Checking availability...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">No active sessions found for this doctor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {sessions.map(session => {
                    const maxP = session.maxPatients || 12;
                    const curP = session.currentPatients || 0;
                    const available = maxP - curP;
                    return (
                      <button
                        key={session._id}
                        onClick={() => handleSelectSession(session)}
                        className="p-6 border border-gray-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left shadow-sm group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={16} className="text-blue-600" />
                              <span className="font-black text-gray-900 tracking-tight">
                                {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock size={16} className="text-gray-400" />
                              <span className="text-gray-600 font-bold text-sm">{session.startTime} - {session.endTime}</span>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-md mb-2 ${
                              available > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                            }`}>
                              {available > 0 ? 'Slots Available' : 'Session Full'}
                            </span>
                            <p className={`text-xl font-black ${
                              available > 5 ? 'text-blue-600' : available > 0 ? 'text-orange-500' : 'text-red-500'
                            }`}>{available} / {maxP}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm Booking */}
          {step === 4 && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Confirm Booking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Medical Specialist</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedDoctor?.fullName}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Specialization</p>
                  <p className="font-bold text-blue-600 text-lg">{specialization}</p>
                </div>
                <div className="p-5 bg-[#0f172a] rounded-2xl text-white col-span-2 flex justify-between items-center shadow-lg">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="font-bold text-lg">
                      {new Date(selectedSession?.date).toLocaleDateString()} · {selectedSession?.startTime}
                    </p>
                  </div>
                  <Calendar size={24} className="text-slate-500" />
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-[13px] font-black text-gray-400 uppercase tracking-widest mb-3">Reason for Visit (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the doctor a bit about your symptoms..."
                  className="w-full border border-gray-100 bg-[#f8fafc] rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium"
                  rows={4}
                />
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_-5px_rgba(37,99,235,0.3)]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader className="animate-spin" size={20} /> Processing...
                  </span>
                ) : 'Complete Appointment Booking'}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex gap-4 justify-center">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-10 py-3.5 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-900 transition-all text-sm"
              >
                Back to Previous Step
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BookAppointment;
