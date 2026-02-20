const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a company name'],
        unique: true,
    },
    role: {
        type: String,
        required: [true, 'Please add a job role'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    ctc: {
        type: Number,
        required: [true, 'Please add package details'],
    },
    eligibility: {
        cgpa: {
            type: Number,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        branches: {
            type: [String],
            required: true,
        },
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Company', companySchema);
