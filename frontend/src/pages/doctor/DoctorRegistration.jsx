import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Bell, ChevronLeft, ArrowRight, ShieldPlus } from 'lucide-react';
import { authAPI } from '../../services/api';

const DoctorRegistration = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', specialization: '', contactNumber: '', email: '', yearsOfExperience: '', licenseNumber: '', nic: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            const res = await authAPI.doctorRegister(form);
            setSuccess(res.data.message || 'Registration submitted! Pending admin approval.');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8f9fa] font-sans">

            {/* Topbar */}
            <header className="bg-white px-8 py-3.5 flex items-center justify-between shadow-sm shrink-0 z-10 w-full relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-blue-600 text-white p-1 rounded-md">
                        <ShieldPlus size={20} />
                    </div>
                    <span className="text-[18px] font-bold text-[#0f172a]">Behealthy</span>
                </div>

                <div className="flex items-center gap-4 text-gray-500">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-50 border border-gray-100">
                        <Bell size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-50 border border-gray-100">
                        <User size={18} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 relative overflow-hidden">
                {/* Left Green Section */}
                <div className="hidden lg:flex flex-col flex-1 max-w-[450px] bg-[#0c3812] px-12 py-16 justify-between text-white relative z-0">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-6 leading-[1.15] tracking-tight">Empowering<br />Healthcare<br />Excellence</h1>
                        <p className="text-[#a4cca2] font-medium leading-relaxed pr-6 text-[15px]">
                            Join our digital ecosystem designed to streamline patient care, manage appointments, and enhance medical workflows.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 border-t border-[#1a4a22] pt-6 mt-12">
                        <div className="bg-[#1a4a22] p-2.5 rounded-xl border border-[#2a5a32]">
                            <ShieldCheck size={26} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[15px] mb-0.5">Secure & Compliant</h4>
                            <p className="text-xs text-[#a4cca2] uppercase tracking-wider font-semibold">HIPAA & GDPR Ready</p>
                        </div>
                    </div>
                </div>

                {/* Right Form Container */}
                <div className="flex-1 flex flex-col pt-12 px-6 lg:px-12 items-center bg-[#f4f7fb]">
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-10 w-full max-w-2xl border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-[#0f172a] mb-2 tracking-tight">Doctor Registration</h2>
                            <p className="text-gray-500 font-medium text-sm">Fill in your professional details to create your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}
                            {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">{success}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Full Name</label>
                                    <input type="text" name="fullName" placeholder="Dr. Jane Smith" value={form.fullName} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Specialization</label>
                                    <select name="specialization" value={form.specialization} onChange={handleChange} required
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium appearance-none">
                                        <option value="">Select Specialty</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="Endocrinology">Endocrinology</option>
                                        <option value="General Medicine">General Medicine</option>
                                        <option value="Radiology">Radiology</option>
                                        <option value="ENT">ENT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Contact Number</label>
                                    <input type="tel" name="contactNumber" placeholder="+94 71 234 5678" value={form.contactNumber} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Email Address</label>
                                    <input type="email" name="email" placeholder="jane.smith@hospital.com" value={form.email} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">NIC</label>
                                    <input type="text" name="nic" placeholder="880120-1234567" value={form.nic} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Years of Experience</label>
                                    <input type="number" name="yearsOfExperience" placeholder="e.g. 10" value={form.yearsOfExperience} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Medical License Number</label>
                                    <input type="text" name="licenseNumber" placeholder="LIC-12345678" value={form.licenseNumber} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Password</label>
                                    <input type="password" name="password" placeholder="Set a secure password" value={form.password} onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:border-green-700 text-sm font-medium" required />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" disabled={loading || !!success}
                                    className="w-full bg-[#0c3812] text-white py-4 rounded-xl font-bold hover:bg-[#1a4a22] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 disabled:opacity-60">
                                    {loading ? 'Submitting...' : 'Submit Registration'} <ArrowRight size={18} />
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/doctor')}
                                    className="text-blue-600 font-bold hover:underline text-sm flex items-center justify-center gap-1 mx-auto"
                                >
                                    <ChevronLeft size={16} /> Back to Login
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Compact Footer */}
                    <div className="w-full max-w-2xl mt-12 pb-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                        <div className="space-y-4 mb-4 md:mb-0">
                            <h3 className="text-lg font-bold text-[#0f172a]">Contact us</h3>
                            <div className="space-y-2 font-medium">
                                <p><span className="w-20 inline-block">Email</span> info@behealthy.com</p>
                                <p><span className="w-20 inline-block">Number</span> +94 11 029 4203</p>
                                <p><span className="w-20 inline-block">Fax</span> 123456657768</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-4 mt-8">
                            <span className="font-extrabold text-[#0f172a] text-xl">#Behealthy</span>
                            <div className="flex gap-4 font-medium text-xs">
                                <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
                                <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
                                <a href="#" className="hover:text-blue-600 transition">Contact Support</a>
                            </div>
                            <span className="text-xs">&copy; 2026 Behealthy Portal. All rights reserved.</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorRegistration;
