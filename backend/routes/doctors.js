const express = require('express');
const router = express.Router();
const { getDoctors, getPublicDoctors, getPendingDoctors, getDoctor, approveDoctor, rejectDoctor, getSpecializations, updateDoctor } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (no auth required)
router.get('/specializations', getSpecializations);
router.get('/public', getPublicDoctors);

// Admin/staff only
router.get('/pending', protect, authorize('admin', 'staff'), getPendingDoctors);
router.patch('/:id/approve', protect, authorize('admin'), approveDoctor);
router.patch('/:id/reject', protect, authorize('admin'), rejectDoctor);

// All authenticated users (admin, staff, doctor, patient)
router.get('/', protect, getDoctors);

// Doctor/admin
router.get('/:id', protect, getDoctor);
router.patch('/:id', protect, updateDoctor);

module.exports = router;
