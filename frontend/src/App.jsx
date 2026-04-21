import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/patient/Login';
import Register from './pages/patient/Register';
import Specializations from './pages/patient/Specializations';
import Dashboard from './pages/patient/Dashboard';
import Pharmacy from './pages/patient/Pharmacy';
import Billing from './pages/patient/Billing';
import BookAppointment from './pages/patient/BookAppointment';
import PatientAppointments from './pages/patient/Appointments';
import PatientPrescriptions from './pages/patient/Prescriptions';
import ConfirmAppointment from './pages/patient/ConfirmAppointment';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Appointments from './pages/admin/Appointments';
import PatientDirectory from './pages/admin/PatientDirectory';
import Queue from './pages/admin/Queue';
import NewPatient from './pages/admin/NewPatient';
import AdminDashboard from './pages/admin/Dashboard';
import Doctors from './pages/admin/Doctors';
import ScheduleAppointment from './pages/admin/ScheduleAppointment';
import AdminPharmacyMap from './pages/admin/PharmacyMap';

// Doctor Pages
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorRegistration from './pages/doctor/DoctorRegistration';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import NewPrescription from './pages/doctor/NewPrescription';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorSessions from './pages/doctor/DoctorSessions';
import NewSession from './pages/admin/NewSession';
import RoomInventory from './pages/admin/RoomInventory';
import RoomAllocation from './pages/admin/RoomAllocation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/patient" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/specializations" element={<Specializations />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pharmacy" element={<Pharmacy />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/appointments" element={<PatientAppointments />} />
      <Route path="/prescriptions" element={<PatientPrescriptions />} />
      <Route path="/confirm-appointment/:id" element={<ConfirmAppointment />} />

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
      <Route path="/admin/doctors" element={<Doctors />} />

      {/* Doctor Routes */}
      <Route path="/doctor" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegistration />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/patients" element={<DoctorPatients />} />
      <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
      <Route path="/doctor/new-prescription" element={<NewPrescription />} />
      <Route path="/doctor/sessions" element={<DoctorSessions />} />
      <Route path="/doctor/new-session" element={<NewSession role="doctor" />} />
    </Routes>
  );
}

export default App;
