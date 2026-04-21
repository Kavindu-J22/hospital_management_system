const mongoose = require('mongoose');
const Session = require('./models/Session');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const sessions = await Session.find({ status: { $in: ['Active', 'Upcoming', 'Extended'] } }).populate('room');
        console.log('--- ACTIVE / UPCOMING SESSIONS ---');
        for (const s of sessions) {
            console.log(`ID: ${s._id}`);
            console.log(`Status: ${s.status}`);
            console.log(`Date: ${s.date}`);
            console.log(`Time: ${s.startTime} - ${s.endTime}`);
            console.log(`Room: ${s.roomNumber} (${s.room?.status || 'N/A'})`);
            console.log('---------------------------');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
