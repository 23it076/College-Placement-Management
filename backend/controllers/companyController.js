const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
    try {
        const {
            name,
            role,
            location,
            ctc,
            eligibility,
            description,
            deadline,
        } = req.body;

        const company = new Company({
            name,
            role,
            location,
            ctc,
            eligibility,
            description,
            deadline,
        });

        const createdCompany = await company.save();
        res.status(201).json(createdCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/Admin
const updateCompany = async (req, res) => {
    try {
        const {
            name,
            role,
            location,
            ctc,
            eligibility,
            description,
            deadline,
        } = req.body;

        const company = await Company.findById(req.params.id);

        if (company) {
            company.name = name || company.name;
            company.role = role || company.role;
            company.location = location || company.location;
            company.ctc = ctc || company.ctc;
            company.eligibility = eligibility || company.eligibility;
            company.description = description || company.description;
            company.deadline = deadline || company.deadline;

            const updatedCompany = await company.save();
            res.json(updatedCompany);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            await company.deleteOne();
            res.json({ message: 'Company removed' });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
};
