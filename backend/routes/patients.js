const express = require('express');
const router = express.Router();
const { getPatients, getPatient, createPatient, updatePatient, getPatientStats } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin', 'staff'), getPatientStats);
router.get('/', protect, authorize('admin', 'staff', 'doctor'), getPatients);
router.post('/', protect, authorize('admin', 'staff'), createPatient);
router.get('/:id', protect, getPatient);
router.patch('/:id', protect, updatePatient);

module.exports = router;
