import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { appointmentAPI } from '../../services/api';

const ConfirmAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const confirmAppt = async () => {
            try {
                await appointmentAPI.confirm(id);
                setStatus('success');
                setTimeout(() => navigate('/dashboard'), 3000);
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };
        confirmAppt();
    }, [id, navigate]);

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming Appointment...</h2>
                        <p className="text-gray-500">Please wait while we verify your attendance.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmed Successfully!</h2>
                        <p className="text-gray-500 mb-6">Your appointment attendance has been verified. Redirecting to dashboard...</p>
                        <Link to="/dashboard" className="text-blue-600 font-semibold hover:underline">Go to Dashboard Now</Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h2>
                        <p className="text-gray-500 mb-6">We couldn't confirm your appointment. It might be invalid or already confirmed.</p>
                        <Link to="/dashboard" className="bg-[#0f172a] text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-800 transition-colors inline-block">Return to Dashboard</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConfirmAppointment;
