const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all patients (admin only)
const getPatients = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    // If doctor, only show patients who have had appointments with them
    if (req.user.role === 'doctor') {
      const doctorAppointments = await Appointment.find({ doctor: req.user.id }).distinct('patient');
      filter._id = { $in: doctorAppointments };
    }

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { nic: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: patients, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin creates patient
const createPatient = async (req, res) => {
  try {
    const { fullName, email, nic, dateOfBirth, gender, contactNumber, address, emergencyContact } = req.body;
    const existing = await Patient.findOne({ $or: [{ email }, { nic }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email or NIC already exists' });
    }
    // Default password = NIC for admin-created patients
    const patient = await Patient.create({ fullName, email, password: nic, nic, dateOfBirth, gender, contactNumber, address, emergencyContact });
    res.status(201).json({ success: true, message: 'Patient registered successfully', data: { id: patient._id, fullName: patient.fullName, patientId: patient.patientId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'contactNumber', 'address', 'bloodGroup', 'medicalHistory', 'status', 'lastVisit'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Patient stats (admin dashboard)
const getPatientStats = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'doctor') {
      const doctorAppointments = await Appointment.find({ doctor: req.user.id }).distinct('patient');
      filter._id = { $in: doctorAppointments };
    }

    const total = await Patient.countDocuments(filter);
    const critical = await Patient.countDocuments({ ...filter, status: 'Critical' });
    const stable = await Patient.countDocuments({ ...filter, status: 'Stable' });
    const recovering = await Patient.countDocuments({ ...filter, status: 'Recovering' });
    res.json({ success: true, data: { total, critical, stable, recovering } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, getPatientStats };
