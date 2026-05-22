const express = require('express');
const router = express.Router();
const { createStudentsBulk } = require('../controllers/adminController');
const { getDashboardStats } = require('../controllers/applicationController')
const { protect, admin, superadmin } = require('../middleware/authMiddleware');

router.post('/create-students-bulk', protect, admin, createStudentsBulk);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
