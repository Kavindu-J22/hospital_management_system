const express = require('express');
const router = express.Router();
const { getRooms, getAvailableRooms, getRoomStats, getRoom, createRoom, updateRoom, assignRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.get('/available', protect, getAvailableRooms);
router.get('/stats', protect, authorize('admin', 'staff'), getRoomStats);
router.get('/', protect, authorize('admin', 'staff'), getRooms);
router.post('/', protect, authorize('admin'), createRoom);
router.get('/:id', protect, getRoom);
router.patch('/:id', protect, authorize('admin', 'staff'), updateRoom);
router.post('/:id/assign', protect, authorize('admin', 'staff'), assignRoom);

module.exports = router;
