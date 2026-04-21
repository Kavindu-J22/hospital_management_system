const Doctor = require('../models/Doctor');
const { sendDoctorApprovalEmail, sendDoctorRejectionEmail } = require('../config/email');

// Get all doctors (admin)
const getDoctors = async (req, res) => {
  try {
    const { status, specialization, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (specialization) filter.specialization = specialization;

    const total = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: doctors, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending doctors
const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'Pending' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: doctors, total: doctors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single doctor
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve doctor (admin only)
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (doctor.status === 'Approved') return res.status(400).json({ success: false, message: 'Doctor is already approved' });

    doctor.status = 'Approved';
    doctor.availability = 'Available';
    doctor.approvedBy = req.user.id;
    doctor.approvedAt = new Date();
    await doctor.save();

    // Send approval email
    const emailResult = await sendDoctorApprovalEmail(doctor);
    res.json({
      success: true,
      message: `Doctor ${doctor.fullName} has been approved`,
      emailSent: emailResult.success,
      data: { id: doctor._id, fullName: doctor.fullName, status: doctor.status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject doctor (admin only)
const rejectDoctor = async (req, res) => {
  try {
    const { reason } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    doctor.status = 'Rejected';
    doctor.rejectionReason = reason || '';
    await doctor.save();

    const emailResult = await sendDoctorRejectionEmail(doctor, reason);
    res.json({
      success: true,
      message: `Doctor ${doctor.fullName} has been rejected`,
      emailSent: emailResult.success,
      data: { id: doctor._id, fullName: doctor.fullName, status: doctor.status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all specializations
const getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization', { status: 'Approved' });
    res.json({ success: true, data: specializations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor profile
const updateDoctor = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'contactNumber', 'bio', 'availability', 'avatar'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDoctors, getPendingDoctors, getDoctor, approveDoctor, rejectDoctor, getSpecializations, updateDoctor };
