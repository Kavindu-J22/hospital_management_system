import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    PlusSquare, Map as MapIcon, List, Search, Bell,
    MapPin, Clock, Phone, Check, Heart, Navigation, Store,
    Crosshair, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for map markers
const activePharmacyIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="bg-blue-600 text-white rounded-full p-1.5 shadow-lg border-2 border-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5A2.5 2.5 0 0 0 13 23h5a2.5 2.5 0 0 0 2.5-2.5v-11a2.5 2.5 0 0 0-2.5-2.5H18"/><path d="M6 3v13"/><path d="M2 9h8"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const defaultPharmacyIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="bg-gray-500 text-white rounded-full p-1.5 shadow-md border-2 border-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26]
});

const hospitalIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="bg-red-500 text-white rounded-full p-1.5 shadow-md border-2 border-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26]
});

const Pharmacy = () => {
    const navigate = useNavigate();
    // Center roughly around Sri Pura / Padavi Sripura based on the screenshot text
    const center = [8.8105, 80.8931];

    const pharmacies = [
        {
            id: 1,
            name: 'City Central Pharmacy',
            address: '124 Healthcare padavipura 10001',
            distance: '0.2 mi',
            status: 'Open Now',
            statusColor: 'text-green-600',
            statusBg: 'bg-green-50',
            closes: 'Closes 10:00 PM',
            stocked: true,
            coords: [8.8155, 80.8911],
            selected: true
        },
        {
            id: 2,
            name: 'HealthPlus Drugstore',
            address: '88 padavipura 10016',
            distance: '0.5 mi',
            status: '24 Hours',
            statusColor: 'text-blue-600',
            statusBg: 'bg-blue-50',
            coords: [8.8055, 80.8981],
            selected: false
        },
        {
            id: 3,
            name: 'Green Cross Apothecary',
            address: '202 SL, Sri pura, 10003',
            distance: '0.8 mi',
            status: 'Open Now',
            statusColor: 'text-green-600',
            statusBg: 'bg-green-50',
            coords: [8.8015, 80.8851],
            selected: false
        },
        {
            id: 4,
            name: 'Walgreens Pharmacy',
            address: '40 Sri pura main rd',
            distance: '1.2 mi',
            status: 'Closing Soon',
            statusColor: 'text-red-500',
            statusBg: 'bg-red-50',
            coords: [8.8185, 80.9021],
            selected: false
        }
    ];

    return (
        <div className="h-screen flex flex-col font-sans overflow-hidden bg-white">
            {/* Header */}
            <header className="h-[70px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white z-20">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xl font-bold text-[#0f172a] hover:text-blue-600 transition-colors">
                        <div className="bg-blue-600 text-white p-1 rounded-md">
                            <PlusSquare size={18} />
                        </div>
                        PharmFinder
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-2"></div>

                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm">
                            <MapIcon size={16} /> Map View
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
                            <List size={16} /> List
                        </button>
                    </div>
                </div>

                <div className="flex-1 max-w-xl mx-8 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search pharmacy name or prescription..."
                        className="w-full bg-[#f4f6fa] border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>

                <div className="flex items-center gap-5">
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative border border-gray-200">
                        <Bell size={18} />
                    </button>

                    <div className="flex items-center gap-3 cursor-pointer">
                        <span className="font-semibold text-gray-900 text-sm">John Doe</span>
                        <div className="w-9 h-9 bg-slate-200 rounded-full overflow-hidden border border-gray-300">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=e2e8f0" alt="John" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Left Sidebar - List */}
                <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.02)]">
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-[20px] font-bold text-[#0f172a]">Nearby Pharmacies</h2>
                            <button className="text-blue-600 text-sm font-semibold hover:underline">Filters</button>
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5">
                            <MapPin size={14} /> Near City General Hospital
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {pharmacies.map((pharm) => (
                            <div
                                key={pharm.id}
                                className={`p-5 relative border-b border-gray-50 cursor-pointer ${pharm.selected ? 'border-l-4 border-l-blue-600 bg-blue-50/10' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${pharm.statusBg} ${pharm.statusColor}`}>
                                        {pharm.status}
                                    </span>
                                    <span className="text-blue-600 text-sm font-bold">{pharm.distance}</span>
                                </div>

                                <h3 className="text-[16px] font-bold text-[#0f172a] mb-1">{pharm.name}</h3>
                                <p className="text-gray-500 text-[13px] mb-3">{pharm.address}</p>

                                {pharm.selected && (
                                    <>
                                        <div className="flex items-center gap-4 text-[12px] font-medium text-gray-600 mb-4">
                                            <span className="flex items-center gap-1"><Clock size={13} /> {pharm.closes}</span>
                                            <span className="flex items-center gap-1"><Check size={13} className="text-green-500" /> Stocked</span>
                                        </div>
                                        <div className="flex gap-2 text-sm font-semibold">
                                            <button className="flex-1 bg-[#0f172a] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                                                <Navigation size={15} /> Directions
                                            </button>
                                            <button className="w-10 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                                <Phone size={15} />
                                            </button>
                                        </div>
                                    </>
                                )}

                                {!pharm.selected && (
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-[#f4f6fa] text-[#0f172a] py-2 rounded-lg font-semibold hover:bg-[#e2e8f0] transition-colors text-sm">
                                            Details
                                        </button>
                                        <button className="w-10 bg-white border border-gray-200 text-gray-500 py-2 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                            <Heart size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Right Side - Map Container */}
                <div className="flex-1 bg-[#e5e5f7] relative">
                    <MapContainer
                        center={center}
                        zoom={14}
                        zoomControl={false}
                        className="w-full h-full"
                        style={{ backgroundColor: '#dcfce7' }} // Light green tint to match the styling
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <ZoomControl position="topright" />

                        {/* Pharmacies Markers */}
                        {pharmacies.map(p => (
                            <Marker
                                key={p.id}
                                position={p.coords}
                                icon={p.selected ? activePharmacyIcon : defaultPharmacyIcon}
                            >
                                <Popup>
                                    <div className="font-bold">{p.name}</div>
                                    <div className="text-xs text-gray-500">{p.address}</div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Additional Decorative Markers to match screenshot */}
                        <Marker position={[8.8160, 80.9030]} icon={hospitalIcon}>
                            <Popup>City Hospital</Popup>
                        </Marker>

                    </MapContainer>

                    {/* Floating UI Elements over Map */}

                    {/* Selected marker info bubble */}
                    <div className="absolute top-[25%] left-[30%] z-[400] bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-[45px]">
                        City Central Pharmacy
                        <div className="absolute w-2 h-2 bg-blue-600 rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>

                    {/* Redo search button */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[400] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-4 flex items-center gap-6">
                        <div className="text-xs">
                            <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Search Area</span>
                            <div className="border-b-2 border-dashed border-gray-600 w-32"></div>
                        </div>
                        <button className="bg-blue-50 text-blue-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                            Redo search here
                        </button>
                    </div>

                    {/* Current location button */}
                    <div className="absolute top-[80px] right-3 z-[400]">
                        <button className="bg-white p-2 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.1)] border border-gray-200 hover:bg-gray-50">
                            <Crosshair size={20} className="text-gray-700" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Pharmacy;
