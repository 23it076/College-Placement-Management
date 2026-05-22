const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getApplicationsByCompany,
    updateApplicationStatus,
    getApplications,
    getAnalytics,
} = require('../controllers/applicationController');
const { protect, admin, adminOrHr } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getApplications);

router.post('/apply/:companyId', protect, applyToJob);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/my', protect, getMyApplications);
router.get('/company/:companyId', protect, adminOrHr, getApplicationsByCompany);
router.put('/:id/status', protect, adminOrHr, updateApplicationStatus);

module.exports = router;
