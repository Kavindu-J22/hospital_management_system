import React, { useState } from 'react';
import {
    Bell, User, ShieldPlus, UserPlus, FileText,
    Phone, AlertCircle, ChevronDown, CheckCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/shared/Toast';

const FieldError = ({ msg }) => msg ? (
    <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1">
        <AlertCircle size={12} /> {msg}
    </p>
) : null;

const inputBase = (hasErr) =>
    `w-full bg-[#f8f9fa] border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-colors text-sm ${hasErr
        ? 'border-red-300 focus:ring-red-100 bg-red-50/30'
        : 'border-gray-100 focus:ring-blue-500'}`;

const NewPatient = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '', lastName: '', dob: '', gender: '',
        phone: '', email: '', address: '',
        emergencyName: '', emergencyRel: '', emergencyPhone: '',
        allergies: '', medications: '', conditions: ''
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        else if (form.firstName.trim().length < 2) e.firstName = 'Must be at least 2 characters';
        if (!form.lastName.trim()) e.lastName = 'Last name is required';
        if (!form.dob) e.dob = 'Date of birth is required';
        else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob)) e.dob = 'Use format MM/DD/YYYY';
        if (!form.gender) e.gender = 'Please select a gender';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        else if (!/^\d{7,15}$/.test(form.phone.replace(/[\s\-\+]/g, ''))) e.phone = 'Enter a valid phone number';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            setToast({ type: 'error', message: 'Please fix the highlighted errors.' });
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setToast({ type: 'success', message: `Patient ${form.firstName} ${form.lastName} registered successfully!` });
            setForm({ firstName: '', lastName: '', dob: '', gender: '', phone: '', email: '', address: '', emergencyName: '', emergencyRel: '', emergencyPhone: '', allergies: '', medications: '', conditions: '' });
            setErrors({});
            setTimeout(() => navigate('/admin/directory'), 1800);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] font-sans flex flex-col">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <header className="bg-white px-8 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-sm shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                    <div className="bg-blue-100 text-blue-600 p-1 rounded-md">
                        <ShieldPlus size={18} />
                    </div>
                    <span className="text-[17px] font-extrabold text-[#0f172a] tracking-wide">CareStream HMS</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200">
                        <Bell size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full bg-gray-50 border border-gray-200">
                        <User size={18} />
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[800px] mx-auto p-4 md:p-8 flex flex-col pt-12 pb-24">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">New Patient Registration</h1>
                    <p className="text-gray-500 font-medium text-[14px]">Complete the form below to enroll a new patient into the hospital system.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                    {/* Personal Details */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2 mb-6">
                            <User size={18} className="text-blue-600" /> Personal Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">First Name *</label>
                                <input type="text" placeholder="e.g. John" value={form.firstName} onChange={set('firstName')} className={inputBase(errors.firstName)} />
                                <FieldError msg={errors.firstName} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Last Name *</label>
                                <input type="text" placeholder="e.g. Doe" value={form.lastName} onChange={set('lastName')} className={inputBase(errors.lastName)} />
                                <FieldError msg={errors.lastName} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Date of Birth *</label>
                                <input type="text" placeholder="MM/DD/YYYY" value={form.dob} onChange={set('dob')} className={inputBase(errors.dob)} />
                                <FieldError msg={errors.dob} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Gender *</label>
                                <div className="relative">
                                    <select value={form.gender} onChange={set('gender')} className={`${inputBase(errors.gender)} appearance-none cursor-pointer`}>
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <FieldError msg={errors.gender} />
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2 mb-6">
                            <Phone className="text-blue-600" size={18} /> Contact Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Phone Number *</label>
                                <input type="text" placeholder="e.g. 0771234567" value={form.phone} onChange={set('phone')} className={inputBase(errors.phone)} />
                                <FieldError msg={errors.phone} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Email Address</label>
                                <input type="email" placeholder="john.doe@example.com" value={form.email} onChange={set('email')} className={inputBase(errors.email)} />
                                <FieldError msg={errors.email} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Residential Address</label>
                            <input type="text" placeholder="Street address, City, State, ZIP" value={form.address} onChange={set('address')} className={inputBase(false)} />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2 mb-6">
                            <AlertCircle size={18} className="text-blue-600" /> Emergency Contact
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Contact Name</label>
                                <input type="text" placeholder="Full name" value={form.emergencyName} onChange={set('emergencyName')} className={inputBase(false)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Relationship</label>
                                <input type="text" placeholder="e.g. Spouse, Parent" value={form.emergencyRel} onChange={set('emergencyRel')} className={inputBase(false)} />
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <label className="block text-xs font-bold text-gray-700 mb-2">Emergency Phone</label>
                            <input type="text" placeholder="e.g. 0779876543" value={form.emergencyPhone} onChange={set('emergencyPhone')} className={inputBase(false)} />
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2 mb-6">
                            <FileText size={18} className="text-blue-600" /> Medical History Summary
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Known Allergies</label>
                                <textarea placeholder="List any drug, food or environmental allergies..." rows="2" value={form.allergies} onChange={set('allergies')} className={`${inputBase(false)} resize-none`}></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Current Medications</label>
                                <textarea placeholder="List medications the patient is currently taking..." rows="2" value={form.medications} onChange={set('medications')} className={`${inputBase(false)} resize-none`}></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Past Medical Conditions</label>
                                <textarea placeholder="Summary of chronic conditions, surgeries, etc." rows="3" value={form.conditions} onChange={set('conditions')} className={`${inputBase(false)} resize-none`}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-6 pt-4">
                        <button type="button" onClick={() => navigate('/admin/dashboard')} className="text-sm font-bold text-[#0f172a] hover:text-gray-500 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors text-[14px]"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Registering...</span>
                            ) : (
                                <><UserPlus size={16} /> Register Patient</>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            <footer className="mt-auto border-t border-gray-200 py-6 px-12 text-center text-[11px] font-semibold text-gray-400">
                © 2026 Behealthy Hospital Management System. All rights reserved.
            </footer>
        </div>
    );
};

export default NewPatient;
