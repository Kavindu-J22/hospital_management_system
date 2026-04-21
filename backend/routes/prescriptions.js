const express = require('express');
const router = express.Router();
const { getPrescriptions, getPrescription, getPatientPrescriptions, getDoctorPrescriptions, createPrescription, updatePrescription } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getPrescriptions);
router.post('/', protect, authorize('admin', 'staff', 'doctor'), createPrescription);
router.get('/patient/:patientId', protect, getPatientPrescriptions);
router.get('/doctor/:doctorId', protect, getDoctorPrescriptions);
router.get('/:id', protect, getPrescription);
router.patch('/:id', protect, authorize('admin', 'staff', 'doctor'), updatePrescription);

module.exports = router;
