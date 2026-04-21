const express = require('express');
const router = express.Router();
const { getAppointments, getLiveQueue, getAllQueues, createAppointment, confirmAppointment, cancelAppointment, getAppointmentStats } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getAppointmentStats);
router.get('/queue', protect, getAllQueues);
router.get('/queue/:sessionId', getLiveQueue); // public for display
router.get('/', protect, getAppointments);
router.post('/', protect, createAppointment);
router.patch('/:id/confirm', confirmAppointment); // public link from email
router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;
