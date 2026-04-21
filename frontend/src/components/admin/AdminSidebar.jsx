import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Activity,
  Monitor,
  UserPlus,
  Map as MapIcon,
  FileText,
  Bed,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) =>
    `flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-semibold transition-colors text-[15px] ${
      isActive(path)
        ? "bg-[#f0f4ff] text-blue-700"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  const iconClass = (path) =>
    isActive(path) ? "text-blue-600" : "text-gray-400";

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-600 text-white p-1 rounded">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold text-[#0f172a] uppercase tracking-wide">
            Hospital Admin
          </span>
        </div>
      </div>

      <div className="p-6 pb-2">
        <h2 className="text-gray-900 font-bold text-[15px]">
          City General Hospital
        </h2>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
          Administrative Portal
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className={navItemClass("/admin/dashboard")}
        >
          <LayoutDashboard
            size={20}
            className={iconClass("/admin/dashboard")}
          />{" "}
          Dashboard
        </button>
        <button
          onClick={() => navigate("/admin/appointments")}
          className={navItemClass("/admin/appointments")}
        >
          <Calendar size={20} className={iconClass("/admin/appointments")} />{" "}
          Appointments
        </button>
        <button
          onClick={() => navigate("/admin/directory")}
          className={navItemClass("/admin/directory")}
        >
          <Users size={20} className={iconClass("/admin/directory")} /> Patients
        </button>
        <button
          onClick={() => navigate("/admin/sessions")}
          className={navItemClass("/admin/sessions")}
        >
          <Calendar size={20} className={iconClass("/admin/sessions")} />{" "}
          Sessions
        </button>
        <button
          onClick={() => navigate("/admin/rooms")}
          className={navItemClass("/admin/rooms")}
        >
          <Bed size={20} className={iconClass("/admin/rooms")} /> Rooms
        </button>
        <button 
          onClick={() => navigate("/admin/doctors")}
          className={navItemClass("/admin/doctors")}
        >
          <Activity size={20} className={iconClass("/admin/doctors")} /> Doctors
        </button>
        <button
          onClick={() => navigate("/admin/queue")}
          className={navItemClass("/admin/queue")}
        >
          <Monitor size={20} className={iconClass("/admin/queue")} /> Live Queue
        </button>
        <button
          onClick={() => navigate("/admin/pharmacy")}
          className={navItemClass("/admin/pharmacy")}
        >
          <MapIcon size={20} className={iconClass("/admin/pharmacy")} />{" "}
          Pharmacy Map
        </button>
        <button
          onClick={() => navigate("/admin/prescriptions")}
          className={navItemClass("/admin/prescriptions")}
        >
          <FileText size={20} className={iconClass("/admin/prescriptions")} />{" "}
          Prescriptions
        </button>

        <div className="py-2">
          <div className="border-t border-gray-100"></div>
        </div>

        <button
          onClick={() => navigate("/admin/new-patient")}
          className={navItemClass("/admin/new-patient")}
        >
          <UserPlus size={20} className={iconClass("/admin/new-patient")} /> New
          Patient
        </button>

        <div className="py-2">
          <div className="border-t border-gray-100"></div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-bold transition-colors text-red-500 hover:bg-red-50 text-[15px]"
        >
          <LogOut size={20} /> Log Out
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
