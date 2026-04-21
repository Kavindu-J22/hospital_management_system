const express = require('express');
const router = express.Router();
const { getDoctors, getPendingDoctors, getDoctor, approveDoctor, rejectDoctor, getSpecializations, updateDoctor } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/specializations', getSpecializations);

// Admin only
router.get('/', protect, authorize('admin', 'staff'), getDoctors);
router.get('/pending', protect, authorize('admin', 'staff'), getPendingDoctors);
router.patch('/:id/approve', protect, authorize('admin'), approveDoctor);
router.patch('/:id/reject', protect, authorize('admin'), rejectDoctor);

// Doctor/admin
router.get('/:id', protect, getDoctor);
router.patch('/:id', protect, updateDoctor);

module.exports = router;
