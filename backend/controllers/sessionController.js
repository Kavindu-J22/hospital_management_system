const Session = require('../models/Session');
const Room = require('../models/Room');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Get all sessions
const getSessions = async (req, res) => {
  try {
    const { doctorId, status, date, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (doctorId) filter.doctor = doctorId;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }

    const total = await Session.countDocuments(filter);
    const sessions = await Session.find(filter)
      .populate('doctor', 'fullName specialization avatar')
      .populate('room', 'roomNumber name floor')
      .sort({ date: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: sessions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sessions for a specific doctor
const getDoctorSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { doctor: req.params.doctorId };
    if (status) filter.status = status;
    const sessions = await Session.find(filter)
      .populate('room', 'roomNumber name floor')
      .sort({ date: 1 });
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create session
const createSession = async (req, res) => {
  try {
    const { doctorId, roomId, date, startTime, endTime, maxPatients, sessionType, timeSlots, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== 'Approved') return res.status(400).json({ success: false, message: 'Invalid or unapproved doctor' });

    const room = await Room.findById(roomId);
    if (!room) return res.status(400).json({ success: false, message: 'Room not found' });
    if (room.status !== 'Available') return res.status(400).json({ success: false, message: 'Room is not available for this time slot' });

    const session = await Session.create({
      doctor: doctorId, doctorName: doctor.fullName, specialization: doctor.specialization,
      room: roomId, roomNumber: room.roomNumber, date: new Date(date),
      startTime, endTime, maxPatients: maxPatients || 12,
      sessionType: sessionType || 'In-Person',
      timeSlots: timeSlots || [], notes: notes || '',
      status: 'Upcoming',
      createdBy: req.user.id, createdByRole: req.user.role,
    });

    // Update room status to Reserved
    await Room.findByIdAndUpdate(roomId, { status: 'Reserved' });
    // Update doctor status
    await Doctor.findByIdAndUpdate(doctorId, { availability: 'On Session' });

    res.status(201).json({ success: true, data: session, message: 'Session created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Extend session
const extendSession = async (req, res) => {
  try {
    const { minutes, newEndTime } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status === 'Completed') return res.status(400).json({ success: false, message: 'Cannot extend a completed session' });

    session.status = 'Extended';
    session.extendedBy = (session.extendedBy || 0) + (minutes || 30);
    if (newEndTime) session.extendedEndTime = newEndTime;
    await session.save();

    res.json({ success: true, message: `Session extended by ${minutes || 30} minutes`, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete / cancel session
const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.status = status;
    await session.save();

    if (status === 'Completed' || status === 'Cancelled') {
      await Room.findByIdAndUpdate(session.room, { status: 'Available' });
      await Doctor.findByIdAndUpdate(session.doctor, { availability: 'Unavailable' });
    }

    res.json({ success: true, message: `Session ${status.toLowerCase()} successfully`, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get session stats
const getSessionStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayTotal = await Session.countDocuments({ date: { $gte: today, $lte: todayEnd } });
    const active = await Session.countDocuments({ status: 'Active' });
    const upcoming = await Session.countDocuments({ status: 'Upcoming' });
    const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - 7);
    const weekly = await Session.countDocuments({ date: { $gte: weekStart } });

    res.json({ success: true, data: { todayTotal, active, upcoming, weekly } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSessions, getDoctorSessions, createSession, extendSession, updateSessionStatus, getSessionStats };
