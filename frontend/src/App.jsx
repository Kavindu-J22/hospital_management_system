import { Routes, Route } from 'react-router-dom';
import Login from './pages/patient/Login';
import Register from './pages/patient/Register';
import Specializations from './pages/patient/Specializations';
import Dashboard from './pages/patient/Dashboard';
import Pharmacy from './pages/patient/Pharmacy';
import Billing from './pages/patient/Billing';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Appointments from './pages/admin/Appointments';
import PatientDirectory from './pages/admin/PatientDirectory';
import Queue from './pages/admin/Queue';
import NewPatient from './pages/admin/NewPatient';
import AdminDashboard from './pages/admin/Dashboard';
import ScheduleAppointment from './pages/admin/ScheduleAppointment';
import AdminPharmacyMap from './pages/admin/PharmacyMap';

// Doctor Pages
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorRegistration from './pages/doctor/DoctorRegistration';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import NewPrescription from './pages/doctor/NewPrescription';
import DoctorSessions from './pages/doctor/DoctorSessions';
import NewSession from './pages/admin/NewSession';
import RoomInventory from './pages/admin/RoomInventory';
import RoomAllocation from './pages/admin/RoomAllocation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/specializations" element={<Specializations />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pharmacy" element={<Pharmacy />} />
      <Route path="/billing" element={<Billing />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/appointments" element={<Appointments />} />
      <Route path="/admin/schedule-appointment" element={<ScheduleAppointment />} />
      <Route path="/admin/directory" element={<PatientDirectory />} />
      <Route path="/admin/queue" element={<Queue />} />
      <Route path="/admin/new-patient" element={<NewPatient />} />
      <Route path="/admin/pharmacy" element={<AdminPharmacyMap />} />
      <Route path="/admin/prescriptions" element={<DoctorPrescriptions />} />
      <Route path="/admin/sessions" element={<DoctorSessions />} />
      <Route path="/admin/new-session" element={<NewSession role="admin" />} />
      <Route path="/admin/rooms" element={<RoomInventory />} />
      <Route path="/admin/room-allocation" element={<RoomAllocation />} />

      {/* Doctor Routes */}
      <Route path="/doctor" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegistration />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
      <Route path="/doctor/new-prescription" element={<NewPrescription />} />
      <Route path="/doctor/sessions" element={<DoctorSessions />} />
      <Route path="/doctor/new-session" element={<NewSession role="doctor" />} />
    </Routes>
  );
}

export default App;
