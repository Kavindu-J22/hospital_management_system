const express = require('express');
const router = express.Router();
const { adminLogin, doctorLogin, doctorRegister, patientLogin, patientRegister, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Admin
router.post('/admin/login', adminLogin);

// Doctor
router.post('/doctor/login', doctorLogin);
router.post('/doctor/register', doctorRegister);

// Patient
router.post('/patient/login', patientLogin);
router.post('/patient/register', patientRegister);

// Shared
router.get('/me', protect, getMe);

module.exports = router;
