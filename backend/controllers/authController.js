const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { generateToken } = require('../middleware/auth');

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { eid, password } = req.body;
    if (!eid || !password) return res.status(400).json({ success: false, message: 'EID and password are required' });

    const admin = await Admin.findOne({ eid });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid EID or password' });
    }
    if (!admin.isActive) return res.status(403).json({ success: false, message: 'Account is deactivated' });

    const token = generateToken(admin._id, admin.role);
    res.json({
      success: true,
      token,
      user: { id: admin._id, fullName: admin.fullName, email: admin.email, role: admin.role, title: admin.title, eid: admin.eid }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor Login
const doctorLogin = async (req, res) => {
  try {
    const { nic, password } = req.body;
    if (!nic || !password) return res.status(400).json({ success: false, message: 'NIC and password are required' });

    const doctor = await Doctor.findOne({ nic });
    if (!doctor) return res.status(401).json({ success: false, message: 'Invalid NIC or password' });
    if (!doctor.password || !(await doctor.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid NIC or password' });
    }
    if (doctor.status !== 'Approved') {
      const msg = doctor.status === 'Pending'
        ? 'Your account is pending admin approval. You will be notified by email once approved.'
        : 'Your account has been rejected. Please contact the hospital administration.';
      return res.status(403).json({ success: false, message: msg, status: doctor.status });
    }

    const token = generateToken(doctor._id, 'doctor');
    res.json({
      success: true,
      token,
      user: { id: doctor._id, fullName: doctor.fullName, email: doctor.email, role: 'doctor', specialization: doctor.specialization, nic: doctor.nic }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor Registration
const doctorRegister = async (req, res) => {
  try {
    const { fullName, email, specialization, contactNumber, yearsOfExperience, licenseNumber, nic, password } = req.body;
    const existing = await Doctor.findOne({ $or: [{ email }, { licenseNumber }, ...(nic ? [{ nic }] : [])] });
    if (existing) {
      const field = existing.email === email ? 'Email' : existing.licenseNumber === licenseNumber ? 'License number' : 'NIC';
      return res.status(400).json({ success: false, message: `${field} is already registered` });
    }

    const doctor = await Doctor.create({
      fullName, email, specialization, contactNumber,
      yearsOfExperience: yearsOfExperience || 0,
      licenseNumber, nic: nic || undefined,
      password: password || licenseNumber, // default password = license number
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Pending admin approval. You will receive an email once approved.',
      doctor: { id: doctor._id, fullName: doctor.fullName, email: doctor.email, status: doctor.status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Patient Login
const patientLogin = async (req, res) => {
  try {
    const { nic, password } = req.body;
    if (!nic || !password) return res.status(400).json({ success: false, message: 'NIC and password are required' });

    const patient = await Patient.findOne({ nic });
    if (!patient || !(await patient.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid NIC or password' });
    }
    if (!patient.isActive) return res.status(403).json({ success: false, message: 'Account is deactivated' });

    const token = generateToken(patient._id, 'patient');
    res.json({
      success: true,
      token,
      user: { id: patient._id, fullName: patient.fullName, email: patient.email, role: 'patient', patientId: patient.patientId, nic: patient.nic }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Patient Registration
const patientRegister = async (req, res) => {
  try {
    const { fullName, email, password, nic, dateOfBirth, gender, contactNumber, address, emergencyContact } = req.body;
    const existing = await Patient.findOne({ $or: [{ email }, { nic }] });
    if (existing) {
      return res.status(400).json({ success: false, message: existing.email === email ? 'Email already registered' : 'NIC already registered' });
    }

    const patient = await Patient.create({ fullName, email, password, nic, dateOfBirth, gender, contactNumber, address, emergencyContact });

    const token = generateToken(patient._id, 'patient');
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: patient._id, fullName: patient.fullName, email: patient.email, role: 'patient', patientId: patient.patientId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  res.json({ success: true, user: req.userDoc });
};

module.exports = { adminLogin, doctorLogin, doctorRegister, patientLogin, patientRegister, getMe };
