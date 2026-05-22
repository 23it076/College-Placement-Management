const Application = require('../models/Application');

// @desc    Apply for a company
// @route   POST /api/applications/apply/:companyId
// @access  Private/Student
const applyToJob = async (req, res) => {
    try {
        const { companyId } = req.params;

        const Company = require('../models/Company');
        const Student = require('../models/Student');

        const company = await Company.findById(companyId);
        const student = await Student.findById(req.user._id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        if (company.eligibility) {
            if (student.cgpa < company.eligibility.cgpa) {
                return res.status(403).json({ message: 'You do not meet the eligibility criteria (CGPA)' });
            }

            if (student.backlogs > (company.eligibility.maxBacklogs || 0)) {
                return res.status(403).json({ message: 'You do not meet the eligibility criteria (Backlogs)' });
            }

            if (company.eligibility.branches && company.eligibility.branches.length > 0) {
                const isBranchEligible = company.eligibility.branches.some(branch =>
                    branch.toLowerCase() === student.department.toLowerCase()
                );

                if (!isBranchEligible) {
                    return res.status(403).json({ message: 'You do not meet the eligibility criteria' });
                }
            }
        }

        const existingApplication = await Application.findOne({
            student: req.user._id,
            company: companyId,
        });

        if (existingApplication) {
            res.status(400).json({ message: 'You have already applied to this company' });
            return;
        }

        const application = new Application({
            student: req.user._id,
            company: companyId,
        });

        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my applications
// @route   GET /api/applications/my
// @access  Private/Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id }).populate(
            'company'
        );
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a company
// @route   GET /api/applications/company/:companyId
// @access  Private/Admin|HR
const getApplicationsByCompany = async (req, res) => {
    try {
        if (req.user.role === 'hr' && req.user.companyId?.toString() !== req.params.companyId) {
            return res.status(403).json({ message: 'Not authorized for this company' });
        }
        const applications = await Application.find({
            company: req.params.companyId,
        }).populate('student', '-password');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin|HR
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('student')
            .populate('company');

        if (application) {
            if (req.user.role === 'hr' && req.user.companyId?.toString() !== application.company._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update an application for this company' });
            }

            application.status = status;
            const updatedApplication = await application.save();

            // Trigger notification
            if (status === 'Shortlisted' || status === 'Selected') {
                const { sendEmail } = require('../utils/emailService');
                await sendEmail(
                    application.student.email,
                    status,
                    application.company.name,
                    application.student.name
                );
            }

            res.json(updatedApplication);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('student', '-password')
            .populate('company');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics
// @route   GET /api/applications/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const Student = require('../models/Student');
        const Company = require('../models/Company');

        // Total Students
        const totalStudentsCount = await Student.countDocuments();

        // Get all hired applications to base stats off of
        const hiredApplications = await Application.find({ status: 'Selected' })
            .populate('company', 'name ctc')
            .populate('student', 'department');

        const totalPlacedStudents = hiredApplications.length;

        // Calculate highest package
        let highestPackage = 0;
        hiredApplications.forEach(app => {
            if (app.company && app.company.ctc > highestPackage) {
                highestPackage = app.company.ctc;
            }
        });

        // Company wise placements
        const companyPlacementsMap = {};
        hiredApplications.forEach(app => {
            if (app.company) {
                const companyName = app.company.name;
                companyPlacementsMap[companyName] = (companyPlacementsMap[companyName] || 0) + 1;
            }
        });
        const companyWisePlacements = Object.entries(companyPlacementsMap).map(([name, count]) => ({
            name,
            placed: count
        }));

        // Branch wise placements  
        const branchPlacementsMap = {};
        hiredApplications.forEach(app => {
            if (app.student && app.student.department) {
                const branch = app.student.department;
                branchPlacementsMap[branch] = (branchPlacementsMap[branch] || 0) + 1;
            }
        });

        // Combine with total students per branch
        const students = await Student.find({}, 'department');
        const branchTotalsMap = {};
        students.forEach(s => {
            const branch = s.department || 'Unknown';
            branchTotalsMap[branch] = (branchTotalsMap[branch] || 0) + 1;
        });

        const branchWisePlacements = Object.keys(branchTotalsMap).map(branch => ({
            name: branch,
            Students: branchTotalsMap[branch],
            Placed: branchPlacementsMap[branch] || 0
        }));

        res.json({
            totalStudents: totalStudentsCount,
            totalPlacedStudents,
            highestPackage,
            companyWisePlacements,
            branchWisePlacements
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin|Superadmin
const getDashboardStats = async (req, res) => {
    try {
        const Student = require('../models/Student');
        const Company = require('../models/Company');

        const totalStudents = await Student.countDocuments({ role: 'student' });
        const totalCompanies = await Company.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalSelectedStudents = await Application.countDocuments({ status: 'Selected' });

        res.json({
            totalStudents,
            totalCompanies,
            totalApplications,
            totalSelectedStudents
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

module.exports = {
    getApplications,
    getAnalytics,
    getDashboardStats,
    applyToJob,
    getMyApplications,
    getApplicationsByCompany,
    updateApplicationStatus,
};
