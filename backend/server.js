const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// 1. CORS Middleware (Must be FIRST)
app.use(cors({
    origin: [
        "https://college-placement-management.vercel.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// Preflight OPTIONS handler
app.options("*", cors());

// 2. Express JSON Body Parser (Must be SECOND)
app.use(express.json());

// 3. Static Files & Logging
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 4. API Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 5. Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
