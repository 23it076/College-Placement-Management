const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Aptitude Cleared', 'Interview Scheduled', 'Selected', 'Rejected'],
        default: 'Applied',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent multiple applications to the same company by the same student
applicationSchema.index({ student: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
