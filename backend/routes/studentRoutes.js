const express = require('express');
const router = express.Router();
const {
    getStudentProfile,
    updateStudentProfile,
    getStudents,
    getStudentById,
    exportStudents,
} = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}-resume-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs are allowed'));
        }
    }
});

console.log('Routes: getStudentById type:', typeof getStudentById);

router
    .route('/profile')
    .get(protect, getStudentProfile)
    .put(protect, updateStudentProfile);

router.put('/resume', protect, upload.single('resume'), async (req, res, next) => {
    // We delegate the handler to the controller
    const { uploadResume } = require('../controllers/studentController');
    await uploadResume(req, res, next);
});

// Export Students (MUST be before /:id and / to avoid collision if they use router.use/etc)
router.get('/export', protect, admin, exportStudents);

router.route('/').get(protect, admin, getStudents);
router.route('/:id').get(protect, admin, getStudentById);

module.exports = router;
