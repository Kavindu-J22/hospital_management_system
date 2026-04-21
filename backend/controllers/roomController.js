const Room = require('../models/Room');

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const { status, floor, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (floor) filter.floor = floor;
    if (type) filter.type = type;

    const rooms = await Room.find(filter).populate('currentOccupant.patientId', 'fullName patientId').sort({ roomNumber: 1 });
    res.json({ success: true, data: rooms, total: rooms.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available rooms (for session assignment)
const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Available' }).select('roomNumber name type floor').sort({ roomNumber: 1 });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get room stats
const getRoomStats = async (req, res) => {
  try {
    const total = await Room.countDocuments();
    const available = await Room.countDocuments({ status: 'Available' });
    const occupied = await Room.countDocuments({ status: 'Occupied' });
    const cleaning = await Room.countDocuments({ status: 'Cleaning' });
    const maintenance = await Room.countDocuments({ status: 'Maintenance' });
    res.json({ success: true, data: { total, available, occupied, cleaning, maintenance } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single room
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('currentOccupant.patientId', 'fullName patientId');
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create room (admin only)
const createRoom = async (req, res) => {
  try {
    const { roomNumber, name, type, floor, wing, capacity, amenities } = req.body;
    const existing = await Room.findOne({ roomNumber });
    if (existing) return res.status(400).json({ success: false, message: 'Room number already exists' });

    const room = await Room.create({ roomNumber, name: name || `Room ${roomNumber}`, type, floor, wing, capacity, amenities });
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update room
const updateRoom = async (req, res) => {
  try {
    const { status, currentOccupant, notes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (currentOccupant !== undefined) updates.currentOccupant = currentOccupant;
    if (notes !== undefined) updates.notes = notes;
    if (status === 'Available') updates.currentOccupant = { name: '', patientId: null, admittedAt: null, condition: '' };

    const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign room to patient
const assignRoom = async (req, res) => {
  try {
    const { patientId, patientName, condition } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (room.status !== 'Available') return res.status(400).json({ success: false, message: 'Room is not available' });

    room.status = 'Occupied';
    room.currentOccupant = { name: patientName, patientId, admittedAt: new Date(), condition: condition || '' };
    await room.save();
    res.json({ success: true, message: 'Room assigned successfully', data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRooms, getAvailableRooms, getRoomStats, getRoom, createRoom, updateRoom, assignRoom };
