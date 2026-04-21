const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  patientId: { type: String },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  specialization: { type: String, required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    durationUnit: { type: String, default: 'Days' },
    frequency: { type: String, default: 'Once daily (QD)' },
    instructions: { type: String, default: '' }
  }],
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Expired', 'Draft'],
    default: 'Active'
  },
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  isDraft: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
