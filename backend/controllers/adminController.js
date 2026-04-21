const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Session = require('../models/Session');
const Room = require('../models/Room');

// Admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today); todayEnd.setHours(23, 59, 59, 999);

    const [
      totalPatients, criticalPatients,
      totalDoctors, activeDoctors, pendingDoctors,
      totalRooms, availableRooms, occupiedRooms,
      todayAppointments, totalAppointments,
      activeSessions,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ status: 'Critical' }),
      Doctor.countDocuments({ status: 'Approved' }),
      Doctor.countDocuments({ status: 'Approved', availability: 'Available' }),
      Doctor.countDocuments({ status: 'Pending' }),
      Room.countDocuments(),
      Room.countDocuments({ status: 'Available' }),
      Room.countDocuments({ status: 'Occupied' }),
      Appointment.countDocuments({ appointmentDate: { $gte: today, $lte: todayEnd } }),
      Appointment.countDocuments(),
      Session.countDocuments({ status: { $in: ['Active', 'Upcoming'] } }),
    ]);

    res.json({
      success: true,
      data: {
        patients: { total: totalPatients, critical: criticalPatients },
        doctors: { total: totalDoctors, active: activeDoctors, pending: pendingDoctors },
        rooms: { total: totalRooms, available: availableRooms, occupied: occupiedRooms },
        appointments: { today: todayAppointments, total: totalAppointments },
        sessions: { active: activeSessions },
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: admins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// Create staff/admin account
const createAdmin = async (req, res) => {
  try {
    const { fullName, email, eid, password, role, title } = req.body;
    const existing = await Admin.findOne({ $or: [{ email }, { eid }] });
    if (existing) return res.status(400).json({ success: false, message: 'Email or EID already exists' });
    const admin = await Admin.create({ fullName, email, eid, password, role: role || 'admin', title: title || 'Hospital Administrator' });
    res.status(201).json({ success: true, message: 'Account created successfully', data: { id: admin._id, fullName: admin.fullName, role: admin.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getDashboardStats, getAdmins, createAdmin };
