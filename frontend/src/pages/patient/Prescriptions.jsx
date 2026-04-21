import React, { useState, useEffect } from 'react';
import { FileStack, Clock, Download, PackageOpen, Search } from 'lucide-react';
import { prescriptionAPI } from '../../services/api';
import PatientSidebar from '../../components/patient/PatientSidebar';

const Prescriptions = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user?.id) return;
            try {
                const res = await prescriptionAPI.getByPatient(user.id);
                setPrescriptions(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, [user?.id]);

    const filteredPrescriptions = prescriptions.filter(p => 
        (p.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
            <PatientSidebar />
            
            <div className="flex-1 ml-64">
                <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="w-[400px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search prescriptions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-transparent rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                    </div>
                </header>

                <main className="p-8 max-w-[1200px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Your Prescriptions</h1>
                        <p className="text-gray-500 font-medium text-[15px]">View and manage your medical prescriptions securely.</p>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-6 h-40 animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredPrescriptions.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <PackageOpen size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Prescriptions Found</h3>
                                    <p className="text-gray-500">You do not have any prescriptions yet or none match your search.</p>
                                </div>
                            ) : (
                                filteredPrescriptions.map((presc) => (
                                    <div key={presc._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">Dr. {presc.doctorName || 'Doctor'}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(presc.status)}`}>
                                                        {presc.status || 'Active'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> Issued: {new Date(presc.createdAt).toLocaleDateString()}</span>
                                                    {presc.diagnosis && <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 capitalize">Diagnosis: {presc.diagnosis}</span>}
                                                </div>
                                            </div>
                                            <button 
                                                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                                                onClick={() => window.print()}
                                            >
                                                <Download size={16} /> Download PDF
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(presc.medications || []).map((med, index) => (
                                                <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                                        <FileStack size={20} className="text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{med.name}</h4>
                                                        <div className="text-xs text-gray-500 font-medium space-y-1">
                                                            <p>Dosage: <span className="text-gray-900">{med.dosage}</span> • Frequency: <span className="text-gray-900">{med.frequency}</span></p>
                                                            <p>Duration: <span className="text-gray-900">{med.duration}</span></p>
                                                            {med.notes && <p className="text-orange-600 bg-orange-50 inline-block px-1.5 py-0.5 rounded mt-1">Note: {med.notes}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Prescriptions;
