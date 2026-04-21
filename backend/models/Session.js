const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  specialization: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomNumber: { type: String, required: true },
  sessionType: { type: String, enum: ['In-Person', 'Virtual'], default: 'In-Person' },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  // Actual datetime for auto-timeout logic
  startDateTime: { type: Date },
  endDateTime: { type: Date },
  timeSlots: [{ type: String }],
  maxPatients: { type: Number, default: 12 },
  currentPatients: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Upcoming', 'Active', 'Completed', 'Cancelled', 'Extended'],
    default: 'Upcoming'
  },
  autoTimeout: { type: Boolean, default: true },
  extendedBy: { type: Number, default: 0 }, // minutes extended
  extendedEndTime: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId },
  createdByRole: { type: String, enum: ['admin', 'doctor'] },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
