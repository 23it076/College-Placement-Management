const Application = require('../models/Application');

// @desc    Apply for a company
// @route   POST /api/applications/apply/:companyId
// @access  Private/Student
const applyForCompany = async (req, res) => {
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
                return res.status(403).json({ message: `Eligibility failed: Minimum CGPA of ${company.eligibility.cgpa} is required.` });
            }

            if (company.eligibility.branches && company.eligibility.branches.length > 0) {
                const isBranchEligible = company.eligibility.branches.some(branch =>
                    branch.toLowerCase() === student.department.toLowerCase()
                );

                if (!isBranchEligible) {
                    return res.status(403).json({ message: `Eligibility failed: Your branch (${student.department}) is not eligible.` });
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
            if (status === 'shortlisted' || status === 'hired') {
                const { sendStatusEmail } = require('../utils/emailService');
                await sendStatusEmail(
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

module.exports = {
    getApplications,
    applyForCompany,
    getMyApplications,
    getApplicationsByCompany,
    updateApplicationStatus,
};
