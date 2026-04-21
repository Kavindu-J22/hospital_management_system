import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Bell, Settings, LayoutDashboard,
    Bed, CheckCircle, Users, Activity, Filter,
    MoreVertical, ChevronRight, Clock, ShieldPlus
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { roomAPI } from '../../services/api';

const roomStatusColor = (s) => {
    if (s === 'Available') return 'bg-green-100 text-green-600';
    if (s === 'Occupied') return 'bg-orange-100 text-orange-600';
    if (s === 'Cleaning') return 'bg-blue-100 text-blue-600';
    if (s === 'Maintenance') return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
};

const RoomInventory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Floors');
    const [rooms, setRooms] = useState([]);
    const [roomStats, setRoomStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const floors = [
        { name: 'All Floors', count: rooms.length },
        { name: 'Floor 1', count: rooms.filter(r => r.floor === '1' || r.floor === 'Floor 1').length },
        { name: 'Floor 2', count: rooms.filter(r => r.floor === '2' || r.floor === 'Floor 2').length },
        { name: 'ICU / Emergency', count: rooms.filter(r => ['ICU', 'Emergency'].includes(r.type)).length },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, statsRes] = await Promise.all([
                    roomAPI.getAll(),
                    roomAPI.getStats(),
                ]);
                setRooms(roomRes.data.data || []);
                setRoomStats(statsRes.data.data || {});
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const filteredRooms = rooms.filter(r => {
        const floorMatch = activeTab === 'All Floors' || r.floor?.toLowerCase().includes(activeTab.toLowerCase()) || r.type?.toLowerCase().includes(activeTab.toLowerCase());
        const searchMatch = !search || r.roomNumber?.toLowerCase().includes(search.toLowerCase()) || r.name?.toLowerCase().includes(search.toLowerCase()) || r.currentOccupant?.name?.toLowerCase().includes(search.toLowerCase());
        return floorMatch && searchMatch;
    });

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans flex text-[#0f172a]">
            <AdminSidebar />

            <div className="flex-1 ml-[280px] flex flex-col min-h-screen overflow-hidden">
                {/* Topbar */}
                <header className="bg-white px-8 py-3.5 flex items-center justify-between border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex-1 flex items-center relative max-w-xl">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search rooms or patients..."
                            className="w-full bg-[#f4f7fb] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                            <Settings size={20} />
                        </button>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-teal-50">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=ccfbf1" alt="Admin" />
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto w-full max-w-[1400px] mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-[28px] font-black tracking-tight mb-1">Room Inventory</h1>
                            <p className="text-gray-500 font-medium">Manage hospital capacity and patient allocations across all wards.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/room-allocation')}
                            className="bg-[#0a2540] hover:bg-[#1a3a5a] text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={18} /> Assign Room
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Total Rooms', value: roomStats.total ?? '—', icon: <Bed className="text-blue-600" /> },
                            { label: 'Available', value: roomStats.available ?? '—', icon: <CheckCircle className="text-green-600" /> },
                            { label: 'Occupied', value: roomStats.occupied ?? '—', icon: <Users className="text-orange-600" /> },
                            { label: 'Cleaning / Maintenance', value: ((roomStats.cleaning || 0) + (roomStats.maintenance || 0)) || '—', icon: <Activity className="text-blue-400" /> },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-400 text-[13px] font-bold mb-1">{s.label}</p>
                                        <h3 className="text-[32px] font-black leading-none tracking-tight">{loading ? '—' : s.value}</h3>
                                    </div>
                                    <div className="bg-[#f8f9fa] p-2.5 rounded-xl">{s.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floor Tabs */}
                    <div className="flex items-center gap-8 border-b border-gray-100 mb-8 pb-px">
                        {floors.map(f => (
                            <button
                                key={f.name}
                                onClick={() => setActiveTab(f.name)}
                                className={`pb-3 text-[14px] font-bold transition-all border-b-2 ${activeTab === f.name ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {f.name} <span className="ml-1 opacity-50 text-[12px]">{f.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filters Row */}
                    <div className="flex items-center gap-4 mb-8">
                        <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 text-gray-600">
                            <Filter size={14} /> Filters:
                        </button>
                        <button className="bg-[#0a2540] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            Status: All <Plus size={14} className="rotate-45" />
                        </button>
                        <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 text-gray-600">
                            Room Type <ChevronRight size={14} className="rotate-90" />
                        </button>
                        <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 text-gray-600">
                            Cleanliness <ChevronRight size={14} className="rotate-90" />
                        </button>
                    </div>

                    {/* Rooms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading && [...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-52 animate-pulse border border-gray-100" />)}
                        {filteredRooms.map((room) => (
                            <div key={room._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[9px] font-black px-2 py-1 rounded tracking-widest ${roomStatusColor(room.status)}`}>
                                            {room.status.toUpperCase()}
                                        </span>
                                        <button className="text-gray-300 hover:text-gray-500"><MoreVertical size={18} /></button>
                                    </div>
                                    <h3 className="text-[18px] font-black mb-1">{room.name}</h3>
                                    <p className="text-gray-400 text-[11px] font-bold mb-6 uppercase tracking-wider">{room.type} • {room.floor}</p>

                                    {room.currentOccupant?.name ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${room.currentOccupant.name}`} alt={room.currentOccupant.name} />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold leading-tight">{room.currentOccupant.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{room.currentOccupant.condition || 'In Care'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-[13px] font-medium italic">{room.status === 'Available' ? 'Ready for admission' : room.status}</p>
                                    )}
                                </div>
                                <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-50">
                                    <button
                                        onClick={() => navigate('/admin/room-allocation')}
                                        className="text-blue-600 text-[12px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                                    >
                                        {room.currentOccupant?.name ? 'View History' : 'Quick Assign'}
                                        {room.currentOccupant?.name ? <ChevronRight size={14} /> : <Plus size={14} />}
                                    </button>
                                    {room.status === 'Cleaning' && <CheckCircle size={16} className="text-blue-600" />}
                                </div>
                            </div>
                        ))}

                        {/* New Room Record Placeholder */}
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all min-h-[220px]">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 text-gray-300">
                                <Plus size={24} />
                            </div>
                            <p className="text-gray-400 font-bold text-[14px]">New Room Record</p>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-10">
                        <div className="flex items-center gap-2">
                            <Clock size={14} /> Last updated: {new Date().toLocaleString()}
                        </div>
                        <div className="flex gap-6">
                            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-gray-600 cursor-pointer">Support Center</span>
                            <span className="hover:text-gray-600 cursor-pointer">System Status</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RoomInventory;
