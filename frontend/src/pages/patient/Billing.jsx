import React from 'react';
import {
    LayoutDashboard, Calendar, FileText, CreditCard,
    Search, Bell, FileStack, AlertTriangle, Store,
    Shield, Lock, Info, Receipt, CreditCard as CardIcon, DollarSign, HeartPulse
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans">

            {/* Sidebar from Dashboard Layout */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between fixed h-full shadow-sm z-20">
                <div>
                    <div className="p-6 flex items-center gap-3 border-b border-white">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Behealthy</span>
                    </div>

                    <nav className="px-4 py-8 space-y-2">
                        <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                            <LayoutDashboard size={20} />
                            Dashboard
                        </button>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                            <Calendar size={20} />
                            Appointments
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                            <FileStack size={20} />
                            Prescriptions
                        </a>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#f0f4ff] text-blue-700 font-semibold rounded-xl">
                            <CreditCard size={20} />
                            Billing
                        </button>
                        <button onClick={() => navigate('/pharmacy')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                            <Store size={20} />
                            Pharmacy
                        </button>
                    </nav>
                </div>

                <div className="p-4 mb-4">
                    <button className="w-full bg-[#db2736] hover:bg-red-700 text-white font-extrabold py-4 px-4 rounded-2xl shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 transition-colors tracking-wide text-[15px]">
                        <AlertTriangle size={22} className="text-white" strokeWidth={2.5} />
                        EMERGENCY AMBULANCE
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col h-screen">
                {/* Topbar */}
                <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-end sticky top-0 z-10 shadow-sm shrink-0">
                    <div className="flex items-center gap-6">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer">
                            <div className="text-right">
                                <p className="font-bold text-gray-900 text-sm">Alex Johnson</p>
                                <p className="text-xs text-gray-500 font-medium">Patient ID: #8821</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=fef3c7`} alt="Alex" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Billing Content */}
                <main className="p-8 pb-20 flex-1 overflow-y-auto">
                    <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-8">

                        {/* Left Column - Payment Method */}
                        <div className="flex-[3] flex flex-col gap-6">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-[#0f172a] mb-6">
                                    <div className="bg-blue-600 text-white rounded-md p-1">
                                        <Banknote size={16} />
                                    </div>
                                    Payment Method
                                </h2>

                                {/* Toggles */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <button className="border-2 border-blue-600 bg-[#f8fbff] text-blue-700 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 font-bold text-sm shadow-sm transition-colors">
                                        <CardIcon size={22} />
                                        Credit Card
                                    </button>
                                    <button className="border border-gray-200 bg-white text-gray-700 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 font-bold text-sm hover:bg-gray-50 transition-colors">
                                        <DollarSign size={22} className="text-gray-400" />
                                        PayPal
                                    </button>
                                    <button className="border border-gray-200 bg-white text-gray-700 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 font-bold text-sm hover:bg-gray-50 transition-colors">
                                        <Shield size={22} className="text-gray-400" />
                                        Insurance
                                    </button>
                                </div>

                                {/* Form */}
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Alex Johnson"
                                            className="w-full border border-gray-200 bg-[#f8f9fa] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm font-medium text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                defaultValue="**** **** **** 4452"
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium text-gray-900"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#f0f4ff] text-blue-800 font-extrabold text-[10px] px-2 py-1 rounded">
                                                VISA
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="***"
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium text-gray-900"
                                                />
                                                <Info size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <input type="checkbox" id="saveCard" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="saveCard" className="text-sm text-gray-600 font-medium">Save card for future payments</label>
                                    </div>
                                </form>
                            </div>

                            {/* Secure Banner */}
                            <div className="bg-[#f8fdfa] border border-green-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3 text-green-700 font-medium text-sm">
                                    <Shield size={20} className="text-green-600" />
                                    Your transaction is secured with 256-bit SSL encryption.
                                </div>
                                <Lock size={18} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="flex-[2] flex flex-col gap-6">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-[#0f172a] mb-8">
                                    <Receipt size={20} className="text-blue-600" />
                                    Order Summary
                                </h2>

                                <div className="space-y-6 mb-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-[#0f172a] text-[15px] mb-1">Consultation Fee</h4>
                                            <p className="text-gray-400 text-xs font-medium">Dr. Sarah Miller - Cardiology</p>
                                        </div>
                                        <span className="font-bold text-[#0f172a]">$100.00</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-[#0f172a] text-[15px] mb-1">Service</h4>
                                            <p className="text-gray-400 text-xs font-medium">Completed</p>
                                        </div>
                                        <span className="font-bold text-[#0f172a]">$50.00</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mb-8">
                                    <div className="flex justify-between items-end mb-1">
                                        <h3 className="font-extrabold text-[#0f172a] text-lg">Total Amount</h3>
                                        <span className="font-black text-blue-600 text-2xl tracking-tight">$150.00</span>
                                    </div>
                                    <div className="text-right text-[11px] text-gray-400 font-bold uppercase tracking-wider">Taxes Included</div>
                                </div>

                                <button className="w-full bg-[#0a1e4a] hover:bg-[#061436] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all text-[15px] mb-4">
                                    <Lock size={16} /> Pay $150.00 Now
                                </button>

                                <button className="w-full text-center text-gray-500 font-semibold text-sm hover:text-gray-800 transition-colors py-2">
                                    Cancel and Return
                                </button>

                                <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <span>VISA</span>
                                    <span>Mastercard</span>
                                </div>
                            </div>

                            {/* Help Banner */}
                            <div className="bg-[#f4f8ff] border border-blue-100 rounded-2xl p-6 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#0a1e4a] font-bold text-[15px]">
                                    <Info size={18} className="text-blue-600" />
                                    Payment Assistance
                                </div>
                                <p className="text-blue-800/80 text-xs font-medium leading-relaxed mt-1">
                                    Having trouble? Contact our billing department at <strong className="font-bold text-[#0a1e4a]">(123) 123-4567</strong> or use our 24/7 chat support.
                                </p>
                            </div>
                        </div>

                    </div>
                </main>

                {/* Footer outside of scroll area simulating bottom page structure */}
                <footer className="bg-white border-t border-gray-100 py-6 px-12 flex justify-between items-center shrink-0 text-sm text-gray-500 font-medium">
                    <p>© 2024 BehealthyPortal Healthcare Systems</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
                    </div>
                </footer>

            </div>
        </div>
    );
};

// Simple internal icon for Banknote since it may not be in this lucide version or named differently sometimes
const Banknote = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
    </svg>
);

export default Billing;
