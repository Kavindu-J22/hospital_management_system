import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const DoctorLogin = () => {
    const navigate = useNavigate();
    const [nic, setNic] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authAPI.doctorLogin({ nic, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/doctor/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate('/doctor/register');
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left side Form */}
            <div className="flex flex-col flex-1 px-12 py-16 lg:px-24">
                <div className="flex-1 max-w-md w-full mx-auto justify-center flex flex-col pt-12">
                    <h1 className="text-[44px] font-black mb-4 text-[#0f172a] tracking-tight">Doctor Login</h1>
                    <p className="text-gray-600 mb-12 text-[17px] font-medium">Be healthy</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">NIC</label>
                            <input
                                type="text"
                                placeholder="880120-1234567"
                                value={nic}
                                onChange={(e) => setNic(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-700 transition-colors text-sm font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-700 transition-colors text-sm font-medium"
                                required
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-900 transition-colors text-[14px] disabled:opacity-60"
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="flex-1 bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-900 transition-colors text-[14px]"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-8 mt-12 w-full max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Contact us</h3>
                    <div className="space-y-5 text-sm font-medium text-[#0f172a]">
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="text-gray-500">Email</span>
                            <span>info@behealthy.com</span>
                        </div>
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="text-gray-500">Number</span>
                            <span>+94 11 029 4203</span>
                        </div>
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="text-gray-500">Fax</span>
                            <span>123456657768</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side Image / Pattern */}
            <div className="hidden lg:flex flex-1 relative bg-[#95b89a] overflow-hidden items-center justify-center p-12">
                {/* Fallback pattern in case image is missing */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                {/* Expected to show doctor specific illustration if available later */}
                <img
                    src="/doctor-login-illustration.png"
                    alt="Doctors team illustration"
                    className="relative z-10 w-[85%] max-w-[600px] object-contain mix-blend-multiply drop-shadow-2xl"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute right-10 bottom-10 text-[#0c3812]/70 font-bold text-xl tracking-tight">
                    #Behealthy
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;
