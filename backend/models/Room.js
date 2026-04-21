const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['General Ward', 'Private Suite', 'ICU', 'Maternity', 'Consultation', 'Operating Room', 'Emergency'],
    required: true
  },
  floor: { type: String, required: true },
  wing: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  currentOccupant: {
    name: { type: String, default: '' },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    admittedAt: { type: Date },
    condition: { type: String, default: '' }
  },
  capacity: { type: Number, default: 1 },
  amenities: [{ type: String }],
  lastCleaned: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
