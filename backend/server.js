require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const Session = require('./models/Session');
const Room = require('./models/Room');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const { sendAppointmentConfirmationEmail } = require('./config/email');
const Patient = require('./models/Patient');

// Routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const roomRoutes = require('./routes/rooms');
const sessionRoutes = require('./routes/sessions');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect DB
connectDB();

// Middleware — CORS allows any localhost port in dev (Vite may pick 5173, 5174, etc.)
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : /^http:\/\/localhost:\d+$/;

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Behealthy Hospital API is running', timestamp: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ─── CRON JOBS ────────────────────────────────────────────────────────────────

// Auto-timeout sessions every minute: check if sessions have passed their end time
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const activeSessions = await Session.find({ status: { $in: ['Active', 'Upcoming', 'Extended'] } });

    for (const session of activeSessions) {
      const sessionDate = new Date(session.date);
      const endTimeParts = (session.extendedEndTime || session.endTime).split(':');
      const sessionEnd = new Date(sessionDate);
      sessionEnd.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);

      if (now >= sessionEnd) {
        session.status = 'Completed';
        await session.save();
        // Free up room
        await Room.findByIdAndUpdate(session.room, { status: 'Available' });
        // Doctor becomes Unavailable
        await Doctor.findByIdAndUpdate(session.doctor, { availability: 'Unavailable' });
        console.log(`⏰ Auto-completed session: ${session._id} (${session.doctorName})`);
      } else if (now >= new Date(sessionDate.setHours(parseInt(session.startTime.split(':')[0]), parseInt(session.startTime.split(':')[1]), 0, 0))) {
        if (session.status === 'Upcoming') {
          session.status = 'Active';
          await session.save();
          await Doctor.findByIdAndUpdate(session.doctor, { availability: 'On Session' });
        }
      }
    }
  } catch (err) {
    console.error('Cron session timeout error:', err.message);
  }
});

// Send confirmation emails 1 day before appointments — runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: tomorrow, $lte: tomorrowEnd },
      status: { $in: ['Pending', 'Confirmed'] },
      confirmationEmailSent: false,
    }).populate('patient', 'fullName email');

    for (const appt of appointments) {
      if (appt.patient && appt.patient.email) {
        await sendAppointmentConfirmationEmail(appt.patient, appt);
        await Appointment.findByIdAndUpdate(appt._id, { confirmationEmailSent: true, confirmationEmailSentAt: new Date() });
        console.log(`📧 Confirmation email sent for appointment ${appt.ticketNumber}`);
      }
    }
    console.log(`✅ Processed ${appointments.length} confirmation emails`);
  } catch (err) {
    console.error('Cron email error:', err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Behealthy Hospital API running on port ${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   MongoDB: ${process.env.MONGODB_URI?.split('@')[1] || 'connected'}`);
});
