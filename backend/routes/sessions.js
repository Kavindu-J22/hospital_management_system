const express = require('express');
const router = express.Router();
const { getSessions, getDoctorSessions, createSession, extendSession, updateSessionStatus, getSessionStats } = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getSessionStats);
router.get('/', protect, getSessions);
router.post('/', protect, authorize('admin', 'staff', 'doctor'), createSession);
router.get('/doctor/:doctorId', getDoctorSessions); // public - patients need this to book
router.patch('/:id/extend', protect, authorize('admin', 'staff', 'doctor'), extendSession);
router.patch('/:id/status', protect, authorize('admin', 'staff', 'doctor'), updateSessionStatus);

module.exports = router;
