const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Room = require('./models/Room');
const Session = require('./models/Session');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const rooms = await Room.find({}).populate('currentOccupant.patientId', 'fullName patientId').sort({ roomNumber: 1 });
        console.log("Success! Room count:", rooms.length);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

check();
