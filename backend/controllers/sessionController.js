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
    const { status, bookable } = req.query;
    const filter = { doctor: req.params.doctorId };

    if (status) {
      filter.status = status;
    } else if (bookable !== 'false') {
      // Default: only show upcoming/active sessions for booking
      filter.status = { $in: ['Upcoming', 'Active'] };
      // Only future sessions (from today onwards)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }

    const sessions = await Session.find(filter)
      .populate('room', 'roomNumber name floor')
      .sort({ date: 1, startTime: 1 });

    // For bookable sessions, filter out full ones
    const result = (bookable !== 'false' && !status)
      ? sessions.filter(s => s.currentPatients < s.maxPatients)
      : sessions;

    res.json({ success: true, data: result });
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
    
    // NOTE: Doctor availability is NOT updated here. 
    // It will be updated to "On Session" by the cron job only when the session actually starts.

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
    
    if (newEndTime) {
      session.extendedEndTime = newEndTime;
    } else {
      // Logic to calculate newEndTime if not provided
      // For now, assume frontend provides it
    }
    
    await session.save();

    res.json({ success: true, message: `Session extended to ${session.extendedEndTime || newEndTime}`, data: session });
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
