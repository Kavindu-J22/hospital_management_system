const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  nic: { type: String, unique: true, sparse: true },
  specialization: { type: String, required: true },
  contactNumber: { type: String, required: true },
  yearsOfExperience: { type: Number, default: 0 },
  licenseNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  availability: {
    type: String,
    enum: ['Available', 'Unavailable', 'On Session'],
    default: 'Unavailable'
  },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
}, { timestamps: true });

// Mongoose 7+ async style — no next()
doctorSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
