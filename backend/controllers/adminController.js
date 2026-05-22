const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// @desc    Bulk create students from list of emails
// @route   POST /api/admin/create-students-bulk
// @access  Private/Admin
const createStudentsBulk = async (req, res) => {
    try {
        const { emails } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of emails' });
        }

        // Clean and validate emails
        const validEmails = emails.map(e => e.trim().toLowerCase()).filter(e => e);

        // Find existing users to avoid duplicates
        const existingUsers = await Student.find({ email: { $in: validEmails } }).select('email');
        const existingEmails = existingUsers.map(u => u.email);

        // Filter out emails that already exist
        const newEmails = validEmails.filter(e => !existingEmails.includes(e));

        if (newEmails.length === 0) {
            return res.status(400).json({ 
                message: 'All provided emails already exist in the system',
                failedEmails: existingEmails
            });
        }

        // Hash default password for all new users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('default123', salt);

        // Prepare documents for insert
        const studentsToInsert = newEmails.map(email => ({
            name: 'Student', // Default placeholder name
            email: email,
            password: hashedPassword, // Manually hash here because insertMany bypasses 'save' middleware
            role: 'student',
            department: 'Unassigned',
            cgpa: 0,
            skills: [],
            isFirstLogin: true
        }));

        const result = await Student.insertMany(studentsToInsert);

        res.status(201).json({
            message: `Successfully created ${result.length} student accounts`,
            createdCount: result.length,
            failedEmails: existingEmails,
            newAccounts: result.map(s => s.email)
        });

    } catch (error) {
        console.error('Bulk Creation Error:', error);
        res.status(500).json({ message: 'Server error during bulk creation' });
    }
};

module.exports = {
    createStudentsBulk
};
