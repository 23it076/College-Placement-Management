const Student = require('../models/Student');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
const getStudentProfile = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const student = await Student.findById(req.user._id);

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private
const updateStudentProfile = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const student = await Student.findById(req.user._id);

        if (student) {
            const nextName = req.body.name;
            const nextEmail = req.body.email;
            const nextDepartment = req.body.department;
            const nextResume = req.body.resume;

            let nextCgpa = req.body.cgpa;
            if (typeof nextCgpa === 'string' && nextCgpa.trim() !== '') {
                const parsed = parseFloat(nextCgpa);
                nextCgpa = Number.isFinite(parsed) ? parsed : undefined;
            }

            let nextSkills = req.body.skills;
            if (typeof nextSkills === 'string') {
                nextSkills = nextSkills
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            } else if (Array.isArray(nextSkills)) {
                nextSkills = nextSkills.map((s) => String(s).trim()).filter(Boolean);
            } else if (nextSkills !== undefined) {
                nextSkills = undefined;
            }

            if (nextName !== undefined) student.name = nextName || student.name;
            if (nextEmail !== undefined) student.email = nextEmail || student.email;
            if (nextDepartment !== undefined) student.department = nextDepartment || student.department;
            if (nextCgpa !== undefined) student.cgpa = nextCgpa;
            if (nextSkills !== undefined) student.skills = nextSkills;
            if (nextResume !== undefined) student.resume = nextResume || '';

            if (req.body.password) {
                student.password = req.body.password;
            }

            const updatedStudent = await student.save();

            // Return the full updated profile so frontend can re-render safely.
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error && error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({ role: 'student' });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student profile by ID
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
    try {
        console.log(`GET /api/students/:id called with id: ${req.params.id}`);
        const student = await Student.findById(req.params.id);
        console.log(`Student found: ${student ? student.name : 'null'}`);

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(`getStudentById Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload student resume and Mock AI Parse
// @route   PUT /api/students/resume
// @access  Private
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const student = await Student.findById(req.user._id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.resume = `/${req.file.path.replace(/\\/g, '/')}`;

        // MOCK AI Parser Logic
        // In a real scenario, this would call OpenAI or pdf-parse to extract skills, text, etc.
        const mockParsedKeywords = ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Problem Solving', 'Teamwork'];
        const mockSuggestedCgpa = 8.5;

        // We aren't necessarily overwriting their skills automatically unless desired,
        // but let's just return the mock data so the frontend can show it or we just save it.
        student.skills = [...new Set([...student.skills, ...mockParsedKeywords.slice(0, 3)])];

        const updatedStudent = await student.save();

        res.json({
            message: 'Resume uploaded and parsed successfully',
            student: updatedStudent,
            aiAnalysis: {
                detectedSkills: mockParsedKeywords,
                confidenceScore: '92%',
                notes: 'Mock parsing complete. Requires a live API key for real PDF parsing.'
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentProfile, updateStudentProfile, getStudents, getStudentById, uploadResume };
