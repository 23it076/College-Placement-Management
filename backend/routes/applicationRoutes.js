const express = require('express');
const router = express.Router();
const {
    applyForCompany,
    getMyApplications,
    getApplicationsByCompany,
    updateApplicationStatus,
    getApplications,
} = require('../controllers/applicationController');
const { protect, admin, adminOrHr } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getApplications);

router.post('/apply/:companyId', protect, applyForCompany);
router.get('/my', protect, getMyApplications);
router.get('/company/:companyId', protect, adminOrHr, getApplicationsByCompany);
router.put('/:id/status', protect, adminOrHr, updateApplicationStatus);

module.exports = router;
