const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register a new student/admin
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, department, cgpa, skills, resume, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !department || cgpa === undefined) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Enforce role restrictions
        if (role === 'admin' || role === 'superadmin') {
            // Note: In a true secure environment, this endpoint should not be public at all.
            // Since it is public here, to correctly restrict admin creation, we check if the requester is a superadmin. 
            // If they aren't authenticated with a token (public signup), we reject admin/superadmin creation.
            if (!req.user || req.user.role !== 'superadmin') {
                return res.status(403).json({ message: 'Only a superadmin can create an admin or superadmin account' });
            }
        }

        const userExists = await Student.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await Student.create({
            name,
            email,
            password,
            department,
            cgpa,
            skills: Array.isArray(skills) ? skills : [],
            resume: resume || '',
            role: role || 'student'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await Student.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const user = await Student.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        user.isFirstLogin = false; // Flag that password has been changed
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error updating password' });
    }
};

module.exports = { registerUser, authUser, changePassword };
