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
            maxBacklogs: 0,
        },
        prePlacementTalkDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        prePlacementTalkVenue: 'Main Auditorium',
        aptitudeTestDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        aptitudeTestVenue: 'Computer Lab 1',
        interviewDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        interviewVenue: 'Conference Room A',
        instructions: 'Please bring a physical copy of your resume and college ID.',
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
            maxBacklogs: 1,
        },
        prePlacementTalkDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        prePlacementTalkVenue: 'Seminar Hall B',
        aptitudeTestDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        aptitudeTestVenue: 'Online',
        interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        interviewVenue: 'Virtual',
        instructions: 'Ensure stable internet connection for the aptitude test.',
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
            maxBacklogs: 2,
        },
        description: 'Create scalable backend services for e-commerce.',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
];

const students = [
    {
        name: 'Super Admin',
        email: 'superadmin@college.edu',
        password: 'superadminpassword',
        role: 'superadmin',
        department: 'System Management',
        cgpa: 10,
        skills: ['Administration', 'Security'],
        backlogs: 0,
        isFirstLogin: false,
    },
    {
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'adminpassword',
        role: 'admin',
        department: 'Administration',
        cgpa: 10,
        skills: ['Management'],
        backlogs: 0,
        isFirstLogin: false,
    },
    {
        name: 'HR Google',
        email: 'hr@google.com',
        password: 'hrpassword',
        role: 'hr',
        department: 'Human Resources',
        cgpa: 9.0,
        skills: ['Recruitment', 'Communication'],
        backlogs: 0,
        isFirstLogin: false,
    },
    {
        name: 'John Doe',
        email: 'john@college.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        cgpa: 9.2,
        skills: ['React', 'Node.js', 'MongoDB'],
        backlogs: 0,
        isFirstLogin: false,
    },
    {
        name: 'Jane Smith',
        email: 'jane@college.edu',
        password: 'password123',
        role: 'student',
        department: 'Information Technology',
        cgpa: 8.8,
        skills: ['Python', 'Machine Learning', 'SQL'],
        backlogs: 1,
        isFirstLogin: false,
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

        // Seed Students
        // Find Google for HR attachment
        const google = await Company.findOne({ name: 'Google' });

        for (let studentData of students) {
            if (studentData.role === 'hr' && google) {
                studentData.companyId = google._id;
            }
            await Student.create(studentData);
        }
        console.log('Seeded Students');

        // Seed some sample applications
        const john = await Student.findOne({ email: 'john@college.edu' });
        const amazon = await Company.findOne({ name: 'Amazon' });

        if (john && google && amazon) {
            await Application.create([
                { student: john._id, company: google._id, status: 'Applied' },
                { student: john._id, company: amazon._id, status: 'Shortlisted' },
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
