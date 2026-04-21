const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all prescriptions
const getPrescriptions = async (req, res) => {
  try {
    const { patientId, doctorId, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (patientId) filter.patient = patientId;
    if (doctorId) filter.doctor = doctorId;
    if (status) filter.status = status;

    const total = await Prescription.countDocuments(filter);
    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'fullName patientId dateOfBirth gender')
      .populate('doctor', 'fullName specialization')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: prescriptions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single prescription
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'fullName patientId dateOfBirth gender bloodGroup')
      .populate('doctor', 'fullName specialization contactNumber');
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId, status: { $ne: 'Draft' } })
      .populate('doctor', 'fullName specialization')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get prescriptions for a doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { doctor: req.params.doctorId };
    if (status) filter.status = status;
    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'fullName patientId dateOfBirth gender')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create prescription
const createPrescription = async (req, res) => {
  try {
    const { patientId, medications, notes, sessionId, appointmentId, isDraft } = req.body;

    const doctorId = req.user.role === 'doctor' ? req.user.id : req.body.doctorId;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    if (!medications || medications.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one medication is required' });
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const prescription = await Prescription.create({
      patient: patientId, patientName: patient.fullName, patientId: patient.patientId,
      doctor: doctorId, doctorName: doctor.fullName, specialization: doctor.specialization,
      session: sessionId || undefined, appointment: appointmentId || undefined,
      medications, notes: notes || '',
      status: isDraft ? 'Draft' : 'Active',
      isDraft: isDraft || false,
      expiryDate,
    });

    res.status(201).json({ success: true, message: 'Prescription created successfully', data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update prescription
const updatePrescription = async (req, res) => {
  try {
    const { medications, notes, status } = req.body;
    const updates = {};
    if (medications) updates.medications = medications;
    if (notes !== undefined) updates.notes = notes;
    if (status) updates.status = status;
    if (status && status !== 'Draft') updates.isDraft = false;

    const prescription = await Prescription.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPrescriptions, getPrescription, getPatientPrescriptions, getDoctorPrescriptions, createPrescription, updatePrescription };
