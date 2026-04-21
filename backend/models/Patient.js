const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  nic: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  contactNumber: { type: String },
  address: { type: String },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String }
  },
  patientId: { type: String, unique: true },
  bloodGroup: { type: String, default: '' },
  medicalHistory: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Stable', 'Critical', 'Recovering', 'Active'],
    default: 'Active'
  },
  lastVisit: { type: Date },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Single combined pre-save hook — Mongoose 7+ async style (no next())
patientSchema.pre('save', async function () {
  // Hash password only when it has been modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // Auto-generate patient ID on first save
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `PT-${String(count + 1000).padStart(4, '0')}`;
  }
});

patientSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);
