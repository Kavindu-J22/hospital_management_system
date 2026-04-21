const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const rooms = await Room.find({});
        console.log(rooms);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
