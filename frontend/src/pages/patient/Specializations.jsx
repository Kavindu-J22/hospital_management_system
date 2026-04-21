import React, { useEffect, useState } from 'react';
import {
    Bell, User, Search, Star, Calendar,
    HeartPulse, Baby, Activity, Brain, Droplets, Eye,
    Users, CalendarPlus, Stethoscope
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, sessionAPI } from '../../services/api';

const specIcon = (name) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('cardio')) return { icon: <HeartPulse className="text-red-500" size={24} />, bg: 'bg-red-50' };
    if (n.includes('pediatric') || n.includes('child')) return { icon: <Baby className="text-blue-500" size={24} />, bg: 'bg-blue-50' };
    if (n.includes('ortho')) return { icon: <Activity className="text-orange-500" size={24} />, bg: 'bg-orange-50' };
    if (n.includes('neuro')) return { icon: <Brain className="text-purple-500" size={24} />, bg: 'bg-purple-50' };
    if (n.includes('derm')) return { icon: <Droplets className="text-pink-500" size={24} />, bg: 'bg-pink-50' };
    if (n.includes('ent') || n.includes('eye') || n.includes('opthal')) return { icon: <Eye className="text-teal-500" size={24} />, bg: 'bg-teal-50' };
    return { icon: <Stethoscope className="text-gray-500" size={24} />, bg: 'bg-gray-50' };
};

const specDesc = (name) => {
    const map = {
        Cardiology: 'Heart health, hypertension, and cardiovascular diseases.',
        Pediatrics: 'Medical care for infants, children, and adolescents.',
        Orthopedics: 'Treatment of the musculoskeletal system and injuries.',
        Neurology: 'Disorders of the nervous system and brain functions.',
        Dermatology: 'Diagnosis and treatment of skin, hair, and nail disorders.',
        ENT: 'Ear, Nose and Throat specialist care.',
        Endocrinology: 'Hormonal and metabolic disorder treatment.',
        Radiology: 'Diagnostic imaging and interventional procedures.',
        'General Medicine': 'General health consultations and primary care.',
    };
    return map[name] || `Specialist consultations for ${name}.`;
};

const Specializations = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [specializations, setSpecializations] = useState([]);
    const [doctorCounts, setDoctorCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [specRes, docRes] = await Promise.all([
                    doctorAPI.getSpecializations(),
                    doctorAPI.getAll({ status: 'Approved', limit: 100 }),
                ]);
                const specs = specRes.data.data || [];
                const doctors = docRes.data.data || [];
                const counts = {};
                doctors.forEach(d => { counts[d.specialization] = (counts[d.specialization] || 0) + 1; });
                setSpecializations(specs);
                setDoctorCounts(counts);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleBook = (specName) => navigate('/dashboard', { state: { specialization: specName } });

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans pb-16">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <span className="text-xl font-bold text-[#0f172a] uppercase tracking-wide">Behealthy Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors bg-gray-50">
                        <User size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 mt-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Medical Specializations</h1>
                    <p className="text-gray-500 text-lg">Find and book appointments with our world-class specialists</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search specializations (e.g. Cardiology, Neuro...)"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="bg-[#0f172a] text-white px-6 py-3.5 rounded-xl font-medium shadow-sm hover:bg-slate-800 transition-colors">
                            All
                        </button>
                        <button className="bg-white text-gray-700 px-6 py-3.5 rounded-xl font-medium border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <Star size={18} /> Top Rated
                        </button>
                        <button className="bg-white text-gray-700 px-6 py-3.5 rounded-xl font-medium border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <Calendar size={18} /> Available Today
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 h-52 animate-pulse border border-gray-100" />)}
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specializations.filter(s => !search || s.toLowerCase().includes(search.toLowerCase())).map((specName) => {
                        const { icon, bg } = specIcon(specName);
                        const count = doctorCounts[specName] || 0;
                        return (
                            <div key={specName} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-xl ${bg}`}>{icon}</div>
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-md ${count > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {count > 0 ? 'AVAILABLE' : 'CALL FOR INFO'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2">{specName}</h3>
                                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2">{specDesc(specName)}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
                                    <Users size={16} />
                                    {count} Specialist{count !== 1 ? 's' : ''} Available
                                </div>
                                <button
                                    onClick={() => handleBook(specName)}
                                    className="w-full bg-[#f4f6fa] hover:bg-[#e2e8f0] text-[#0f172a] font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    Book an appointment <CalendarPlus size={18} />
                                </button>
                            </div>
                        );
                    })}
                    {specializations.filter(s => !search || s.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                        <div className="col-span-3 py-12 text-center text-gray-400 font-medium">No specializations found</div>
                    )}
                </div>
                )}

                {/* Bottom Banner */}
                <div className="mt-16 bg-[#f3f4f6] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between border border-gray-200">
                    <div className="mb-6 md:mb-0 max-w-lg">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-2">Can't find what you're looking for?</h3>
                        <p className="text-gray-500">
                            Our 24/7 help desk can assist you with general inquiries or guide you to the right department.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none bg-white font-semibold text-[#0f172a] px-6 py-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
                            Chat with Support
                        </button>
                        <button className="flex-1 md:flex-none bg-red-600 font-semibold text-white px-6 py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-500/30">
                            Call Emergency
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Specializations;
