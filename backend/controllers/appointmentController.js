const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Session = require('../models/Session');
const { sendAppointmentConfirmationEmail } = require('../config/email');

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, sessionId, status, date, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (patientId) filter.patient = patientId;
    if (doctorId) filter.doctor = doctorId;
    if (sessionId) filter.session = sessionId;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      filter.appointmentDate = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .populate('patient', 'fullName patientId email gender dateOfBirth')
      .populate('doctor', 'fullName specialization avatar')
      .populate('session', 'date startTime endTime roomNumber')
      .sort({ appointmentDate: 1, queuePosition: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: appointments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get live queue for a session
const getLiveQueue = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const queue = await Appointment.find({ session: sessionId, status: { $in: ['Pending', 'Confirmed'] } })
      .populate('patient', 'fullName patientId gender dateOfBirth')
      .sort({ queuePosition: 1 });
    res.json({ success: true, data: queue, total: queue.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active queues (admin view)
const getAllQueues = async (req, res) => {
  try {
    const activeSessions = await Session.find({ status: { $in: ['Active', 'Upcoming'] } })
      .populate('doctor', 'fullName specialization');
    const queues = await Promise.all(activeSessions.map(async (session) => {
      const appointments = await Appointment.find({ session: session._id, status: { $in: ['Pending', 'Confirmed'] } })
        .populate('patient', 'fullName patientId').sort({ queuePosition: 1 });
      return { session, appointments, count: appointments.length };
    }));
    res.json({ success: true, data: queues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, sessionId, department, specialization, consultType, appointmentDate, timeSlot, notes, bookingSource } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Determine queue position
    let queuePosition = 1;
    if (sessionId) {
      const existingCount = await Appointment.countDocuments({ session: sessionId, status: { $nin: ['Cancelled'] } });
      queuePosition = existingCount + 1;
      await Session.findByIdAndUpdate(sessionId, { $inc: { currentPatients: 1 } });
    }

    const appointment = await Appointment.create({
      patient: patientId, patientName: patient.fullName, patientEmail: patient.email,
      doctor: doctorId, doctorName: doctor.fullName,
      session: sessionId || undefined, department, specialization,
      consultType: consultType || 'General Consultation',
      appointmentDate: new Date(appointmentDate), timeSlot,
      queuePosition, notes: notes || '',
      bookingSource: bookingSource || 'web',
      createdBy: req.user?.id, createdByRole: req.user?.role || 'patient',
    });

    await Patient.findByIdAndUpdate(patientId, { lastVisit: new Date() });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm appointment attendance
const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { attendanceConfirmed: true, status: 'Confirmed' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment confirmed successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appointment.session) await Session.findByIdAndUpdate(appointment.session, { $inc: { currentPatients: -1 } });
    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointment stats
const getAppointmentStats = async (req, res) => {
  try {
    const total = await Appointment.countDocuments();
    const today = new Date(); today.setHours(0,0,0,0);
    const todayEnd = new Date(today); todayEnd.setHours(23,59,59,999);
    const todayTotal = await Appointment.countDocuments({ appointmentDate: { $gte: today, $lte: todayEnd } });
    const pending = await Appointment.countDocuments({ status: 'Pending' });
    const confirmed = await Appointment.countDocuments({ status: 'Confirmed' });
    const completed = await Appointment.countDocuments({ status: 'Completed' });
    res.json({ success: true, data: { total, todayTotal, pending, confirmed, completed } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAppointments, getLiveQueue, getAllQueues, createAppointment, confirmAppointment, cancelAppointment, getAppointmentStats };
