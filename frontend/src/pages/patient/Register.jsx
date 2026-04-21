import React, { useState } from 'react';
import { User, FileText, Asterisk, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', dateOfBirth: '', gender: '', email: '', contactNumber: '', address: '', nic: '', password: '', emergencyName: '', emergencyRelationship: '', emergencyPhone: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                fullName: form.fullName, dateOfBirth: form.dateOfBirth, gender: form.gender,
                email: form.email, contactNumber: form.contactNumber, address: form.address,
                nic: form.nic, password: form.password,
                emergencyContact: { name: form.emergencyName, relationship: form.emergencyRelationship, phone: form.emergencyPhone }
            };
            const res = await authAPI.patientRegister(payload);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/specializations');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans pb-16">
            {/* Navbar */}
            <nav className="bg-white px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white p-1 rounded-md">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Behealthy</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <a href="#" className="hover:text-blue-600">Find a Doctor</a>
                    <a href="#" className="hover:text-blue-600">Services</a>
                    <a href="#" className="hover:text-blue-600">Locations</a>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#001f5c] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm">
                        Log In
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 mt-12 mb-20 relative">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2 tracking-wider">
                        <ShieldCheck size={18} />
                        SECURE REGISTRATION
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Self-Service Patient Registration</h1>
                    <p className="text-gray-600 text-lg">
                        Please provide your details accurately to create your digital health record. Your information is encrypted and secure.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleCreateAccount} className="space-y-10">

                        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}
                        {/* Personal Information */}
                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-6">
                                <User className="text-blue-600" size={20} />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Full Legal Name</label>
                                    <input type="text" name="fullName" placeholder="e.g. Johnathan Quincy Doe" value={form.fullName} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">NIC</label>
                                    <input type="text" name="nic" placeholder="901125-1111111" value={form.nic} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Date of Birth</label>
                                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Gender</label>
                                    <select name="gender" value={form.gender} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                        <option value="" disabled>Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                                    <input type="password" name="password" placeholder="Set a secure password" value={form.password} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                            </div>
                        </section>

                        {/* Contact Details */}
                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-6 border-t border-gray-100 pt-8">
                                <FileText className="text-blue-600" size={20} />
                                Contact Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                                    <input type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                                    <input type="tel" name="contactNumber" placeholder="+94 71 234 5678" value={form.contactNumber} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Residential Address</label>
                                    <input type="text" name="address" placeholder="Street address, City" value={form.address} onChange={handleChange} required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                            </div>
                        </section>

                        {/* Emergency Contact */}
                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-6 border-t border-gray-100 pt-8">
                                <Asterisk className="text-blue-600" size={20} />
                                Emergency Contact
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Contact Person Name</label>
                                    <input type="text" name="emergencyName" placeholder="Full name of emergency contact" value={form.emergencyName} onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Relationship</label>
                                    <input type="text" name="emergencyRelationship" placeholder="e.g. Spouse, Parent, Friend" value={form.emergencyRelationship} onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Emergency Phone</label>
                                    <input type="tel" name="emergencyPhone" placeholder="+94 77 123 4567" value={form.emergencyPhone} onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                                </div>
                            </div>
                        </section>

                        {/* Footer Form & Submit */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3 mb-8">
                                <input type="checkbox" id="terms" required className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the <a href="#" className="font-semibold text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-blue-600 hover:underline">Privacy Policy</a> regarding my medical data.
                                </label>
                            </div>
                            <div className="flex items-center gap-4">
                                <button type="submit" disabled={loading}
                                    className="flex-1 max-w-[500px] flex items-center justify-center gap-2 bg-[#0A2558] text-white py-3.5 rounded-lg font-semibold hover:bg-[#081a40] transition-colors shadow-sm text-lg disabled:opacity-60">
                                    {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={20} />
                                </button>
                                <button type="button" onClick={() => navigate('/')} className="px-8 py-3.5 rounded-lg font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-lg">
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8 mb-24">
                    © 2024 HealthPortal Hospital System. All rights reserved. Your privacy is our priority.
                </p>

            </main>

            {/* Floating Chat Bot */}
            <div className="fixed bottom-6 right-6 flex items-end gap-3 z-50">
                <div className="bg-white p-4 rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-1 max-w-[260px]">
                    <h4 className="font-bold text-gray-900 flex justify-between">Need help? <button className="text-gray-400 hover:text-gray-600">&times;</button></h4>
                    <p className="text-xs text-gray-600 mt-1">Ask me anything about the registration process!</p>
                </div>
                <button className="h-14 w-14 bg-[#0A2558] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#081a40] transition-colors">
                    <MessageSquare size={24} />
                </button>
            </div>

        </div>
    );
};

export default Register;
