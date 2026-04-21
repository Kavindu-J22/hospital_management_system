import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Search, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { doctorAPI, sessionAPI, appointmentAPI } from '../../services/api';
import Toast from '../../components/shared/Toast';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
            <p className="text-sm text-gray-500">Step {step} of 4</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Specialization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specializations.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-gray-500">
                  <Loader className="animate-spin mx-auto mb-2" size={24} />
                  <p>Loading specializations...</p>
                </div>
              ) : (
                specializations.map(spec => (
                  <button
                    key={spec}
                    onClick={() => handleSelectSpecialization(spec)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left font-semibold text-gray-900"
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
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Doctor</h2>
            <p className="text-gray-600 mb-6">Specialization: <span className="font-semibold">{specialization}</span></p>
            
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                <Loader className="animate-spin mx-auto mb-2" size={24} />
                <p>Loading doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p>No doctors available for this specialization</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {doctors.map(doctor => (
                  <button
                    key={doctor._id}
                    onClick={() => handleSelectDoctor(doctor)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{doctor.fullName}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        {doctor.bio && <p className="text-sm text-gray-600 mt-1">{doctor.bio}</p>}
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
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Session</h2>
            <div className="mb-6">
              <p className="text-gray-600">Doctor: <span className="font-semibold">{selectedDoctor?.fullName}</span></p>
              <p className="text-gray-600">Specialization: <span className="font-semibold">{specialization}</span></p>
            </div>
            
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                <Loader className="animate-spin mx-auto mb-2" size={24} />
                <p>Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p>No sessions available for this doctor</p>
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
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="font-semibold text-gray-900">
                              {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-gray-600">{session.startTime} - {session.endTime}</span>
                          </div>
                          {session.roomNumber && (
                            <p className="text-xs text-gray-400 mt-1">Room: {session.roomNumber}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Available Slots</p>
                          <p className={`text-lg font-bold ${
                            available > 5 ? 'text-green-600' : available > 0 ? 'text-orange-500' : 'text-red-500'
                          }`}>{available} / {maxP}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            available > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {available > 0 ? 'Open' : 'Full'}
                          </span>
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
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-bold text-gray-900">{selectedDoctor?.fullName}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-bold text-gray-900">{specialization}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-bold text-gray-900">
                  {new Date(selectedSession?.date).toLocaleDateString()} · {selectedSession?.startTime} - {selectedSession?.endTime}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms or reason for visit..."
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
        </div>
      </main>

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
