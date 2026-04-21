import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, PlusSquare,
    FileText, LayoutDashboard, Users, Settings,
    FileEdit, CheckCircle, ShieldCheck, AlertCircle, X
} from 'lucide-react';
import Toast from '../../components/shared/Toast';

const FieldError = ({ msg }) => msg ? (
    <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1">
        <AlertCircle size={12} /> {msg}
    </p>
) : null;

const patients = [
    { id: '#4421-99', name: 'John Doe', age: 34, gender: 'M' },
    { id: '#3312-44', name: 'Amara Silva', age: 28, gender: 'F' },
    { id: '#5503-27', name: 'Michael Chen', age: 52, gender: 'M' },
];

const NewPrescription = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(patients[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [form, setForm] = useState({
        medication: '', dosage: 'Once daily (QD)', duration: '7', durationUnit: 'Days', notes: ''
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search)
    );

    const validate = () => {
        const e = {};
        if (!form.medication.trim()) e.medication = 'Medication name is required';
        else if (form.medication.trim().length < 3) e.medication = 'Please enter a valid medication name';
        if (!form.duration || isNaN(form.duration) || Number(form.duration) < 1) e.duration = 'Enter a valid duration (min 1)';
        if (Number(form.duration) > 365) e.duration = 'Duration exceeds maximum (365)';
        return e;
    };

    const handleIssue = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            setToast({ type: 'error', message: 'Please fix errors before issuing.' });
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setToast({ type: 'success', message: `Prescription for ${selectedPatient.name} issued successfully!` });
            setForm({ medication: '', dosage: 'Once daily (QD)', duration: '7', durationUnit: 'Days', notes: '' });
            setTimeout(() => navigate('/doctor/prescriptions'), 1800);
        }, 1300);
    };

    const handleDraft = () => {
        setSaved(true);
        setToast({ type: 'success', message: 'Draft saved. You can return to it later.' });
        setTimeout(() => setSaved(false), 2000);
    };

    const inputClass = (hasErr) =>
        `w-full bg-[#f8f9fa] border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:bg-white transition-all text-[15px] font-medium ${hasErr
            ? 'border-red-300 focus:ring-red-100 bg-red-50/30'
            : 'border-gray-100 focus:ring-blue-100'}`;

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col items-center">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <header className="bg-white w-full px-8 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/doctor/dashboard')}>
                    <div className="bg-blue-600 text-white p-1 rounded-md shadow-sm">
                        <PlusSquare size={18} />
                    </div>
                    <span className="text-[17px] font-extrabold text-[#0f172a] tracking-tight">Behealthy</span>
                </div>
                <div className="hidden md:flex items-center gap-10">
                    <nav className="flex items-center gap-8 text-[14px] font-bold text-gray-500">
                        <button className="hover:text-blue-600 transition-colors">Patients</button>
                        <button className="hover:text-blue-600 transition-colors">History</button>
                        <button className="hover:text-blue-600 transition-colors">Pharmacy</button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell size={18} />
                        </button>
                        <div className="flex items-center gap-3 bg-[#f8f9fc] px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=James&backgroundColor=e2e8f0" alt="Dr Smith" />
                            </div>
                            <span className="text-sm font-bold text-[#0f172a]">Dr. Smith</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="w-full h-full flex flex-1">
                <aside className="w-[280px] bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 shrink-0">
                    <div className="mb-10">
                        <h2 className="text-[16px] font-black text-[#0f172a] mb-1">Dr. James Smith</h2>
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">General Practitioner</p>
                    </div>
                    <nav className="space-y-2">
                        <button onClick={() => navigate('/doctor/dashboard')} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-[14px] font-bold text-gray-500 hover:bg-gray-50">
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-[14px] font-bold text-gray-500 hover:bg-gray-50">
                            <Users size={18} /> Patients
                        </button>
                        <button onClick={() => navigate('/doctor/prescriptions')} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-[14px] font-bold bg-[#f0f4ff] text-blue-700 shadow-sm">
                            <FileEdit size={18} /> New Prescription
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-[14px] font-bold text-gray-500 hover:bg-gray-50">
                            <Settings size={18} /> Settings
                        </button>
                    </nav>
                </aside>

                <main className="flex-1 p-10 max-w-[1000px] mx-auto w-full overflow-y-auto">
                    <div className="mb-10">
                        <h1 className="text-[34px] font-black text-[#0f172a] mb-2 tracking-tight">New Prescription</h1>
                        <p className="text-gray-500 font-medium text-[16px]">Fill out the clinical details to issue a digital prescription.</p>
                    </div>

                    <form onSubmit={handleIssue} noValidate>
                        <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)]">

                            {/* Patient Search */}
                            <div className="mb-12">
                                <h2 className="text-[18px] font-black text-[#0f172a] mb-6 flex items-center gap-2.5">
                                    <Users size={20} className="text-blue-600" /> Patient Information
                                </h2>

                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                                        onFocus={() => setShowDropdown(true)}
                                        placeholder="Search patient by name or ID..."
                                        className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium placeholder-gray-400"
                                    />
                                    {showDropdown && search && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                                            {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => { setSelectedPatient(p); setSearch(''); setShowDropdown(false); }}
                                                    className="w-full px-5 py-4 text-left flex items-center gap-4 hover:bg-blue-50 transition-colors"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                                                        {p.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-sm">{p.name}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{p.id} | Age: {p.age} | {p.gender}</p>
                                                    </div>
                                                </button>
                                            )) : (
                                                <p className="px-5 py-4 text-sm text-gray-400 font-bold">No patients found.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedPatient && (
                                    <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                                                {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-[#0f172a] text-[16px]">{selectedPatient.name}</p>
                                                <p className="text-[13px] font-bold text-gray-400">ID: {selectedPatient.id} | Age: {selectedPatient.age} | {selectedPatient.gender}</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => { setSearch(''); setShowDropdown(true); }} className="text-[13px] font-black text-blue-600 hover:underline">Change Patient</button>
                                    </div>
                                )}
                            </div>

                            {/* Medication Details */}
                            <div className="mb-10">
                                <h2 className="text-[18px] font-black text-[#0f172a] mb-6 flex items-center gap-2.5">
                                    <FileText size={20} className="text-blue-600" /> Medication Details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-black text-[#0f172a] mb-2 uppercase tracking-wide">Medication Name *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Amoxicillin 500mg"
                                            value={form.medication}
                                            onChange={set('medication')}
                                            className={inputClass(errors.medication)}
                                        />
                                        <FieldError msg={errors.medication} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-black text-[#0f172a] mb-2 uppercase tracking-wide">Dosage Instructions</label>
                                            <select value={form.dosage} onChange={set('dosage')} className={inputClass(false) + ' appearance-none'}>
                                                <option>Once daily (QD)</option>
                                                <option>Twice daily (BID)</option>
                                                <option>Three times daily (TID)</option>
                                                <option>Before bed (QHS)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-black text-[#0f172a] mb-2 uppercase tracking-wide">Duration *</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="365"
                                                    value={form.duration}
                                                    onChange={set('duration')}
                                                    className={`w-24 bg-[#f8f9fa] border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 text-center font-bold ${errors.duration ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-blue-100'}`}
                                                />
                                                <select value={form.durationUnit} onChange={set('durationUnit')} className={inputClass(false) + ' appearance-none flex-1'}>
                                                    <option>Days</option>
                                                    <option>Weeks</option>
                                                    <option>Months</option>
                                                </select>
                                            </div>
                                            <FieldError msg={errors.duration} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-black text-[#0f172a] mb-2 uppercase tracking-wide">Doctor's Notes & Observations</label>
                                        <textarea
                                            placeholder="Add specific instructions for the pharmacist or patient..."
                                            rows="4"
                                            value={form.notes}
                                            onChange={set('notes')}
                                            className={`${inputClass(false)} resize-none`}
                                        ></textarea>
                                        <p className="text-[11px] text-gray-400 font-bold mt-1.5 text-right">{form.notes.length} / 500 chars</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#0a2540] hover:bg-[#1e293b] disabled:opacity-60 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_-5px_rgba(10,37,64,0.3)] text-[16px]"
                                >
                                    {submitting
                                        ? <span className="flex items-center gap-3"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Issuing...</span>
                                        : <><CheckCircle size={20} /> Issue Prescription</>
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDraft}
                                    className={`px-10 py-4 rounded-2xl font-black transition-all text-[16px] ${saved ? 'bg-green-100 text-green-700' : 'bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#0f172a]'}`}
                                >
                                    {saved ? '✓ Saved' : 'Save Draft'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-12 flex items-center justify-center gap-8 text-[12px] font-bold text-gray-400">
                        <div className="flex items-center gap-2"><ShieldCheck size={14} /> Encrypted Connection</div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="flex items-center gap-2"><PlusSquare size={14} /> Digital Signature Enabled</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NewPrescription;
