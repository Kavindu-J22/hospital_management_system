import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../assets/Oncology patient-pana.png';
import { authAPI } from '../../services/api';

const Login = () => {
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
            const res = await authAPI.patientLogin({ nic, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/specializations');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left side Form */}
            <div className="flex flex-col flex-1 px-12 py-16 lg:px-24">
                <div className="flex-1 max-w-md w-full mx-auto justify-center flex flex-col pt-12">
                    <button
                        onClick={handleBackHome}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-1"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-5xl font-bold mb-4 text-black tracking-tight">Patient Login</h1>
                    <p className="text-gray-600 mb-12 text-lg">Be healthy</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">NIC</label>
                            <input
                                type="text"
                                placeholder="901125-1111111"
                                value={nic}
                                onChange={(e) => setNic(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="flex-1 bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-8 mt-12 w-full max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Contact us</h3>
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="font-medium">Email</span>
                            <span>info@behealthy.com</span>
                        </div>
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="font-medium">Number</span>
                            <span>+94 11 029 4203</span>
                        </div>
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="font-medium">Fax</span>
                            <span>123456657768</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side Image (Hidden on small screens) */}
            <div className="hidden lg:flex flex-1 relative bg-[#9aa2c8] overflow-hidden items-center justify-center">
                <img
                    src={loginImage}
                    alt="Patient receiving IV drip"
                    className="relative z-10 w-[80%] max-w-[600px] object-contain"
                />
                <div className="absolute right-8 bottom-8 text-indigo-900/60 font-medium text-xl">
                    #Behealthy
                </div>
            </div>
        </div>
    );
};

export default Login;
