const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdmins, createAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin', 'staff'), getDashboardStats);
router.get('/accounts', protect, authorize('admin'), getAdmins);
router.post('/accounts', protect, authorize('admin'), createAdmin);

module.exports = router;
