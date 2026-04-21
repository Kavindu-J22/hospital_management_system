const Admin = require('./models/Admin');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getToken = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = await Admin.findOne({});
        if (admin) {
            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
            console.log(token);
        } else {
            console.log("No admin found");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

getToken();
