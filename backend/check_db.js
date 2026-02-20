const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await Student.find({});
        console.log('Total Students:', students.length);
        students.forEach(s => {
            console.log(`- ${s.name} (${s.role}): ${s._id}`);
        });
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
