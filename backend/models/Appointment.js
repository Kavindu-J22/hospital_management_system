const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  department: { type: String, required: true },
  specialization: { type: String, required: true },
  consultType: { type: String, default: 'General Consultation' },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String },
  duration: { type: String, default: '30 mins' },
  ticketNumber: { type: String, unique: true },
  queuePosition: { type: Number },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No-Show'],
    default: 'Pending'
  },
  attendanceConfirmed: { type: Boolean, default: false },
  confirmationEmailSent: { type: Boolean, default: false },
  confirmationEmailSentAt: { type: Date },
  bookingSource: {
    type: String,
    enum: ['web', 'phone', 'chatbot'],
    default: 'web'
  },
  notes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId },
  createdByRole: { type: String, enum: ['patient', 'admin', 'staff'] },
}, { timestamps: true });

// Auto-generate ticket number
appointmentSchema.pre('save', async function () {
  if (!this.ticketNumber) {
    const prefix = this.specialization ? this.specialization.substring(0, 1).toUpperCase() : 'A';
    const count = await mongoose.model('Appointment').countDocuments();
    this.ticketNumber = `${prefix}-${String(count + 100).padStart(3, '0')}`;
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
