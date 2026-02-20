const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Application = require('./models/Application');

dotenv.config();

const companies = [
    {
        name: 'Google',
        role: 'Software Engineer',
        location: 'Mountain View, CA',
        ctc: 45,
        eligibility: {
            cgpa: 8.5,
            skills: ['Data Structures', 'Algorithms', 'System Design'],
            branches: ['Computer Science', 'Information Technology'],
        },
        description: 'Design and build next-generation software applications.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
        name: 'Microsoft',
        role: 'Cloud Engineer',
        location: 'Redmond, WA',
        ctc: 38,
        eligibility: {
            cgpa: 8.0,
            skills: ['Azure', 'C#', 'Cloud Computing'],
            branches: ['Computer Science', 'Electronics'],
        },
        description: 'Build and maintain cloud infrastructure at scale.',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    },
    {
        name: 'Amazon',
        role: 'Backend Developer',
        location: 'Seattle, WA',
        ctc: 32,
        eligibility: {
            cgpa: 7.5,
            skills: ['Java', 'Spring Boot', 'AWS'],
            branches: ['Computer Science', 'Mechanical'],
        },
        description: 'Create scalable backend services for e-commerce.',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
];

const students = [
    {
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'adminpassword',
        role: 'admin',
        department: 'Administration',
        cgpa: 10,
        skills: ['Management'],
    },
    {
        name: 'John Doe',
        email: 'john@college.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        cgpa: 9.2,
        skills: ['React', 'Node.js', 'MongoDB'],
    },
    {
        name: 'Jane Smith',
        email: 'jane@college.edu',
        password: 'password123',
        role: 'student',
        department: 'Information Technology',
        cgpa: 8.8,
        skills: ['Python', 'Machine Learning', 'SQL'],
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await Student.deleteMany({});
        await Company.deleteMany({});
        await Application.deleteMany({});
        console.log('Cleared existing data');

        // Seed Companies
        const createdCompanies = await Company.insertMany(companies);
        console.log('Seeded Companies');

        // Seed Students (Need to handle password hashing)
        // InsertMany doesn't trigger pre-save hooks, so we'll create them one by one or hash manually
        for (let studentData of students) {
            // Note: Student model has a pre-save hook for hashing, but let's be safe and use .create
            await Student.create(studentData);
        }
        console.log('Seeded Students');

        // Seed some sample applications
        const john = await Student.findOne({ email: 'john@college.edu' });
        const google = await Company.findOne({ name: 'Google' });
        const amazon = await Company.findOne({ name: 'Amazon' });

        if (john && google && amazon) {
            await Application.create([
                { student: john._id, company: google._id, status: 'pending' },
                { student: john._id, company: amazon._id, status: 'shortlisted' },
            ]);
            console.log('Seeded Applications');
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
